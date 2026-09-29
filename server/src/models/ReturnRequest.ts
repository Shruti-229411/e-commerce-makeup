import mongoose, { Schema, Document } from 'mongoose';

export interface IReturnItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  reason: string;
}

export interface IReturnRequest extends Document {
  returnNumber: string;
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IReturnItem[];
  reason: string;
  description?: string;
  status:
    | 'Requested'
    | 'Under Review'
    | 'Approved'
    | 'Rejected'
    | 'Pickup Scheduled'
    | 'Returned'
    | 'Refunded';
  adminNotes?: string;
  refundAmount: number;
  refundStatus: 'Pending' | 'Processed' | 'Failed';
  createdAt: Date;
  updatedAt: Date;
}

const ReturnItemSchema = new Schema<IReturnItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  reason: { type: String, required: true }
});

const ReturnRequestSchema = new Schema<IReturnRequest>(
  {
    returnNumber: { type: String, required: true, unique: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [ReturnItemSchema],
    reason: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'Requested',
        'Under Review',
        'Approved',
        'Rejected',
        'Pickup Scheduled',
        'Returned',
        'Refunded'
      ],
      default: 'Requested',
      index: true
    },
    adminNotes: { type: String, default: '' },
    refundAmount: { type: Number, default: 0 },
    refundStatus: { type: String, enum: ['Pending', 'Processed', 'Failed'], default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.model<IReturnRequest>('ReturnRequest', ReturnRequestSchema);
