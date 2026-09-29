import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { IProduct, ICategory, IBrand } from '../../types';

interface ProductState {
  products: IProduct[];
  featuredProducts: IProduct[];
  bestsellers: IProduct[];
  newArrivals: IProduct[];
  currentProduct: IProduct | null;
  relatedProducts: IProduct[];
  categories: ICategory[];
  brands: IBrand[];
  searchSuggestions: any[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  bestsellers: [],
  newArrivals: [],
  currentProduct: null,
  relatedProducts: [],
  categories: [],
  brands: [],
  searchSuggestions: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null
};

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (params: any = {}, { rejectWithValue }) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductBySlug = createAsyncThunk('product/fetchProductBySlug', async (slug: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Product not found');
  }
});

export const fetchFeaturedProducts = createAsyncThunk('product/fetchFeaturedProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/products/featured');
    return response.data.products;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
  }
});

export const fetchCategories = createAsyncThunk('product/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/categories');
    return response.data.categories;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
  }
});

export const fetchBrands = createAsyncThunk('product/fetchBrands', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/brands');
    return response.data.brands;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
  }
});

export const searchProductsQuick = createAsyncThunk('product/searchProductsQuick', async (query: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data.suggestions;
  } catch (error: any) {
    return rejectWithValue('Search failed');
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.relatedProducts = [];
    }
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchProductBySlug
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
        state.relatedProducts = action.payload.relatedProducts;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchFeaturedProducts
    builder.addCase(fetchFeaturedProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
      state.featuredProducts = action.payload;
    });

    // fetchCategories
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
    });

    // fetchBrands
    builder.addCase(fetchBrands.fulfilled, (state, action: PayloadAction<IBrand[]>) => {
      state.brands = action.payload;
    });

    // searchProductsQuick
    builder.addCase(searchProductsQuick.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.searchSuggestions = action.payload;
    });
  }
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
