import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo: string;
  description?: string;
  banner?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    logo: { type: String, required: true },
    description: { type: String, default: '' },
    banner: { type: String, default: '' },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

BrandSchema.index({ name: 'text' });

export default mongoose.model<IBrand>('Brand', BrandSchema);
