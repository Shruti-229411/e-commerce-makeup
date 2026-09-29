import { Request, Response, NextFunction } from 'express';
import Order, { IOrderItem } from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Inventory from '../models/Inventory';
import Coupon from '../models/Coupon';
import Address from '../models/Address';

// @desc    Create new order (Checkout completion)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { shippingAddressId, paymentMethod = 'COD', couponCode } = req.body;

    if (!shippingAddressId) {
      return res.status(400).json({ success: false, message: 'Shipping address selection is required.' });
    }

    const shippingAddress = await Address.findOne({ _id: shippingAddressId, user: req.user._id });
    if (!shippingAddress) {
      return res.status(404).json({ success: false, message: 'Shipping address not found.' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: { path: 'brand', select: 'name' }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    const orderItems: IOrderItem[] = [];
    let itemsPrice = 0;

    // Validate stock and snapshot items securely on backend
    for (const item of cart.items) {
      const productDoc: any = item.product;
      if (!productDoc || !productDoc.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${productDoc?.name || 'Item'} is no longer available.`
        });
      }

      let price = productDoc.price;
      let variantName = '';
      let availableStock = productDoc.stock;

      if (item.variantId && productDoc.variants) {
        const v = productDoc.variants.find(
          (varItem: any) => varItem._id?.toString() === item.variantId || varItem.sku === item.variantId
        );
        if (v) {
          price = v.price;
          variantName = v.name;
          availableStock = v.stock;
        }
      }

      if (item.quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Stock insufficient for ${productDoc.name} (${variantName || 'Standard'}). Max available: ${availableStock}.`
        });
      }

      itemsPrice += price * item.quantity;

      orderItems.push({
        product: productDoc._id,
        variantId: item.variantId,
        variantName,
        name: productDoc.name,
        price,
        quantity: item.quantity,
        image: productDoc.images[0] || ''
      });
    }

    // Coupon Calculation
    let discountAmount = 0;
    const appliedCode = couponCode || cart.couponCode;
    if (appliedCode) {
      const coupon = await Coupon.findOne({ code: appliedCode.toUpperCase(), active: true });
      if (coupon && new Date() <= coupon.expiryDate && itemsPrice >= coupon.minimumOrderValue) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (itemsPrice * coupon.discountValue) / 100;
          if (coupon.maximumDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
          }
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }

    discountAmount = Math.round(discountAmount);
    const deliveryFee = itemsPrice > 499 ? 0 : 70; // Free delivery over ₹499
    const totalAmount = itemsPrice - discountAmount + deliveryFee;

    // Generate Order Number
    const orderNumber = `GLOW-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order Document
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      itemsPrice,
      discountAmount,
      couponCode: appliedCode || null,
      deliveryFee,
      totalAmount,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        apartment: shippingAddress.apartment,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      orderStatus: 'Confirmed',
      trackingNumber: `AWB-GLOW-${Math.floor(100000 + Math.random() * 900000)}`,
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days delivery
      statusHistory: [
        { status: 'Pending', timestamp: new Date(), note: 'Order placed securely' },
        { status: 'Confirmed', timestamp: new Date(), note: 'Order confirmed and sent to fulfillment' }
      ]
    });

    // Update Product Stock & Inventory
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      await Inventory.findOneAndUpdate({ product: item.product }, { $inc: { availableStock: -item.quantity } });
    }

    // Clear Cart
    cart.items = [];
    cart.couponCode = undefined;
    cart.discountAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer order history
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const query: any = { _id: id };
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const order = await Order.findOne(query).populate({
      path: 'items.product',
      select: 'name slug images brand'
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or access denied.' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer self-service)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Confirmed' && order.orderStatus !== 'Processing') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus}.`
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelReason = reason || 'Cancelled by customer';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: reason || 'Order cancelled by customer'
    });

    await order.save();

    // Restock Inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      await Inventory.findOneAndUpdate({ product: item.product }, { $inc: { availableStock: item.quantity } });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully.',
      order
    });
  } catch (error) {
    next(error);
  }
};
