import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: mongoose.Types.ObjectId;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
    active: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

CategorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ICategory>('Category', CategorySchema);
