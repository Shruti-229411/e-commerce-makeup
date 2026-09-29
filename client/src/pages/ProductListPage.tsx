import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchCategories, fetchBrands } from '../store/slices/productSlice';
import { ProductGrid } from '../components/product/ProductGrid';
import { Filter, SlidersHorizontal, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const ProductListPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const { products, totalProducts, totalPages, currentPage, isLoading, categories, brands } = useAppSelector(
    (state) => state.product
  );

  // Filter States
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? searchParams.get('brand')!.split(',') : []
  );
  const [minRating, setMinRating] = useState<string>(searchParams.get('rating') || '');
  const [minDiscount, setMinDiscount] = useState<string>(searchParams.get('discount') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    const params: any = {
      page,
      limit: 12,
      sort: sortBy
    };

    const categoryParam = slug || searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    if (categoryParam) params.category = categoryParam;
    if (subcategoryParam) params.subcategory = subcategoryParam;
    if (searchQuery) params.search = searchQuery;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
    if (minRating) params.rating = minRating;
    if (minDiscount) params.discount = minDiscount;

    dispatch(fetchProducts(params));
  }, [dispatch, slug, searchParams, searchQuery, minPrice, maxPrice, selectedBrands, minRating, minDiscount, sortBy, page]);

  const handleBrandToggle = (brandSlug: string) => {
    if (selectedBrands.includes(brandSlug)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brandSlug));
    } else {
      setSelectedBrands([...selectedBrands, brandSlug]);
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setMinRating('');
    setMinDiscount('');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Page Title & Breadcrumb Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, textTransform: 'capitalize' }}>
            {slug ? `${slug.replace('-', ' ')} Collection` : searchQuery ? `Search Results for "${searchQuery}"` : 'All Beauty Products'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{totalProducts}</strong> products found
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="input-field"
            style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Customer Rating</option>
            <option value="discount_desc">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Sidebar Filters */}
        <aside className="card-glass" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SlidersHorizontal size={18} /> Filters
            </h3>
            {(minPrice || maxPrice || selectedBrands.length > 0 || minRating || minDiscount) && (
              <button onClick={handleClearFilters} style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700 }}>
                Clear All
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.65rem' }}>Price Range (₹)</h4>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                className="input-field"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                className="input-field"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* Brands Filter Checkboxes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.65rem' }}>Brands</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto' }}>
              {brands.map((b) => (
                <label key={b._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.slug)}
                    onChange={() => handleBrandToggle(b.slug)}
                  />
                  <span>{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.65rem' }}>Customer Rating</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {['4', '4.5'].map((r) => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                  />
                  <span>{r}★ & above</span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount Filter */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.65rem' }}>Discount</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {['10', '15', '20'].map((d) => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="discount"
                    checked={minDiscount === d}
                    onChange={() => setMinDiscount(d)}
                  />
                  <span>{d}% OFF or more</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid & Pagination */}
        <div>
          <ProductGrid products={products} isLoading={isLoading} />

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.75rem' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
