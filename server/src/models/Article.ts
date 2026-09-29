import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  bannerImage: string;
  author: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    bannerImage: { type: String, required: true },
    author: { type: String, default: 'GlowCart Editorial Team' },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    readTimeMinutes: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

export default mongoose.model<IArticle>('Article', ArticleSchema);
