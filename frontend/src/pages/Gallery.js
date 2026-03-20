import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../utils/api';

const CATEGORIES = ['All', 'Puppies', 'Dogs', 'Cats', 'Events', 'Facilities'];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'All' ? { category: activeCategory } : {};
    galleryAPI.getAll(params)
      .then(res => setImages(res.data.images))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const getImgUrl = url => url?.startsWith('/') ? `http://localhost:5000${url}` : url;
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80';

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-950 pt-24 pb-16">
      {/* Header */}
      <div className="relative py-16 text-center mb-10" style={{background: 'linear-gradient(135deg, #5c3d08 0%, #a0522d 50%, #d4a017 100%)'}}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-accent text-xl text-gold-300 mb-2">Memories & Moments</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">Photo Gallery</h1>
          <p className="text-white/80">Browse through our adorable puppies and kennel moments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-brown-900 text-brown-600 dark:text-amber-300 border border-amber-200 dark:border-brown-700 hover:border-gold-400 hover:text-gold-600'
              }`}
              style={activeCategory === cat ? { background: 'linear-gradient(135deg, #d4a017, #b8860b)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="masonry-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="masonry-item">
                <div className="skeleton rounded-2xl" style={{ height: `${150 + (i % 3) * 70}px` }} />
              </div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="masonry-grid">
            {images.map((img, i) => (
              <div key={img._id} className="masonry-item group cursor-pointer" onClick={() => setLightbox({ img, index: i })}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <img
                    src={getImgUrl(img.url) || PLACEHOLDER}
                    alt={img.caption || 'Gallery image'}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={e => { e.target.src = PLACEHOLDER; }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      {img.caption && <p className="text-white text-sm font-medium">{img.caption}</p>}
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-gold-500/80 text-white">{img.category}</span>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-sm">🔍</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">📸</div>
            <h3 className="font-display text-2xl text-brown-700 dark:text-amber-200 mb-2">No images yet</h3>
            <p className="text-brown-500 dark:text-amber-400/60">Check back soon for new photos!</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-xl z-10">✕</button>

          {/* Prev */}
          {lightbox.index > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox({ img: images[lightbox.index-1], index: lightbox.index-1 }); }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-xl z-10"
            >‹</button>
          )}
          {/* Next */}
          {lightbox.index < images.length-1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox({ img: images[lightbox.index+1], index: lightbox.index+1 }); }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-xl z-10"
            >›</button>
          )}

          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            <img
              src={getImgUrl(lightbox.img.url) || PLACEHOLDER}
              alt={lightbox.img.caption}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            {lightbox.img.caption && (
              <p className="text-white text-center mt-4 text-sm">{lightbox.img.caption}</p>
            )}
            <p className="text-white/40 text-center text-xs mt-1">{lightbox.index + 1} / {images.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
