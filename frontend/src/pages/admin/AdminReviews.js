import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-lg ${i <= rating ? 'text-gold-500' : 'text-gray-300 dark:text-brown-600'}`}>★</span>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('');

  useEffect(() => {
    reviewsAPI.getAllAdmin()
      .then(res => setReviews(res.data.reviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async id => {
    try {
      await reviewsAPI.delete(id);
      toast.success('Review deleted');
      setReviews(prev => prev.filter(r => r._id !== id));
      setDeleteId(null);
    } catch { toast.error('Failed to delete review'); }
  };

  const filtered = reviews.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = !filterRating || r.rating === Number(filterRating);
    return matchSearch && matchRating;
  });

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brown-800 dark:text-amber-100">Manage Reviews</h1>
        <p className="text-brown-500 dark:text-amber-400/60 mt-1">{reviews.length} total reviews · Avg rating: {avgRating} ⭐</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[5,4,3,2,1].map(star => {
          const count = reviews.filter(r => r.rating === star).length;
          return (
            <div key={star} className="bg-white dark:bg-brown-900 rounded-xl p-4 border border-amber-100 dark:border-brown-800 text-center shadow-sm">
              <div className="text-2xl text-gold-500">{'★'.repeat(star)}</div>
              <div className="font-bold text-2xl text-brown-800 dark:text-amber-100 mt-1">{count}</div>
              <div className="text-xs text-brown-400 dark:text-amber-500/50">reviews</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 Search reviews..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-white dark:bg-brown-900 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
        />
        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="px-4 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-white dark:bg-brown-900 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
        >
          <option value="">All Ratings</option>
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
        </select>
      </div>

      {/* Reviews grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brown-900 rounded-2xl border border-amber-100 dark:border-brown-800">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-brown-500 dark:text-amber-400/60">No reviews found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((review, i) => (
            <div key={review._id} className="bg-white dark:bg-brown-900 rounded-2xl p-5 border border-amber-100 dark:border-brown-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{background: `hsl(${(i * 47) % 360}, 60%, 45%)`}}>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-brown-800 dark:text-amber-100 text-sm">{review.name}</div>
                    <StarDisplay rating={review.rating} />
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(review._id)}
                  className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 flex items-center justify-center hover:bg-red-200 transition-colors text-xs flex-shrink-0"
                  title="Delete review"
                >
                  🗑️
                </button>
              </div>
              <p className="text-brown-600 dark:text-amber-300/80 text-sm leading-relaxed line-clamp-3">"{review.comment}"</p>
              <p className="text-xs text-brown-400 dark:text-amber-500/50 mt-3">
                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-brown-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-display text-xl font-bold text-brown-800 dark:text-amber-100 mb-2">Delete this review?</h3>
            <p className="text-brown-500 dark:text-amber-400/60 mb-6 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 text-brown-600 dark:text-amber-300 font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
