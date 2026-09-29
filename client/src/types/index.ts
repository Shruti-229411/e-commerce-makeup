export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  profileImage?: string;
  preferences?: {
    skinType?: string;
    hairType?: string;
    newsletter?: boolean;
  };
  isActive: boolean;
  createdAt?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | ICategory;
  active: boolean;
  displayOrder: number;
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  banner?: string;
  active: boolean;
}

export interface IProductVariant {
  _id?: string;
  sku: string;
  name: string;
  type: 'shade' | 'size' | 'pack' | 'default';
  value: string;
  price: number;
  mrp: number;
  stock: number;
  image?: string;
  isAvailable: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: IBrand;
  category: ICategory;
  subcategory?: ICategory;
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
}

export interface ICartItem {
  _id?: string;
  product: IProduct;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id?: string;
  items: ICartItem[];
  couponCode?: string;
  discountAmount: number;
}

export interface IAddress {
  _id?: string;
  name: string;
  phone: string;
  addressLine: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface IOrderItem {
  product: IProduct | string;
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IStatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser | string;
  items: IOrderItem[];
  itemsPrice: number;
  discountAmount: number;
  couponCode?: string;
  deliveryFee: number;
  totalAmount: number;
  shippingAddress: IAddress;
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
  expectedDeliveryDate?: string;
  statusHistory: IStatusHistory[];
  cancelReason?: string;
  returnReason?: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  product: string | IProduct;
  user: IUser;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  expiryDate: string;
  active: boolean;
}

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  bannerImage: string;
  author: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  publishedAt: string;
}
