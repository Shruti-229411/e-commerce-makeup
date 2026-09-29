# GlowCart REST API Documentation

Comprehensive guide to authentication, role-based authorization, catalog endpoints, shopping flow, and error handling for the GlowCart Beauty & Lifestyle E-Commerce Platform.

---

## 🔑 Authentication & Headers

All protected endpoints require a JSON Web Token (JWT) supplied in the HTTP `Authorization` request header using the Bearer scheme:

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 👤 User Roles & Security Controls

| Role | Description | Access Permissions |
|------|-------------|---------------------|
| `customer` | Default registered customer account | Browse catalog, cart, wishlist, checkout, personal orders (`/account`) |
| `admin` | Administrator privilege account | Full access + Admin Management Portals (`/admin`) |

---

## 🚀 Authentication API Endpoints (`/api/auth`)

### 1. Register Customer
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya@example.com",
    "password": "Password123!",
    "phone": "+91 9812345678"
  }
  ```

---

### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "customer@example.com",
    "password": "Password123!"
  }
  ```

---

### 3. Get Current User Profile (`/me`)
- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (Customer & Admin)

---

## 🛍️ Shopping Flow API Endpoints

### 4. Get User Cart
- **Endpoint**: `GET /api/cart`
- **Access**: Private (Authenticated User)

---

### 5. Add Item to Cart
- **Endpoint**: `POST /api/cart/items`
- **Access**: Private
- **Request Body**:
  ```json
  {
    "productId": "6605a1b2c3d4e5f678901234",
    "variantId": "MAC-LIP-RUBY-01",
    "quantity": 2
  }
  ```

---

### 6. Apply Promo Coupon
- **Endpoint**: `POST /api/coupons/apply`
- **Access**: Private
- **Request Body**:
  ```json
  { "code": "BEAUTY20" }
  ```

---

### 7. Manage Addresses
- `GET /api/addresses` — Fetch saved user delivery addresses.
- `POST /api/addresses` — Create new address.
- `PUT /api/addresses/:id` — Update existing address.
- `DELETE /api/addresses/:id` — Delete address.

---

### 8. Place Order & Checkout
- **Endpoint**: `POST /api/orders`
- **Access**: Private
- **Request Body**:
  ```json
  {
    "shippingAddressId": "6605a1b2c3d4e5f678909999",
    "paymentMethod": "COD",
    "couponCode": "BEAUTY20"
  }
  ```
- **Behavior**: Recalculates total price securely on backend, validates available stock against `Inventory`, decrements stock, generates tracking number `GLOW-ORD-XXXXX`, and clears cart.

---

### 9. Get & Manage Customer Orders
- `GET /api/orders/my-orders` — Get list of customer orders (Enforces user ownership).
- `GET /api/orders/:id` — Get single order detail view (Returns 404 / 403 if requested order ID belongs to another customer).
- `PUT /api/orders/:id/cancel` — Cancel eligible order (`Pending`, `Confirmed`, `Processing` states only) and restore inventory stock.

---

## 🔄 Self-Service & Return Requests (`/api/returns`)

### 10. Submit Return Request
- **Endpoint**: `POST /api/returns`
- **Access**: Private
- **Request Body**:
  ```json
  {
    "orderId": "6605a1b2c3d4e5f678909999",
    "reason": "Wrong shade delivered",
    "description": "The foundation shade received was NC30 instead of NC20."
  }
  ```
- **Validation**: Verifies order ownership, checks `Delivered` order status, prevents duplicate requests.

### 11. Customer Return History
- `GET /api/returns/my-returns` — Fetch logged-in user's return requests and resolution states (`Requested`, `Under Review`, `Approved`, `Refunded`).

---

## ⭐ Verified Buyer Reviews (`/api/reviews`)

### 12. Product Review Submission
- **Endpoint**: `POST /api/reviews`
- **Access**: Private
- **Request Body**:
  ```json
  {
    "productId": "6605a1b2c3d4e5f678901234",
    "rating": 5,
    "title": "Holy Grail Serum!",
    "comment": "Visibly reduced pigmentation in just two weeks."
  }
  ```
- **Verified Purchase Rule**: Backend automatically searches user order history for a `Delivered` order containing the product to set `isVerifiedPurchase: true`. Cannot be spoofed by frontend.

### 13. Fetch & Manage Reviews
---

## 🛡️ Admin Management & Security APIs (`/api/admin/*`)

All `/api/admin/*` endpoints strictly require `protect` + `adminOnly` middleware. Unauthenticated calls return `401 Unauthorized`, and customer accounts return `403 Access Denied`.

### 14. Real-Time Admin Analytics Dashboard
- **Endpoint**: `GET /api/admin/dashboard`
- **Access**: Private/Admin
- **Description**: Returns live server-computed revenue (excluding cancelled/refunded orders), order totals, active product count, low-stock inventory alerts, pending return/review counts, recent orders, recent customer registrations, and top-selling products.

### 15. Product Admin CRUD
- `GET /api/admin/products` — List all products (including inactive items).
- `POST /api/admin/products` — Create new product with variant definitions. Server validates pricing (`price > 0`, `mrp >= price`) and enforces SKU & slug uniqueness.
- `PUT /api/admin/products/:id` — Update product details, pricing, stock, and variant list.
- `DELETE /api/admin/products/:id` — Soft-delete product (`isActive = false`) to protect historical order snapshots.

### 16. Category & Brand Admin CRUD
- `POST /api/admin/categories`, `PUT /api/admin/categories/:id`, `DELETE /api/admin/categories/:id`
- `POST /api/admin/brands`, `PUT /api/admin/brands/:id`, `DELETE /api/admin/brands/:id`

### 17. Order Fulfillment & Tracking
- `GET /api/admin/orders` — Filterable order list (`status`, `paymentStatus`).
- `PUT /api/admin/orders/:id/status` — Advance order status (`Pending` → `Confirmed` → `Processing` → `Shipped` → `Out for delivery` → `Delivered` / `Cancelled` / `Returned`), assign tracking number, and append entry to `statusHistory`.

### 18. Inventory Stock Control
- `GET /api/admin/inventory` — View stock levels across all SKUs.
- `PUT /api/admin/inventory/:id` — Adjust `availableStock` and `lowStockThreshold`. Rejects negative stock values (`400 Bad Request`) and syncs master `Product.stock`.

### 19. Coupon & Promotion Management
- `GET /api/admin/coupons`, `POST /api/admin/coupons`, `PUT /api/admin/coupons/:id`, `DELETE /api/admin/coupons/:id`

### 20. Customer Account Controls
- `GET /api/admin/customers` — List registered customer accounts (omits password hashes).
- `PUT /api/admin/customers/:id/status` — Toggle customer `isActive` status. Deactivated users are immediately blocked from authentication and API access. Cannot deactivate admin accounts.

### 21. Self-Service Return Request Moderation
- `GET /api/admin/returns` — List return requests.
- `PUT /api/admin/returns/:id/status` — Update resolution lifecycle (`Requested`, `Under Review`, `Approved`, `Pickup Scheduled`, `Returned`, `Refunded`, `Rejected`). Safely restores inventory stock only when reaching `Returned` or `Refunded` status, ensuring stock is never restored twice.

### 22. Review Moderation
- `GET /api/admin/reviews` — List reviews for moderation.
- `PUT /api/admin/reviews/:id/status` — Update review status (`Approved`, `Rejected`, `Pending`). Verified buyer badges remain server-derived from order history.
- `DELETE /api/admin/reviews/:id` — Delete review.


