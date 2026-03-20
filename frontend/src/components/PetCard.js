import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80';

export default function PetCard({ pet }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageUrl = pet.images?.[0]?.url || PLACEHOLDER;
  const fullImageUrl = imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl;

  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in ${pet.name} (${pet.breed}). Is it available?`);

  return (
    <div className="pet-card bg-white dark:bg-brown-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-amber-100/50 dark:border-brown-800 group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {!imgLoaded && <div className="skeleton absolute inset-0" />}
        <img
          src={imgError ? PLACEHOLDER : fullImageUrl}
          alt={pet.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          loading="lazy"
        />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg ${
          pet.status === 'Available'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-white ${pet.status === 'Available' ? 'animate-pulse' : ''}`} />
          {pet.status}
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-brown-900/90 text-gold-700 dark:text-gold-400 shadow-lg backdrop-blur-sm">
          ₹{pet.price?.toLocaleString('en-IN')}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex gap-2 w-full">
            <Link
              to={`/pets/${pet._id}`}
              className="flex-1 text-center py-2 rounded-full text-white text-xs font-bold bg-gold-600 hover:bg-gold-500 transition-colors"
            >
              View Details
            </Link>
            {pet.status === 'Available' && (
              <a
                href={`https://wa.me/919666985145?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 rounded-full text-white text-xs font-bold"
                style={{background: '#25d366'}}
              >
                Enquire
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 truncate">{pet.name}</h3>
        <p className="text-gold-600 dark:text-gold-400 text-sm font-medium">{pet.breed}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-brown-500 dark:text-amber-400/70">
          {pet.age && <span>🎂 {pet.age}</span>}
          {pet.gender && pet.gender !== 'Unknown' && <span>{pet.gender === 'Male' ? '♂' : '♀'} {pet.gender}</span>}
          {pet.vaccinated && <span className="text-green-600 dark:text-green-400">✓ Vaccinated</span>}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-100 dark:border-brown-800">
          <span className="font-bold text-brown-800 dark:text-amber-100">₹{pet.price?.toLocaleString('en-IN')}</span>
          <Link
            to={`/pets/${pet._id}`}
            className="text-xs font-semibold text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
