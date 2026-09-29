# GlowCart — Full-Stack Beauty & Lifestyle E-Commerce Platform

**GlowCart** is a complete, production-grade beauty and lifestyle e-commerce platform inspired by the shopping experience, category hierarchy, and feature depth of Nykaa. It features original branding, a database-driven product catalog with multi-variants (shades, sizes), multi-faceted filtering, debounced search, server-side cart & wishlist, coupon system, multi-step checkout, user account order tracking/returns, and a complete Admin Management Portal.

---

## 🎨 Enhanced 16-Section Interactive Homepage Architecture

The homepage is organized into a 16-section storefront:

1. **AnnouncementBar**: Ticker with auto-rotating promo offers, copyable coupon codes (`BEAUTY20`, `GLOW10`), free shipping notifications, and dismiss capability.
2. **Header & Navigation**: Sticky header with brand logo, search bar, wishlist counter, cart drawer, user profile menu, and category ribbon navigation.
3. **BrandCarousel**: Infinite marquee brand logo slider.
4. **HeroPromoSlider**: Auto-playing promo carousel with touch swipe, manual navigation arrows, pagination dots, and `prefers-reduced-motion` compliance.
5. **Trust Badges**: Value proposition bar showcasing 100% Authentic, Free Shipping, 15-Day Easy Returns, Top Rated Brands, and Derm Approved badges.
6. **Enhanced Shop by Category**: Interactive category cards (Makeup, Skincare, Haircare, Fragrance, Bath & Body, Wellness) with subcategory filter pills (`lipstick-lip-care`, `serums-essences`, etc.), item counters, and smooth hover scale.
7. **SpotlightCarousel**: Curated collections slider (Glass Skin Edit, Red Lipsticks, Monsoon Hair Repair, Luxury Scents) with touch drag and navigation controls.
8. **VideoCarousel**: 9:16 aspect ratio video reels with responsive visibility (Desktop: 4 cards, Tablet: 2 cards, Mobile: 1.2 cards with swipe/peek), `IntersectionObserver` viewport autoplay/pause, loop, lazy loading, `preload="metadata"`, poster fallbacks, play/pause and mute/unmute overlays, product CTA links, keyboard accessibility (`tabIndex={0}`, focus rings), `prefers-reduced-motion` static poster fallback, and autoplay rejection/error handling.
9. **CircularBrandBar**: Top brand store circular avatars (MAC, Maybelline, Lakmé, L'Oréal, The Ordinary, Forest Essentials, Clinique, Plum, Innisfree, Nivea) with gradient glow hover effects.
10. **ShopByConcern**: Skin/beauty concern selector pills (Acne, Anti-Aging, Dullness, Dryness, Frizz, Sun Protection) that reuse existing product catalog search/filter endpoints (`/products?search=...`).
11. **PromoBannerSection**: High-impact promo banners featuring configured coupons (`GLOW10`, `WELCOME500`) with instant copy action and toast notification.
12. **Featured & Bestseller Products**: Tabbed catalog showcase ("Featured Glow", "Bestsellers", "New Arrivals") consuming existing `ProductCard` component.
13. **BeautyAdviceSection**: Editorial beauty guides and articles with category tags, read times, author badges, and an interactive full-article reader modal.
14. **SocialProofSection**: Verified customer review testimonials with 5-star ratings, buyer badges, and `#GlowCartBeauty` Instagram community feed.
15. **NewsletterSection**: VIP Glow Club email subscription section with email validation, ₹200 instant gift confirmation, and `useToast` feedback.
16. **Footer**: Platform copyright and footer links.

---

## 🚀 MongoDB Atlas Configuration & Setup Guide

GlowCart relies on **MongoDB Atlas** (or any MongoDB connection) as its primary persistent database. Follow these steps to configure your MongoDB Atlas cluster:

### Step 1: Create a MongoDB Atlas Account & Cluster
1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Project (e.g., `GlowCart-ECommerce`).
3. Deploy a **Free (M0)** or Shared Cluster.

### Step 2: Configure Database User & Security Credentials
1. In the left navigation menu, go to **Security** -> **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password Authentication**, set a Username (e.g., `glowadmin`) and a strong Password.
4. Set User Privileges to **Read and write to any database**.
5. Save the user credentials.

### Step 3: Configure Network Access (IP Whitelist)
1. Go to **Security** -> **Network Access**.
2. Click **Add IP Address**.
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) for local development access.
4. Click **Confirm**.

### Step 4: Obtain Connection String
1. Go to **Deployment** -> **Database**.
2. Click **Connect** on your cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string format:
   ```env
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/GlowCartDB?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials.

### Step 5: Configure `server/.env` File
Create or update `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://glowadmin:YOUR_PASSWORD@your-cluster.mongodb.net/GlowCartDB?retryWrites=true&w=majority
JWT_SECRET=glowcart_super_secret_jwt_key_2026_beauty_ecommerce
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

### Step 6: Seed Database & Populate Atlas Collections
Run the database seed script from the project root or server directory:
```bash
npm run seed
```
This automatically connects to MongoDB Atlas, builds all required indexes programmatically, creates collections, and populates 50+ products, 10+ brands, categories, reviews, coupons, and demo user accounts!

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
|------|-------|----------|---------------|
| **Admin** | `admin@example.com` | `Admin123!` | Full Admin Portal Access (`/admin`) |
| **Customer** | `customer@example.com` | `Password123!` | Full Customer Shopping & Order Tracking (`/account`) |

---

## 🛠️ Project Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router v6, Redux Toolkit, Lucide React, Custom Luxury Design System CSS
- **Backend**: Node.js, Express, TypeScript, JWT Authentication, bcryptjs, Mongoose
- **Database**: MongoDB Atlas Cloud
- **Storage Abstraction**: Local `/uploads` static file server + Cloudinary/S3 environment variable integration

---

## 🚦 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm run setup
   ```

2. **Configure Environment**:
   Update `server/.env` with your `MONGODB_URI` string.

3. **Seed Database**:
   ```bash
   npm run seed
   ```

4. **Start Application**:
   ```bash
   npm run dev
   ```
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

5. **Run Tests & Build**:
   ```bash
   npm test
   npm run build
   ```
