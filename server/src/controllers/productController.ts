import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Brand from '../models/Brand';

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      discount,
      isFeatured,
      isBestseller,
      isNewArrival,
      inStock,
      sort,
      search
    } = req.query;

    const filterQuery: any = { isActive: true };

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filterQuery.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { sku: searchRegex }
      ];
    }

    // Category filter (by ID or slug)
    if (category) {
      if (category.toString().match(/^[0-9a-fA-F]{24}$/)) {
        filterQuery.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category as string });
        if (catDoc) filterQuery.category = catDoc._id;
      }
    }

    // Subcategory filter
    if (subcategory) {
      if (subcategory.toString().match(/^[0-9a-fA-F]{24}$/)) {
        filterQuery.subcategory = subcategory;
      } else {
        const subCatDoc = await Category.findOne({ slug: subcategory as string });
        if (subCatDoc) filterQuery.subcategory = subCatDoc._id;
      }
    }

    // Brand filter (single or array)
    if (brand) {
      const brandArray = (brand as string).split(',');
      const brandDocs = await Brand.find({
        $or: [
          { _id: { $in: brandArray.filter((b) => b.match(/^[0-9a-fA-F]{24}$/)) } },
          { slug: { $in: brandArray } }
        ]
      });
      if (brandDocs.length > 0) {
        filterQuery.brand = { $in: brandDocs.map((b) => b._id) };
      }
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filterQuery.price = {};
      if (minPrice !== undefined) filterQuery.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filterQuery.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating !== undefined) {
      filterQuery.rating = { $gte: Number(rating) };
    }

    // Discount filter
    if (discount !== undefined) {
      filterQuery.discount = { $gte: Number(discount) };
    }

    // Flags
    if (isFeatured === 'true') filterQuery.isFeatured = true;
    if (isBestseller === 'true') filterQuery.isBestseller = true;
    if (isNewArrival === 'true') filterQuery.isNewArrival = true;
    if (inStock === 'true') filterQuery.stock = { $gt: 0 };

    // Sorting
    let sortOptions: any = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating_desc') sortOptions = { rating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'discount_desc') sortOptions = { discount: -1 };
    else if (sort === 'bestseller') sortOptions = { isBestseller: -1, rating: -1 };

    const totalProducts = await Product.countDocuments(filterQuery);

    const products = await Product.find(filterQuery)
      .populate('brand', 'name slug logo')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products with suggestions
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    if (!q || q.trim().length === 0) {
      return res.status(200).json({ success: true, suggestions: [], products: [] });
    }

    const regex = new RegExp(q.trim(), 'i');

    const products = await Product.find({
      isActive: true,
      $or: [{ name: regex }, { tags: regex }, { sku: regex }]
    })
      .populate('brand', 'name slug')
      .populate('category', 'name slug')
      .limit(10);

    const suggestions = products.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      mrp: p.mrp,
      image: p.images[0],
      brandName: (p.brand as any)?.name
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      suggestions,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate('brand', 'name slug logo description banner')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .populate('brand', 'name slug')
      .limit(6);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured hero products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('brand', 'name slug logo')
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bestseller products
// @route   GET /api/products/bestsellers
// @access  Public
export const getBestsellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isBestseller: true, isActive: true })
      .populate('brand', 'name slug logo')
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .populate('brand', 'name slug logo')
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};
