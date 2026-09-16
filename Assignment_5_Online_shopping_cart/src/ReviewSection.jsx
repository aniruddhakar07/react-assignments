import React, { useState, useCallback, memo } from 'react';
import { Star, ThumbsUp, MessageSquarePlus, Send, MessageSquare } from 'lucide-react';
import { toast } from './toast';

const INITIAL_FORM = {
  rating: 5,
  name: '',
  title: '',
  body: ''
};

const ReviewSection = memo(function ReviewSection({ product }) {
  // Lazy state initialization prevents empty flash and extra render
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`reviews_${product.id}`) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleHelpful = useCallback((id) => {
    setReviews((prev) => {
      const updated = prev.map((r) => 
        r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r
      );
      try {
        localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    toast.info('Marked review as helpful!');
  }, [product.id]);

  const handleSubmitReview = useCallback((e) => {
    e.preventDefault();
    const { name, title, body, rating } = formData;

    if (!name.trim() || !title.trim() || !body.trim()) {
      toast.error('Please fill out all review fields.');
      return;
    }

    const reviewObj = {
      id: Date.now(),
      author: name.trim(),
      rating: Number(rating),
      date: 'Today',
      title: title.trim(),
      body: body.trim(),
      helpful: 0
    };

    setReviews((prev) => {
      const updated = [reviewObj, ...prev];
      try {
        localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    setShowForm(false);
    setFormData(INITIAL_FORM);
    toast.success('Your review has been submitted!');
  }, [formData, product.id]);

  return (
    <div className="mt-16 pt-10 border-t border-white/10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Customer Reviews</h3>
          <p className="text-xs text-neutral-400 mt-1">
            {reviews.length === 0
              ? 'No customer reviews submitted yet.'
              : `${reviews.length} customer review${reviews.length > 1 ? 's' : ''} submitted`}
          </p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all shadow hover:border-accent-500/40"
        >
          <MessageSquarePlus size={16} className="text-accent-400" />
          <span>{showForm ? 'Cancel Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="glass-panel p-6 rounded-2xl space-y-4 animate-slide-up border border-accent-500/30">
          <h4 className="font-bold text-white text-sm">Write a Review for {product.name}</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="review-name" className="block text-neutral-400 mb-1 font-semibold">Your Name</label>
              <input
                id="review-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Jordan V."
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 text-xs"
              />
            </div>

            <div>
              <label htmlFor="review-rating" className="block text-neutral-400 mb-1 font-semibold">Rating</label>
              <select
                id="review-rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white focus:outline-none focus:border-accent-500 text-xs"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label htmlFor="review-title" className="block text-neutral-400 mb-1 font-semibold">Review Title</label>
            <input
              id="review-title"
              name="title"
              type="text"
              required
              placeholder="e.g. Great performance in high workloads"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 text-xs"
            />
          </div>

          <div className="text-xs">
            <label htmlFor="review-body" className="block text-neutral-400 mb-1 font-semibold">Your Feedback</label>
            <textarea
              id="review-body"
              name="body"
              rows="3"
              required
              placeholder="Share details about performance, installation, noise, thermals..."
              value={formData.body}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-dark-900 font-black text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Send size={14} />
            <span>POST REVIEW</span>
          </button>
        </form>
      )}

      {/* Reviews List or Empty State */}
      {reviews.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 border border-white/5">
          <div className="p-4 rounded-full bg-dark-800 text-neutral-500">
            <MessageSquare size={28} />
          </div>
          <h4 className="font-bold text-white text-sm">No reviews yet</h4>
          <p className="text-xs text-neutral-400 max-w-sm">
            Have you used or tested the {product.name}? Be the first to share your experience with other builders.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-white text-dark-900 font-bold text-xs hover:bg-accent-400 transition-colors"
            >
              Write First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="glass-panel p-6 rounded-2xl space-y-3 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white text-xs ml-2">{r.title}</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">{r.date}</span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">{r.body}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 border-t border-white/5">
                <span className="font-medium text-neutral-400">{r.author}</span>

                <button
                  onClick={() => handleHelpful(r.id)}
                  aria-label={`Mark review by ${r.author} as helpful`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ThumbsUp size={12} />
                  <span>Helpful ({r.helpful || 0})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default ReviewSection;
