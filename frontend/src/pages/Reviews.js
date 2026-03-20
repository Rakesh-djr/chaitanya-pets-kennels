import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../utils/api';
import toast from 'react-hot-toast';

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="text-3xl transition-transform hover:scale-125 focus:outline-none"
        >
          <span className={(hovered || value) >= i ? 'text-gold-500' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-lg ${i <= rating ? 'text-gold-500' : 'text-gray-300 dark:text-brown-600'}`}>★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 0, comment: '' });
  const [errors, setErrors] = useState({});

  const fetchReviews = () => {
    reviewsAPI.getAll()
      .then(res => {
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.rating) e.rating = 'Please select a rating';
    if (!form.comment.trim()) e.comment = 'Comment is required';
    if (form.comment.trim().length < 10) e.comment = 'Comment must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await reviewsAPI.create(form);
      toast.success('Thank you for your review! 🐾');
      setForm({ name: '', rating: 0, comment: '' });
      setErrors({});
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingBars = [5,4,3,2,1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length ? Math.round((reviews.filter(rev => rev.rating === r).length / reviews.length) * 100) : 0
  }));

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-950 pt-24 pb-16">
      {/* Header */}
      <div className="relative py-16 text-center mb-10" style={{background: 'linear-gradient(135deg, #5c3d08 0%, #a0522d 50%, #d4a017 100%)'}}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-accent text-xl text-gold-300 mb-2">Customer Stories</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">Reviews</h1>
          <p className="text-white/80">What our happy pet parents say about us</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating summary */}
        <div className="bg-white dark:bg-brown-900 rounded-2xl p-8 shadow-sm border border-amber-100 dark:border-brown-800 mb-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center">
            <div className="font-display text-8xl font-bold text-brown-800 dark:text-amber-100">{avgRating}</div>
            <div className="flex justify-center gap-1 my-2">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={`text-3xl ${i <= Math.round(avgRating) ? 'text-gold-500' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <p className="text-brown-500 dark:text-amber-400/70">Based on {reviews.length} reviews</p>
          </div>
          <div className="space-y-2">
            {ratingBars.map(({ rating, count, pct }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-brown-600 dark:text-amber-400 w-4">{rating}</span>
                <span className="text-gold-500 text-sm">★</span>
                <div className="flex-1 h-2.5 bg-amber-100 dark:bg-brown-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #d4a017, #f0c040)' }}
                  />
                </div>
                <span className="text-xs text-brown-500 dark:text-amber-400/60 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="font-display text-2xl font-bold text-brown-800 dark:text-amber-100 mb-6">
              Customer Reviews ({reviews.length})
            </h2>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-brown-900 rounded-2xl p-6 space-y-3 shadow animate-pulse">
                  <div className="flex gap-3">
                    <div className="skeleton w-12 h-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="skeleton h-4 w-1/3 rounded" />
                      <div className="skeleton h-3 w-1/4 rounded" />
                    </div>
                  </div>
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-4/5 rounded" />
                </div>
              ))
            ) : reviews.length > 0 ? reviews.map((review, i) => (
              <div key={review._id} className="bg-white dark:bg-brown-900 rounded-2xl p-6 shadow-sm border border-amber-100/50 dark:border-brown-800 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-md"
                    style={{background: `hsl(${(i * 47) % 360}, 60%, 45%)`}}>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-brown-800 dark:text-amber-100">{review.name}</h4>
                      <span className="text-xs text-brown-400 dark:text-amber-500/50">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                </div>
                <p className="text-brown-600 dark:text-amber-300/80 leading-relaxed">"{review.comment}"</p>
              </div>
            )) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-brown-500 dark:text-amber-400/60 text-lg">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-brown-900 rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-brown-800">
              <h3 className="font-display text-xl font-bold text-brown-800 dark:text-amber-100 mb-6">
                ✍️ Write a Review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={e => setForm(prev => ({...prev, name: e.target.value}))}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none transition-all ${errors.name ? 'border-red-400' : 'border-amber-200 dark:border-brown-700 focus:border-gold-500'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Rating *</label>
                  <StarInput value={form.rating} onChange={r => setForm(prev => ({...prev, rating: r}))} />
                  {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Your Review *</label>
                  <textarea
                    placeholder="Share your experience with us..."
                    rows={5}
                    value={form.comment}
                    onChange={e => setForm(prev => ({...prev, comment: e.target.value}))}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none transition-all resize-none ${errors.comment ? 'border-red-400' : 'border-amber-200 dark:border-brown-700 focus:border-gold-500'}`}
                  />
                  {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                  style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}
                >
                  {submitting ? 'Submitting...' : '⭐ Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
