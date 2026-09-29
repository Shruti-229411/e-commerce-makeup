import { Request, Response, NextFunction } from 'express';
import ReturnRequest from '../models/ReturnRequest';
import Order from '../models/Order';

// @desc    Submit a new return request for a delivered order
// @route   POST /api/returns
// @access  Private
export const createReturnRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { orderId, items, reason, description } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ success: false, message: 'orderId and reason are required.' });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or access denied.' });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Only delivered orders are eligible for return requests. Current order status: ${order.orderStatus}.`
      });
    }

    // Check if duplicate active return request exists
    const existingReturn = await ReturnRequest.findOne({
      order: orderId,
      status: { $ne: 'Rejected' }
    });

    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: 'A return request for this order is already in progress.'
      });
    }

    let refundAmount = order.totalAmount;
    const returnNumber = `RET-${Math.floor(100000 + Math.random() * 900000)}`;

    const returnRequest = await ReturnRequest.create({
      returnNumber,
      order: order._id,
      user: req.user._id,
      items: items && items.length > 0 ? items : order.items.map((i) => ({ product: i.product, quantity: i.quantity, reason })),
      reason,
      description: description || '',
      status: 'Requested',
      refundAmount,
      refundStatus: 'Pending'
    });

    order.orderStatus = 'Returned';
    order.returnReason = reason;
    order.statusHistory.push({
      status: 'Returned',
      timestamp: new Date(),
      note: `Return requested by customer: ${reason}`
    });
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully.',
      returnRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer return requests
// @route   GET /api/returns/my-returns
// @access  Private
export const getMyReturnRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const returns = await ReturnRequest.find({ user: req.user._id })
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

// @desc    Get return request details by ID
// @route   GET /api/returns/:id
// @access  Private
export const getReturnById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const query: any = { _id: id };
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const returnRequest = await ReturnRequest.findOne(query).populate('order').populate('items.product');

    if (!returnRequest) {
      return res.status(404).json({ success: false, message: 'Return request not found or access denied.' });
    }

    res.status(200).json({
      success: true,
      returnRequest
    });
  } catch (error) {
    next(error);
  }
};
