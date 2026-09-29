import { Request, Response, NextFunction } from 'express';
import Wishlist from '../models/Wishlist';

// @desc    Get logged in user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products.product',
      populate: { path: 'brand', select: 'name slug logo' }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const existingIndex = wishlist.products.findIndex(
      (item) => item.product.toString() === productId
    );

    let isAdded = false;
    if (existingIndex > -1) {
      wishlist.products.splice(existingIndex, 1);
    } else {
      wishlist.products.push({ product: productId as any, addedAt: new Date() });
      isAdded = true;
    }

    await wishlist.save();
    await wishlist.populate({
      path: 'products.product',
      populate: { path: 'brand', select: 'name slug logo' }
    });

    res.status(200).json({
      success: true,
      message: isAdded ? 'Product added to wishlist.' : 'Product removed from wishlist.',
      isWishlisted: isAdded,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};
