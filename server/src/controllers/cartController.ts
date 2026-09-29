import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Coupon from '../models/Coupon';

// Helper to compute cart totals
const computeCartTotals = async (cart: any) => {
  let subtotal = 0;
  for (const item of cart.items) {
    subtotal += item.price * item.quantity;
  }

  let discountAmount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode.toUpperCase(), active: true });
    if (coupon && new Date() <= coupon.expiryDate && subtotal >= coupon.minimumOrderValue) {
      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maximumDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
        }
      } else {
        discountAmount = coupon.discountValue;
      }
    } else {
      // Invalidate coupon if minimum order value no longer met
      cart.couponCode = null;
      cart.discountAmount = 0;
    }
  }

  cart.discountAmount = Math.round(discountAmount);
  return { subtotal, discountAmount: cart.discountAmount };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: { path: 'brand', select: 'name slug logo' }
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const { subtotal } = await computeCartTotals(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      cart,
      subtotal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or inactive.' });
    }

    // Determine price and stock based on variant
    let price = product.price;
    let availableStock = product.stock;

    if (variantId && product.variants) {
      const selectedVariant = product.variants.find((v: any) => v._id?.toString() === variantId || v.sku === variantId);
      if (selectedVariant) {
        price = selectedVariant.price;
        availableStock = selectedVariant.stock;
      }
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && (item.variantId || null) === (variantId || null)
    );

    let newQuantity = quantity;
    if (existingIndex > -1) {
      newQuantity = cart.items[existingIndex].quantity + quantity;
    }

    // Stock validation
    if (newQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${newQuantity}) exceeds available stock (${availableStock}).`
      });
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = newQuantity;
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({
        product: productId as any,
        variantId: variantId || undefined,
        quantity: newQuantity,
        price
      });
    }

    await computeCartTotals(cart);
    await cart.save();
    await cart.populate({
      path: 'items.product',
      populate: { path: 'brand', select: 'name slug logo' }
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart.',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items
// @access  Private
export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { productId, variantId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'productId and quantity are required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && (item.variantId || null) === (variantId || null)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (product) {
        let availableStock = product.stock;
        if (variantId && product.variants) {
          const v = product.variants.find((varItem: any) => varItem._id?.toString() === variantId || varItem.sku === variantId);
          if (v) availableStock = v.stock;
        }

        if (quantity > availableStock) {
          return res.status(400).json({
            success: false,
            message: `Cannot increase quantity. Available stock is ${availableStock}.`
          });
        }
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await computeCartTotals(cart);
    await cart.save();
    await cart.populate({
      path: 'items.product',
      populate: { path: 'brand', select: 'name slug logo' }
    });

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { productId } = req.params;
    const { variantId } = req.query;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && (item.variantId || null) === (variantId || null))
    );

    await computeCartTotals(cart);
    await cart.save();
    await cart.populate({
      path: 'items.product',
      populate: { path: 'brand', select: 'name slug logo' }
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      cart
    });
  } catch (error) {
    next(error);
  }
};
