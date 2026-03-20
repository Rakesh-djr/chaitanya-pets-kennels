import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petsAPI, reviewsAPI } from '../utils/api';
import PetCard from '../components/PetCard';
import { PetCardSkeleton } from '../components/Skeleton';

const HERO_BG = 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=1600&q=80';

const stats = [
  { icon: '🐾', number: '500+', label: 'Happy Families' },
  { icon: '⭐', number: '4.9', label: 'Average Rating' },
  { icon: '🏆', number: '9+', label: 'Years Experience' },
  { icon: '🐕', number: '50+', label: 'Breeds Available' },
];

const breeds = [
  { name: 'Golden Retriever', emoji: '🐕', desc: 'Friendly & gentle' },
  { name: 'German Shepherd', emoji: '🐺', desc: 'Loyal & intelligent' },
  { name: 'Labrador', emoji: '🦮', desc: 'Playful & kind' },
  { name: 'Husky', emoji: '🌨️', desc: 'Stunning & energetic' },
  { name: 'Rottweiler', emoji: '💪', desc: 'Strong & devoted' },
  { name: 'Beagle', emoji: '🐶', desc: 'Curious & merry' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-gold-500' : 'text-gray-300'}>★</span>
      ))}
    </div>
  );
}

export default function Home() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleSection, setVisibleSection] = useState({});

  useEffect(() => {
    Promise.all([
      petsAPI.getAll({ limit: 6, status: 'Available' }),
      reviewsAPI.getAll()
    ]).then(([petsRes, reviewsRes]) => {
      setFeaturedPets(petsRes.data.pets);
      setReviews(reviewsRes.data.reviews.slice(0, 3));
      setAvgRating(reviewsRes.data.avgRating);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSection(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(92,61,8,0.88) 0%, rgba(160,82,45,0.72) 50%, rgba(212,160,23,0.55) 100%)'
        }} />

        {/* Floating paw prints */}
        {['top-20 left-10', 'top-40 right-20', 'bottom-40 left-20', 'bottom-20 right-10'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} text-white/10 text-6xl animate-float`} style={{ animationDelay: `${i * 0.7}s` }}>
            🐾
          </div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="text-gold-300 text-sm font-medium tracking-widest uppercase">Hyderabad's Premier Pet Kennels</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Best Pet Kennels
            <br />
            <span className="font-accent text-4xl md:text-6xl" style={{
              background: 'linear-gradient(135deg, #f0c040, #d4a017)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              in Hyderabad
            </span>
          </h1>

          <p className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Bringing home pure breed, healthy puppies with love and care since 2015.
            Your perfect companion is waiting for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pets"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-brown-900 shadow-2xl hover:shadow-gold-500/30 transition-all duration-300 hover:scale-105 text-lg"
              style={{background: 'linear-gradient(135deg, #f0c040, #d4a017)'}}>
              🐾 View Puppies
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <Link to="/contact"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white border-2 border-white/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-lg">
              📞 Contact Us
            </Link>
            <a href="https://wa.me/919666985145?text=Hi%2C%20I%27m%20interested%20in%20your%20puppies!"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 text-lg shadow-xl"
              style={{background: 'linear-gradient(135deg, #25d366, #128c7e)'}}>
              💬 Chat on WhatsApp
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
            <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-12 bg-brown-800 dark:bg-brown-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="font-display text-3xl font-bold text-gold-400">{stat.number}</div>
                <div className="text-amber-300/70 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-cream dark:bg-brown-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&q=80"
                  alt="Happy dogs at Chaitanya Pets"
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl flex flex-col items-center justify-center shadow-2xl"
                style={{background: 'linear-gradient(135deg, #d4a017, #f0c040)'}}>
                <span className="font-display font-bold text-3xl text-white">9+</span>
                <span className="text-white/90 text-xs text-center font-medium leading-tight">Years of<br/>Excellence</span>
              </div>
              {/* Decorative circle */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-4 border-gold-300/40 dark:border-gold-600/30" />
            </div>

            {/* Content side */}
            <div>
              <p className="font-accent text-xl text-gold-600 dark:text-gold-400 mb-3">About Us</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-brown-800 dark:text-amber-100 mb-6 leading-tight">
                Hyderabad's Most
                <span className="block" style={{
                  background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>Trusted Kennels</span>
              </h2>
              <p className="text-brown-600 dark:text-amber-300/80 text-lg leading-relaxed mb-6">
                We provide <strong>good quality & pure breed puppies</strong> in Hyderabad since 2015. 
                Our kennels maintain the highest standards of animal care, health, and wellbeing.
              </p>
              <p className="text-brown-500 dark:text-amber-400/70 leading-relaxed mb-8">
                Each puppy comes with complete vaccination records, health certificates, and ongoing support. 
                We believe every family deserves a healthy, happy companion.
              </p>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '💉', label: 'Vaccinated Puppies' },
                  { icon: '📋', label: 'Health Certificates' },
                  { icon: '🏥', label: 'Vet Checked' },
                  { icon: '❤️', label: 'Post-sale Support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-amber-50 dark:bg-brown-900 rounded-xl p-3 border border-amber-100 dark:border-brown-800">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium text-brown-700 dark:text-amber-200">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-gold-500 text-xl">★</span>)}
                </div>
                <span className="font-bold text-brown-800 dark:text-amber-100">{avgRating}/5</span>
                <span className="text-brown-500 dark:text-amber-400/70 text-sm">from 500+ happy customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR BREEDS */}
      <section className="py-20 bg-parchment dark:bg-brown-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-accent text-xl text-gold-600 dark:text-gold-400 mb-2">Our Speciality</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brown-800 dark:text-amber-100">
              Popular Breeds
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {breeds.map((breed, i) => (
              <Link key={i} to={`/pets?breed=${breed.name}`}
                className="group bg-white dark:bg-brown-800 rounded-2xl p-5 text-center shadow-sm hover:shadow-xl border border-amber-100 dark:border-brown-700 hover:border-gold-300 dark:hover:border-gold-600 transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-3">{breed.emoji}</div>
                <div className="font-display font-bold text-sm text-brown-800 dark:text-amber-100 leading-tight mb-1">{breed.name}</div>
                <div className="text-xs text-gold-600 dark:text-gold-400">{breed.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PETS */}
      <section className="py-24 bg-cream dark:bg-brown-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <p className="font-accent text-xl text-gold-600 dark:text-gold-400 mb-2">Available Now</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-brown-800 dark:text-amber-100">
                Featured Puppies
              </h2>
            </div>
            <Link to="/pets" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gold-500 text-gold-600 dark:text-gold-400 font-bold hover:bg-gold-500 hover:text-white dark:hover:bg-gold-600 dark:hover:text-white transition-all duration-300 self-start md:self-auto">
              View All Puppies →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <PetCardSkeleton key={i} />)
              : featuredPets.map(pet => <PetCard key={pet._id} pet={pet} />)
            }
          </div>

          {!loading && featuredPets.length === 0 && (
            <div className="text-center py-16 text-brown-500 dark:text-amber-400/60">
              <div className="text-6xl mb-4">🐾</div>
              <p className="text-xl">No puppies available right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      {reviews.length > 0 && (
        <section className="py-24 bg-brown-800 dark:bg-brown-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="font-accent text-xl text-gold-400 mb-2">What They Say</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-amber-100 mb-4">
                Happy Customer Stories
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1">{[1,2,3,4,5].map(i => <span key={i} className="text-gold-400 text-2xl">★</span>)}</div>
                <span className="text-3xl font-bold text-gold-400">{avgRating}</span>
                <span className="text-amber-300/70">/ 5.0 rating</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {reviews.map((review, i) => (
                <div key={i} className="bg-brown-700/50 dark:bg-brown-800/80 rounded-2xl p-6 border border-brown-600 dark:border-brown-700 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
                      style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-amber-100">{review.name}</div>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="text-amber-300/80 leading-relaxed text-sm">"{review.comment}"</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/reviews"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-brown-900 hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{background: 'linear-gradient(135deg, #f0c040, #d4a017)'}}>
                Read All Reviews ★
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="py-20 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #d4a017 0%, #f0c040 50%, #b8860b 100%)'}}>
        <div className="absolute inset-0 opacity-10">
          {['10%', '30%', '50%', '70%', '90%'].map((left, i) => (
            <div key={i} className="absolute text-8xl text-white animate-float" style={{ left, top: '20%', animationDelay: `${i * 0.5}s` }}>🐾</div>
          ))}
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Companion
          </h2>
          <p className="text-white/85 text-lg mb-10">
            Visit us at our kennel in Hyderabad or reach out via WhatsApp. We're here to help you find your dream pet!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pets"
              className="px-8 py-4 rounded-full font-bold text-gold-700 bg-white hover:bg-amber-50 transition-all duration-300 hover:scale-105 shadow-xl text-lg">
              Browse All Puppies
            </Link>
            <a href="https://wa.me/919666985145?text=Hi%20I'm%20interested%20in%20adopting%20a%20puppy!"
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-full font-bold text-white border-2 border-white/60 hover:bg-white/10 transition-all duration-300 hover:scale-105 text-lg">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
