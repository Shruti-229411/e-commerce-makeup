import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Star, Trash2, Edit2, CheckCircle, MessageSquare } from 'lucide-react';

export const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = () => {
    setIsLoading(true);
    api
      .get('/reviews/my-reviews')
      .then((res) => {
        setReviews(res.data.reviews || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="card-glass" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <MessageSquare size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Reviews Written</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Share your experience with delivered products to earn verified buyer badges and assist fellow shoppers!
        </p>
        <Link to="/account/orders" className="btn btn-primary">
          View Delivered Orders &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Ratings & Reviews ({reviews.length})</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {reviews.map((rev) => (
          <div key={rev._id} className="card-glass" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            {rev.product?.images?.[0] && (
              <img
                src={rev.product.images[0]}
                alt={rev.product.name}
                style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '2px', backgroundColor: '#fff' }}
              />
            )}

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {rev.product?.slug ? (
                      <Link to={`/product/${rev.product.slug}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {rev.product.name}
                      </Link>
                    ) : (
                      rev.product?.name || 'Product'
                    )}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <div className="rating-pill">
                      <span>{rev.rating}</span>
                      <Star size={12} fill="#fff" color="#fff" />
                    </div>
                    {rev.isVerifiedPurchase && (
                      <span className="badge badge-bestseller" style={{ fontSize: '0.7rem' }}>
                        ✓ Verified Buyer
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <button onClick={() => handleDeleteReview(rev._id)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }} title="Delete Review">
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{rev.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  "{rev.comment}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
