import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface WishlistState {
  wishlist: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: null,
  isLoading: false,
  error: null
};

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    return response.data.wishlist;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggleWishlist', async (productId: string, { rejectWithValue }) => {
  try {
    const response = await api.post('/wishlist/toggle', { productId });
    return response.data.wishlist;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder.addCase(toggleWishlist.fulfilled, (state, action) => {
      state.wishlist = action.payload;
    });
  }
});

export default wishlistSlice.reducer;
