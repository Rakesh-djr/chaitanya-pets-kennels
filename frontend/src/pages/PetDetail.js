import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { petsAPI } from '../utils/api';
import PetCard from '../components/PetCard';
import { PetCardSkeleton } from '../components/Skeleton';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80';

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    petsAPI.getById(id)
      .then(res => {
        setPet(res.data.pet);
        setRecommendations(res.data.recommendations);
        setActiveImage(0);

        // Track recently viewed
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const updated = [id, ...viewed.filter(v => v !== id)].slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-cream dark:bg-brown-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="skeleton h-96 rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-full" />
            <div className="skeleton h-6 w-1/2 rounded-full" />
            <div className="skeleton h-24 rounded-xl" />
            <div className="skeleton h-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen bg-cream dark:bg-brown-950 pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="font-display text-2xl text-brown-700 dark:text-amber-200 mb-4">Pet not found</h2>
        <Link to="/pets" className="text-gold-600 hover:text-gold-700 font-semibold">← Back to Puppies</Link>
      </div>
    </div>
  );

  const images = pet.images?.length > 0 ? pet.images : [{ url: PLACEHOLDER }];
  const getImgUrl = (url) => url?.startsWith('/') ? `http://localhost:5000${url}` : url;
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in ${pet.name} (${pet.breed}). Price: ₹${pet.price?.toLocaleString('en-IN')}. Is it available?`);

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-950 pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <nav className="flex items-center gap-2 text-sm text-brown-500 dark:text-amber-400/60">
          <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
          <span>›</span>
          <Link to="/pets" className="hover:text-gold-600 transition-colors">Puppies</Link>
          <span>›</span>
          <span className="text-brown-700 dark:text-amber-200 font-medium">{pet.name}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main image */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in mb-4 bg-amber-100 dark:bg-brown-900"
              style={{ height: '420px' }}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={getImgUrl(images[activeImage]?.url) || PLACEHOLDER}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 hover:opacity-100 bg-white/90 rounded-full px-4 py-2 text-sm font-medium text-brown-800 transition-opacity">
                  🔍 Click to zoom
                </span>
              </div>
              {/* Status badge */}
              <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg ${pet.status === 'Available' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                <span className={`w-2 h-2 rounded-full bg-white ${pet.status === 'Available' ? 'animate-pulse' : ''}`} />
                {pet.status}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                      activeImage === i ? 'border-gold-500 shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderWidth: activeImage === i ? '3px' : '2px', borderColor: activeImage === i ? '#d4a017' : 'transparent' }}
                  >
                    <img src={getImgUrl(img.url) || PLACEHOLDER} alt={`${pet.name} ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pet Info */}
          <div className="flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-4xl font-bold text-brown-800 dark:text-amber-100">{pet.name}</h1>
                  <p className="text-gold-600 dark:text-gold-400 text-xl font-medium mt-1">{pet.breed}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-brown-800 dark:text-amber-100">
                    ₹{pet.price?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-brown-500 dark:text-amber-400/60">Best Price</div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: '🎂', label: 'Age', value: pet.age || 'N/A' },
                  { icon: pet.gender === 'Male' ? '♂' : '♀', label: 'Gender', value: pet.gender || 'Unknown' },
                  { icon: '💉', label: 'Vaccinated', value: pet.vaccinated ? 'Yes ✓' : 'No' },
                  { icon: '🏷️', label: 'Status', value: pet.status },
                ].map((item, i) => (
                  <div key={i} className="bg-amber-50 dark:bg-brown-900 rounded-xl p-3 border border-amber-100 dark:border-brown-800">
                    <div className="text-xs text-brown-500 dark:text-amber-400/60 mb-1">{item.icon} {item.label}</div>
                    <div className={`font-semibold text-sm ${
                      item.label === 'Status' && item.value === 'Available' ? 'text-green-600 dark:text-green-400' :
                      item.label === 'Status' && item.value === 'Sold' ? 'text-red-500' :
                      item.label === 'Vaccinated' && item.value.includes('Yes') ? 'text-green-600 dark:text-green-400' :
                      'text-brown-800 dark:text-amber-100'
                    }`}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 mb-2">About {pet.name}</h3>
                <p className="text-brown-600 dark:text-amber-300/80 leading-relaxed">{pet.description}</p>
              </div>

              {/* Features */}
              {pet.features?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.features.map((f, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 dark:bg-brown-800 text-gold-700 dark:text-gold-400 border border-gold-200 dark:border-gold-700">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-amber-100 dark:border-brown-800">
              {pet.status === 'Available' ? (
                <>
                  <a
                    href={`https://wa.me/919666985145?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
                  >
                    <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.823.737 5.471 2.027 7.773L0 32l8.48-2.003A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.21 22.297c-.34.96-1.983 1.83-2.72 1.947-.736.117-1.666.166-2.688-.168a24.7 24.7 0 01-2.436-.9c-4.285-1.853-7.08-6.183-7.293-6.47-.213-.287-1.73-2.3-1.73-4.385s1.096-3.114 1.486-3.54c.39-.427.853-.534 1.137-.534l.82.015c.262.013.614-.1.96.733.347.833 1.18 2.877 1.28 3.085.1.207.167.45.033.72-.133.27-.2.437-.393.673-.194.237-.407.53-.58.713-.194.207-.396.43-.17.844.226.414.998 1.646 2.144 2.667 1.473 1.313 2.717 1.72 3.13 1.913.413.194.654.166.893-.1.24-.266 1.023-1.193 1.296-1.606.273-.413.547-.34.92-.207.373.133 2.37 1.12 2.777 1.327.407.207.68.31.78.48.1.17.1.98-.24 1.94z"/></svg>
                    Contact Seller on WhatsApp
                  </a>
                  <a href="tel:9666985145"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold border-2 border-gold-500 text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-white dark:hover:bg-gold-600 dark:hover:text-white transition-all duration-300">
                    📞 Call: +91 96669 85145
                  </a>
                </>
              ) : (
                <div className="w-full py-4 rounded-xl font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-center border border-red-200 dark:border-red-800">
                  😔 This puppy has been sold
                </div>
              )}
              <Link to="/pets"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-brown-600 dark:text-amber-400 hover:text-gold-600 transition-colors text-sm">
                ← Browse more puppies
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Pets */}
        {recommendations.length > 0 && (
          <div>
            <div className="mb-8">
              <p className="font-accent text-lg text-gold-600 dark:text-gold-400">You might also like</p>
              <h2 className="font-display text-3xl font-bold text-brown-800 dark:text-amber-100">Recommended Puppies</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map(rec => <PetCard key={rec._id} pet={rec} />)}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-xl"
          >✕</button>
          <img
            src={getImgUrl(images[activeImage]?.url) || PLACEHOLDER}
            alt={pet.name}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveImage(i); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImage ? 'bg-gold-400 w-6' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
