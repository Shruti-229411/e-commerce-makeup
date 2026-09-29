import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  sku: string;
  name: string; // e.g. "Ruby Red", "30ml", "Pack of 2"
  type: 'shade' | 'size' | 'pack' | 'default';
  value: string; // e.g. "#D01A33" for shade hex or "30ml"
  price: number;
  mrp: number;
  stock: number;
  image?: string;
  isAvailable: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  images: string[];
  price: number;
  mrp: number;
  discount: number;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  ingredients?: string;
  usageInstructions?: string;
  highlights: string[];
  variants: IProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['shade', 'size', 'pack', 'default'], default: 'default' },
  value: { type: String, default: '' },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true }
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true, index: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    stock: { type: Number, required: true, default: 0, index: true },
    rating: { type: Number, default: 4.5, index: true },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String, index: true }],
    ingredients: { type: String, default: '' },
    usageInstructions: { type: String, default: '' },
    highlights: [{ type: String }],
    variants: [VariantSchema],
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isBestseller: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

// Full text search index
ProductSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
});

export default mongoose.model<IProduct>('Product', ProductSchema);
