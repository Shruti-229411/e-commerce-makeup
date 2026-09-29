import { Request, Response, NextFunction } from 'express';
import Coupon from '../models/Coupon';
import Cart from '../models/Cart';

// @desc    Apply coupon to cart
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), active: true });
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive promo coupon code.' });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: 'This coupon code has expired.' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.price * item.quantity;
    }

    if (subtotal < coupon.minimumOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minimumOrderValue} required for coupon ${coupon.code}.`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maximumDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    cart.couponCode = coupon.code;
    cart.discountAmount = Math.round(discountAmount);
    await cart.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} applied successfully! You saved ₹${cart.discountAmount}.`,
      couponCode: coupon.code,
      discountAmount: cart.discountAmount,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove coupon from cart
// @route   POST /api/coupons/remove
// @access  Private
export const removeCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.couponCode = undefined;
      cart.discountAmount = 0;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Coupon removed.',
      cart
    });
  } catch (error) {
    next(error);
  }
};
