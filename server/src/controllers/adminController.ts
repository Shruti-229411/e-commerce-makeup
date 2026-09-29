import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Inventory from '../models/Inventory';
import Coupon from '../models/Coupon';
import ReturnRequest from '../models/ReturnRequest';
import Review from '../models/Review';

// ==========================================
// 1. DASHBOARD METRICS
// ==========================================
// @desc    Get aggregated real-time admin metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Total Sales Revenue (Sum totalAmount of non-cancelled/non-refunded orders)
    const salesAgg = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['Cancelled', 'Refunded'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = salesAgg[0]?.totalRevenue || 0;

    // 2. Total Orders & Pending Orders Count
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    // 3. Total Customers & Registered Accounts
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Products & Active Products & Low Stock Alerts
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Inventory.countDocuments({ availableStock: { $lte: 10 } });

    // 5. Pending Returns & Pending Reviews
    const pendingReturns = await ReturnRequest.countDocuments({ status: { $in: ['Requested', 'Under Review'] } });
    const pendingReviews = await Review.countDocuments({ status: 'Pending' });

    // 6. Recent 5 Orders
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Recent 5 Registered Customers
    const recentCustomers = await User.find({ role: 'customer' })
      .select('firstName lastName email phone isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // 8. Top-Selling Products (Aggregate items across completed/delivered orders)
    const topProductsAgg = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['Cancelled'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    const populatedTopProducts = await Product.populate(topProductsAgg, {
      path: '_id',
      select: 'name images price category brand'
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        activeProducts,
        lowStockProducts,
        pendingReturns,
        pendingReviews,
        recentOrders,
        recentCustomers,
        topSellingProducts: populatedTopProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. PRODUCT MANAGEMENT (ADMIN)
// ==========================================
// @desc    Get all products for admin (including inactive)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      brand,
      category,
      subcategory,
      images,
      price,
      mrp,
      sku,
      stock,
      tags,
      ingredients,
      usageInstructions,
      highlights,
      variants,
      isFeatured,
      isBestseller,
      isNewArrival,
      isActive
    } = req.body;

    if (!name || !price || !mrp || !brand || !category || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Missing required product fields: name, price, mrp, brand, category, sku.'
      });
    }

    if (Number(price) <= 0 || Number(mrp) < Number(price)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing. Price must be > 0 and MRP must be >= Price.'
      });
    }

    // Check SKU Uniqueness
    const existingSku = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existingSku) {
      return res.status(400).json({ success: false, message: `Product with SKU '${sku}' already exists.` });
    }

    // Generate or Check Slug Uniqueness
    const generatedSlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingSlug = await Product.findOne({ slug: generatedSlug });
    if (existingSlug) {
      return res.status(400).json({ success: false, message: `Product slug '${generatedSlug}' already exists.` });
    }

    const discount = Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100);

    const product = await Product.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description || name,
      shortDescription: shortDescription || name,
      brand,
      category,
      subcategory,
      images: images && images.length > 0 ? images : ['/uploads/products/default.jpg'],
      price: Number(price),
      mrp: Number(mrp),
      discount,
      sku: sku.trim().toUpperCase(),
      stock: Number(stock) || 0,
      tags: tags || [],
      ingredients: ingredients || '',
      usageInstructions: usageInstructions || '',
      highlights: highlights || [],
      variants: variants || [],
      isFeatured: !!isFeatured,
      isBestseller: !!isBestseller,
      isNewArrival: !!isNewArrival,
      isActive: isActive !== undefined ? !!isActive : true
    });

    // Create corresponding Inventory record
    await Inventory.create({
      sku: product.sku,
      product: product._id,
      availableStock: product.stock,
      reservedStock: 0,
      lowStockThreshold: 10,
      status: product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name,
      slug,
      description,
      shortDescription,
      brand,
      category,
      subcategory,
      images,
      price,
      mrp,
      sku,
      stock,
      tags,
      ingredients,
      usageInstructions,
      highlights,
      variants,
      isFeatured,
      isBestseller,
      isNewArrival,
      isActive
    } = req.body;

    if (price !== undefined && Number(price) <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be greater than 0.' });
    }

    if (mrp !== undefined && price !== undefined && Number(mrp) < Number(price)) {
      return res.status(400).json({ success: false, message: 'MRP cannot be less than selling price.' });
    }

    if (sku && sku.trim().toUpperCase() !== product.sku) {
      const skuCheck = await Product.findOne({ sku: sku.trim().toUpperCase() });
      if (skuCheck) {
        return res.status(400).json({ success: false, message: `SKU '${sku}' is already in use by another product.` });
      }
      product.sku = sku.trim().toUpperCase();
    }

    if (slug && slug.trim().toLowerCase() !== product.slug) {
      const slugCheck = await Product.findOne({ slug: slug.trim().toLowerCase() });
      if (slugCheck) {
        return res.status(400).json({ success: false, message: `Slug '${slug}' is already in use.` });
      }
      product.slug = slug.trim().toLowerCase();
    }

    if (name) product.name = name.trim();
    if (description) product.description = description;
    if (shortDescription) product.shortDescription = shortDescription;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (images) product.images = images;
    if (price !== undefined) product.price = Number(price);
    if (mrp !== undefined) product.mrp = Number(mrp);
    if (product.mrp && product.price) {
      product.discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }
    if (stock !== undefined) {
      product.stock = Math.max(0, Number(stock));
      // Sync Inventory
      await Inventory.findOneAndUpdate(
        { product: product._id },
        {
          availableStock: product.stock,
          status: product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
        }
      );
    }
    if (tags) product.tags = tags;
    if (ingredients !== undefined) product.ingredients = ingredients;
    if (usageInstructions !== undefined) product.usageInstructions = usageInstructions;
    if (highlights) product.highlights = highlights;
    if (variants) product.variants = variants;
    if (isFeatured !== undefined) product.isFeatured = !!isFeatured;
    if (isBestseller !== undefined) product.isBestseller = !!isBestseller;
    if (isNewArrival !== undefined) product.isNewArrival = !!isNewArrival;
    if (isActive !== undefined) product.isActive = !!isActive;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete / Deactivate a product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Soft delete to protect historical orders
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully (Historical orders preserved).'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. CATEGORY & BRAND MANAGEMENT (ADMIN)
// ==========================================
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, image, parentCategory, active, displayOrder } = req.body;

    if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });

    const genSlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await Category.findOne({ slug: genSlug });
    if (existing) return res.status(400).json({ success: false, message: `Category slug '${genSlug}' already exists.` });

    const category = await Category.create({
      name: name.trim(),
      slug: genSlug,
      description: description || '',
      image: image || '',
      parentCategory: parentCategory || null,
      active: active !== undefined ? !!active : true,
      displayOrder: displayOrder || 0
    });

    res.status(201).json({ success: true, message: 'Category created successfully.', category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    res.status(200).json({ success: true, message: 'Category updated successfully.', category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    category.active = false;
    await category.save();

    res.status(200).json({ success: true, message: 'Category deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, logo, description, banner, active } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Brand name is required.' });

    const genSlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await Brand.findOne({ slug: genSlug });
    if (existing) return res.status(400).json({ success: false, message: `Brand slug '${genSlug}' already exists.` });

    const brand = await Brand.create({
      name: name.trim(),
      slug: genSlug,
      logo: logo || '/uploads/brands/default.jpg',
      description: description || '',
      banner: banner || '',
      active: active !== undefined ? !!active : true
    });

    res.status(201).json({ success: true, message: 'Brand created successfully.', brand });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found.' });

    res.status(200).json({ success: true, message: 'Brand updated successfully.', brand });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found.' });

    brand.active = false;
    await brand.save();

    res.status(200).json({ success: true, message: 'Brand deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. ORDER FULFILLMENT MANAGEMENT (ADMIN)
// ==========================================
// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, paymentStatus } = req.query;
    const query: any = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status & tracking number (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, paymentStatus, note } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus && orderStatus !== previousStatus) {
      order.orderStatus = orderStatus;

      // Append to status history without overwriting previous entries
      order.statusHistory.push({
        status: orderStatus,
        timestamp: new Date(),
        note: note || `Status updated by Admin to ${orderStatus}`
      });

      // Handle Cancellation / Return Inventory Restoration (If not already restored)
      if (['Cancelled', 'Returned'].includes(orderStatus) && !['Cancelled', 'Returned'].includes(previousStatus)) {
        for (const item of order.items) {
          const prodId = item.product;
          if (prodId) {
            await Product.findByIdAndUpdate(prodId, { $inc: { stock: item.quantity } });
            await Inventory.findOneAndUpdate({ product: prodId }, { $inc: { availableStock: item.quantity } });
          }
        }
      }
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order ${order.orderNumber} status updated to ${order.orderStatus}.`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. INVENTORY MANAGEMENT (ADMIN)
// ==========================================
// @desc    Get all inventory stock levels
// @route   GET /api/admin/inventory
// @access  Private/Admin
export const getAdminInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventories = await Inventory.find()
      .populate('product', 'name images price sku isActive')
      .sort({ availableStock: 1 });

    res.status(200).json({
      success: true,
      count: inventories.length,
      inventories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust inventory stock level (Admin)
// @route   PUT /api/admin/inventory/:id
// @access  Private/Admin
export const updateInventoryStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { availableStock, lowStockThreshold } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory record not found.' });
    }

    if (availableStock !== undefined) {
      const newStock = Number(availableStock);
      if (isNaN(newStock) || newStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid stock value. Inventory availableStock cannot be negative.'
        });
      }

      inventory.availableStock = newStock;
      inventory.status = newStock > (inventory.lowStockThreshold || 10) ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock';

      // Sync master Product.stock
      await Product.findByIdAndUpdate(inventory.product, { stock: newStock });
    }

    if (lowStockThreshold !== undefined && Number(lowStockThreshold) >= 0) {
      inventory.lowStockThreshold = Number(lowStockThreshold);
    }

    await inventory.save();

    res.status(200).json({
      success: true,
      message: 'Inventory stock level updated successfully.',
      inventory
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. COUPON MANAGEMENT (ADMIN)
// ==========================================
export const getAdminCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, discountType, discountValue, minimumOrderValue, maximumDiscount, expiryDate, active } = req.body;

    if (!code || !discountValue || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Code, discountValue, and expiryDate are required.' });
    }

    const uppercaseCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: uppercaseCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon code '${uppercaseCode}' already exists.` });
    }

    const coupon = await Coupon.create({
      code: uppercaseCode,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minimumOrderValue: Number(minimumOrderValue) || 0,
      maximumDiscount: maximumDiscount ? Number(maximumDiscount) : undefined,
      expiryDate,
      active: active !== undefined ? !!active : true
    });

    res.status(201).json({ success: true, message: 'Coupon created successfully.', coupon });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });

    res.status(200).json({ success: true, message: 'Coupon updated successfully.', coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. CUSTOMER MANAGEMENT (ADMIN)
// ==========================================
export const getAdminCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCustomerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot deactivate an Administrator account.' });
    }

    user.isActive = isActive !== undefined ? !!isActive : !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Customer ${user.email} status set to ${user.isActive ? 'Active' : 'Deactivated'}.`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 8. RETURN REQUEST MANAGEMENT (ADMIN)
// ==========================================
export const getAdminReturns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const returns = await ReturnRequest.find()
      .populate('user', 'firstName lastName email')
      .populate('order', 'orderNumber totalAmount orderStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: returns.length,
      returns
    });
  } catch (error) {
    next(error);
  }
};

export const updateReturnStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, refundAmount } = req.body;

    const returnReq = await ReturnRequest.findById(id).populate('order');
    if (!returnReq) {
      return res.status(404).json({ success: false, message: 'Return request not found.' });
    }

    const previousStatus = returnReq.status;

    if (status) returnReq.status = status;
    if (adminNotes !== undefined) returnReq.adminNotes = adminNotes;
    if (refundAmount !== undefined) returnReq.refundAmount = Number(refundAmount);

    // SAFE SINGLE INVENTORY RESTORATION: Only restore when reaching 'Returned' or 'Refunded' and not already restored
    if (['Returned', 'Refunded'].includes(status) && !['Returned', 'Refunded'].includes(previousStatus)) {
      const order = returnReq.order as any;
      if (order && order.items && order.orderStatus !== 'Returned') {
        order.orderStatus = 'Returned';
        order.statusHistory.push({
          status: 'Returned',
          timestamp: new Date().toISOString(),
          note: `Order set to Returned upon Return Request approval #${returnReq._id}`
        });
        await order.save();

        for (const item of order.items) {
          if (item.product) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            await Inventory.findOneAndUpdate({ product: item.product }, { $inc: { availableStock: item.quantity } });
          }
        }
      }
    }

    await returnReq.save();

    res.status(200).json({
      success: true,
      message: `Return request status updated to ${returnReq.status}.`,
      returnRequest: returnReq
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 9. REVIEW MODERATION (ADMIN)
// ==========================================
export const getAdminReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'firstName lastName email')
      .populate('product', 'name images')
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

export const updateReviewStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    // Admin can moderate status ('Approved', 'Rejected', 'Pending'), but isVerifiedPurchase remains strictly derived
    if (status) review.status = status;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review status set to ${review.status}.`,
      review
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReviewAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
