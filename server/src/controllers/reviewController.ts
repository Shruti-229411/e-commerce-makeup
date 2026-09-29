import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import Product from '../models/Product';

// Helper to recalculate product rating average
const updateProductRating = async (productId: any) => {
  const reviews = await Review.find({ product: productId, status: 'Approved' });
  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = Number((totalRating / reviews.length).toFixed(1));

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    reviewCount: reviews.length
  });
};

// @desc    Submit a new product review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { productId, rating, title, comment, images } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, rating, title, and comment.'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check duplicate review
    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.'
      });
    }

    // STRICT BACKEND VERIFIED PURCHASE CHECK
    // Search user's order history for a delivered order containing this product
    const verifiedOrder = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: 'Delivered'
    });

    const isVerifiedPurchase = !!verifiedOrder;

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: images || [],
      isVerifiedPurchase,
      helpfulVotes: 0,
      status: 'Approved'
    });

    await updateProductRating(productId);
    await review.populate('user', 'firstName lastName profileImage');

    res.status(201).json({
      success: true,
      message: isVerifiedPurchase
        ? 'Thank you! Your verified purchase review has been published.'
        : 'Thank you! Your review has been published.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId, status: 'Approved' })
      .populate('user', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get authenticated user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images slug price rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's own review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Cannot modify another user review.' });
    }

    const { rating, title, comment, images } = req.body;
    if (rating) review.rating = Number(rating);
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();
    await updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user's own review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Cannot delete another user review.' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(id);
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
