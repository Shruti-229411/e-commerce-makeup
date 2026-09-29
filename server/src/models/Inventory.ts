import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  sku: string;
  product: mongoose.Types.ObjectId;
  variantId?: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    sku: { type: String, required: true, unique: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    variantId: { type: String, default: null },
    availableStock: { type: Number, required: true, min: 0, default: 0 },
    reservedStock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock'
    }
  },
  { timestamps: true }
);

export default mongoose.model<IInventory>('Inventory', InventorySchema);
