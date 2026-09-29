import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './store/hooks';
import { checkAuth } from './store/slices/authSlice';

import { Header } from './components/common/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPortalPage } from './pages/admin/AdminPortalPage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BrandListPage } from './pages/BrandListPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { CustomerLayout } from './components/common/CustomerLayout';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restore session on startup
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Protected Admin Routes (Isolated Admin Layout - No Storefront Header/Footer) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly>
              <AdminPortalPage />
            </ProtectedRoute>
          }
        />

        {/* Customer Storefront Routes (Uses CustomerLayout with Header & Footer) */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/category/:slug" element={<ProductListPage />} />
          <Route path="/brand/:slug" element={<ProductListPage />} />
          <Route path="/search" element={<ProductListPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/brands" element={<BrandListPage />} />

          {/* Shopping Routes */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/*"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={
              <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>404 - Page Not Found</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  The beauty page or product you are looking for does not exist.
                </p>
                <a href="/" className="btn btn-primary">Back to GlowCart Home</a>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};
