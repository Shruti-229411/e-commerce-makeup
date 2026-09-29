import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IStatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  itemsPrice: number;
  discountAmount: number;
  couponCode?: string;
  deliveryFee: number;
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'COD' | 'Card' | 'UPI' | 'NetBanking' | 'Mock';
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  orderStatus:
    | 'Pending'
    | 'Confirmed'
    | 'Processing'
    | 'Shipped'
    | 'Out for delivery'
    | 'Delivered'
    | 'Cancelled'
    | 'Returned';
  trackingNumber?: string;
  expectedDeliveryDate?: Date;
  statusHistory: IStatusHistory[];
  cancelReason?: string;
  returnReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String, default: null },
  variantName: { type: String, default: '' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true }
});

const StatusHistorySchema = new Schema<IStatusHistory>({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' }
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    itemsPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      apartment: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card', 'UPI', 'NetBanking', 'Mock'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Out for delivery',
        'Delivered',
        'Cancelled',
        'Returned'
      ],
      default: 'Pending',
      index: true
    },
    trackingNumber: { type: String, default: '' },
    expectedDeliveryDate: { type: Date },
    statusHistory: [StatusHistorySchema],
    cancelReason: { type: String, default: '' },
    returnReason: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
