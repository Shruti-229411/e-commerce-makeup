# GlowCart Database Schema Reference

Technical overview of Mongoose Models, Collections, Fields, Relationships, and Programmatic Indexes in MongoDB Atlas.

---

## 📊 Collections Overview

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ ADDRESS : owns
    USER ||--o1 CART : possesses
    USER ||--o1 WISHLIST : maintains
    USER ||--o{ REVIEW : writes
    CATEGORY ||--o{ PRODUCT : categorizes
    BRAND ||--o{ PRODUCT : manufactures
    PRODUCT ||--o{ PRODUCT_VARIANT : contains
    PRODUCT ||--o1 INVENTORY : tracks
    ORDER ||--o{ ORDER_ITEM : includes
```

---

## 1. `User` Collection (`users`)

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | ObjectId | Yes | Primary Key | Unique User ID |
| `firstName` | String | Yes | No | User first name |
| `lastName` | String | Yes | No | User last name |
| `email` | String | Yes | Unique | Lowercase unique account email |
| `phone` | String | No | No | Phone number |
| `passwordHash` | String | Yes | No | bcrypt hashed password |
| `role` | String | Yes | Index | `'customer'` or `'admin'` |
| `isActive` | Boolean | Yes | No | Active status toggle |
| `preferences` | Object | No | No | Skin type, hair type, newsletter |
| `createdAt` | Date | Auto | No | Account creation timestamp |

---

## 2. `Category` Collection (`categories`)

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | ObjectId | Yes | Primary Key | Unique Category ID |
| `name` | String | Yes | Text Index | Category name |
| `slug` | String | Yes | Unique | URL-friendly slug |
| `description` | String | No | Text Index | Category description |
| `parentCategory` | ObjectId | No | Index | Ref: `Category` (null for main categories) |
| `active` | Boolean | Yes | Index | Active status |
| `displayOrder` | Number | Yes | No | Display sorting index |

---

## 3. `Brand` Collection (`brands`)

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | ObjectId | Yes | Primary Key | Unique Brand ID |
| `name` | String | Yes | Unique & Text | Brand name (e.g. MAC, Maybelline) |
| `slug` | String | Yes | Unique | URL-friendly slug |
| `logo` | String | Yes | No | Logo image CDN URL |
| `description` | String | No | No | Brand story / overview |
| `banner` | String | No | No | Brand hero banner image |
| `active` | Boolean | Yes | Index | Active status |

---

## 4. `Product` Collection (`products`)

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | ObjectId | Yes | Primary Key | Unique Product ID |
| `name` | String | Yes | Text Index | Product name |
| `slug` | String | Yes | Unique | URL-friendly slug |
| `description` | String | Yes | Text Index | Product description |
| `shortDescription` | String | Yes | No | Concise product summary |
| `brand` | ObjectId | Yes | Ref: Brand | Parent brand reference |
| `category` | ObjectId | Yes | Ref: Category | Parent category reference |
| `subcategory` | ObjectId | No | Ref: Category | Subcategory reference |
| `images` | Array[String]| Yes | No | Product image CDN URLs |
| `price` | Number | Yes | Index | Selling price in ₹ |
| `mrp` | Number | Yes | No | Maximum Retail Price (MRP) |
| `discount` | Number | Yes | Index | Discount percentage |
| `sku` | String | Yes | Unique | Master Product SKU |
| `stock` | Number | Yes | Index | Available stock count |
| `rating` | Number | Yes | Index | Average star rating (1.0 to 5.0) |
| `reviewCount` | Number | Yes | No | Total count of reviews |
| `tags` | Array[String]| No | Text Index | Search keywords & tags |
| `variants` | Array[Object]| No | Sub-schema | Multi-shade/size variants array |
| `isFeatured` | Boolean | Yes | Index | Featured on homepage hero |
| `isBestseller` | Boolean | Yes | Index | Bestseller tag |
| `isNewArrival` | Boolean | Yes | Index | New arrival tag |

---

## 5. `Inventory` Collection (`inventories`)

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | ObjectId | Yes | Primary Key | Inventory ID |
| `sku` | String | Yes | Unique | Variant SKU |
| `product` | ObjectId | Yes | Ref: Product | Product reference |
| `availableStock` | Number | Yes | No | Physical available stock |
| `reservedStock` | Number | Yes | No | Stock reserved in active checkouts |
| `lowStockThreshold` | Number | Yes | No | Alert threshold (default: 10) |
| `status` | String | Yes | No | `'In Stock'`, `'Low Stock'`, `'Out of Stock'` |

---

## 6. `Review` Collection (`reviews`)

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | ObjectId | Yes | Primary Key | Review ID |
| `product` | ObjectId | Yes | Ref: Product | Target product reference |
| `user` | ObjectId | Yes | Ref: User | Reviewer customer reference |
| `rating` | Number | Yes | No | Star rating (1 to 5) |
| `title` | String | Yes | No | Review headline |
| `comment` | String | Yes | No | Detailed review text |
| `isVerifiedPurchase` | Boolean | Yes | Index | Calculated on backend from delivered orders |
| `status` | String | Yes | Index | `'Approved'`, `'Pending'`, `'Rejected'` |

---

## 7. `ReturnRequest` Collection (`returnrequests`)

| Field | Type | Required | Index | Description |
|-------|------|----------|-------|-------------|
| `_id` | ObjectId | Yes | Primary Key | Return Request ID |
| `order` | ObjectId | Yes | Ref: Order | Parent Order reference |
| `user` | ObjectId | Yes | Ref: User | Customer reference |
| `reason` | String | Yes | No | Reason select option |
| `description` | String | No | No | Customer detailed explanation |
| `status` | String | Yes | Index | `'Requested'`, `'Under Review'`, `'Approved'`, `'Rejected'`, `'Pickup Scheduled'`, `'Returned'`, `'Refunded'` |
| `adminNotes` | String | No | No | Staff notes & instructions |
| `refundAmount` | Number | Yes | No | Resolution refund value |

---

## 8. Programmatic MongoDB Indexes

- **Text Search Index on `products`**: `{ name: 'text', description: 'text', shortDescription: 'text', tags: 'text' }`
- **Text Search Index on `categories`**: `{ name: 'text', description: 'text' }`
- **Text Search Index on `brands`**: `{ name: 'text' }`
- **Unique Indexes**:
  - `users.email`
  - `categories.slug`
  - `brands.slug`
  - `products.slug`, `products.sku`
  - `reviews.(product + user)`
  - `coupons.code`
