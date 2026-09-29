import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminProductEditPage } from './AdminProductEditPage';
import { AdminCategoriesPage } from './AdminCategoriesPage';
import { AdminBrandsPage } from './AdminBrandsPage';
import { AdminOrdersPage } from './AdminOrdersPage';
import { AdminOrderDetailPage } from './AdminOrderDetailPage';
import { AdminInventoryPage } from './AdminInventoryPage';
import { AdminCouponsPage } from './AdminCouponsPage';
import { AdminCustomersPage } from './AdminCustomersPage';
import { AdminReturnsPage } from './AdminReturnsPage';
import { AdminReviewsPage } from './AdminReviewsPage';

export const AdminPortalPage: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductEditPage />} />
        <Route path="products/:id/edit" element={<AdminProductEditPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="brands" element={<AdminBrandsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="returns" element={<AdminReturnsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
      </Route>
    </Routes>
  );
};
