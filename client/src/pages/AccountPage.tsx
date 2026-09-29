import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AccountLayout } from './account/AccountLayout';
import { AccountOverviewPage } from './account/AccountOverviewPage';
import { MyOrdersPage } from './account/MyOrdersPage';
import { OrderDetailPage } from './account/OrderDetailPage';
import { MyReturnsPage } from './account/MyReturnsPage';
import { MyAddressesPage } from './account/MyAddressesPage';
import { MyReviewsPage } from './account/MyReviewsPage';
import { ProfilePage } from './account/ProfilePage';

export const AccountPage: React.FC = () => {
  return (
    <Routes>
      <Route element={<AccountLayout />}>
        <Route index element={<AccountOverviewPage />} />
        <Route path="orders" element={<MyOrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="returns" element={<MyReturnsPage />} />
        <Route path="addresses" element={<MyAddressesPage />} />
        <Route path="reviews" element={<MyReviewsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};
