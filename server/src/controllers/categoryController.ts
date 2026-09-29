import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

// @desc    Get all categories with subcategories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mainCategories = await Category.find({ parentCategory: null, active: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    const categoryTree = await Promise.all(
      mainCategories.map(async (cat) => {
        const subcategories = await Category.find({ parentCategory: cat._id, active: true })
          .sort({ displayOrder: 1, name: 1 })
          .lean();
        return {
          ...cat,
          subcategories
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoryTree.length,
      categories: categoryTree
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category details by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, active: true }).lean();

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const subcategories = await Category.find({ parentCategory: category._id, active: true }).lean();

    res.status(200).json({
      success: true,
      category: {
        ...category,
        subcategories
      }
    });
  } catch (error) {
    next(error);
  }
};
