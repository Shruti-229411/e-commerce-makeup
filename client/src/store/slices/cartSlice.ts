import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ICart } from '../../types';

interface CartState {
  cart: ICart | null;
  subtotal: number;
  isLoading: boolean;
  couponError: string | null;
  couponSuccess: string | null;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  subtotal: 0,
  isLoading: false,
  couponError: null,
  couponSuccess: null,
  error: null
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData: { productId: string; variantId?: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/items', itemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async (itemData: { productId: string; variantId?: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.put('/cart/items', itemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async ({ productId, variantId }: { productId: string; variantId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/items/${productId}${variantId ? `?variantId=${variantId}` : ''}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (code: string, { rejectWithValue }) => {
  try {
    const response = await api.post('/coupons/apply', { code });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Invalid coupon code');
  }
});

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post('/coupons/remove');
    return response.data;
  } catch (error: any) {
    return rejectWithValue('Failed to remove coupon');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCouponState: (state) => {
      state.couponError = null;
      state.couponSuccess = null;
    }
  },
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.cart;
        state.subtotal = action.payload.subtotal;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // addToCart
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.cart = action.payload.cart;
    });

    // updateCartQuantity
    builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
      state.cart = action.payload.cart;
    });

    // removeCartItem
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.cart = action.payload.cart;
    });

    // applyCoupon
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.couponError = null;
        state.couponSuccess = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.couponSuccess = action.payload.message;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.couponError = action.payload as string;
      });

    // removeCoupon
    builder.addCase(removeCoupon.fulfilled, (state, action) => {
      state.cart = action.payload.cart;
      state.couponSuccess = null;
      state.couponError = null;
    });
  }
});

export const { clearCouponState } = cartSlice.actions;
export default cartSlice.reducer;
