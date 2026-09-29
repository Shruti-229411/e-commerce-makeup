import { Request, Response, NextFunction } from 'express';
import Brand from '../models/Brand';
import Product from '../models/Product';

// @desc    Get all active brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await Brand.find({ active: true }).sort({ name: 1 }).lean();

    // Attach product count to each brand
    const brandsWithCount = await Promise.all(
      brands.map(async (brand) => {
        const productCount = await Product.countDocuments({ brand: brand._id, isActive: true });
        return {
          ...brand,
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: brandsWithCount.length,
      brands: brandsWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get brand details by slug
// @route   GET /api/brands/slug/:slug
// @access  Public
export const getBrandBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const brand = await Brand.findOne({ slug, active: true }).lean();

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found.' });
    }

    const productCount = await Product.countDocuments({ brand: brand._id, isActive: true });

    res.status(200).json({
      success: true,
      brand: {
        ...brand,
        productCount
      }
    });
  } catch (error) {
    next(error);
  }
};
