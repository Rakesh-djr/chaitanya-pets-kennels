import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brown-900 dark:bg-brown-950 text-amber-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #d4a017, #f0c040, #b8860b)'}}>
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <div className="font-display font-bold text-lg text-amber-100">Chaitanya Pets</div>
                <div className="font-accent text-xs text-gold-400">Premium Kennels</div>
              </div>
            </div>
            <p className="text-amber-300/80 text-sm leading-relaxed mb-4">
              Providing pure breed, healthy puppies in Hyderabad since 2015. Your trusted source for premium quality pets.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/919666985145" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                style={{background: '#25d366'}}>
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.823.737 5.471 2.027 7.773L0 32l8.48-2.003A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.21 22.297c-.34.96-1.983 1.83-2.72 1.947-.736.117-1.666.166-2.688-.168a24.7 24.7 0 01-2.436-.9c-4.285-1.853-7.08-6.183-7.293-6.47-.213-.287-1.73-2.3-1.73-4.385s1.096-3.114 1.486-3.54c.39-.427.853-.534 1.137-.534l.82.015c.262.013.614-.1.96.733.347.833 1.18 2.877 1.28 3.085.1.207.167.45.033.72-.133.27-.2.437-.393.673-.194.237-.407.53-.58.713-.194.207-.396.43-.17.844.226.414.998 1.646 2.144 2.667 1.473 1.313 2.717 1.72 3.13 1.913.413.194.654.166.893-.1.24-.266 1.023-1.193 1.296-1.606.273-.413.547-.34.92-.207.373.133 2.37 1.12 2.777 1.327.407.207.68.31.78.48.1.17.1.98-.24 1.94z"/></svg>
              </a>
              <a href="tel:9666985145"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gold-600 text-white transition-transform hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-amber-100 mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/pets', 'View Puppies'], ['/gallery', 'Gallery'], ['/reviews', 'Reviews'], ['/contact', 'Contact Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-amber-300/80 hover:text-gold-400 transition-colors text-sm flex items-center gap-2">
                    <span className="text-gold-500">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Breeds */}
          <div>
            <h4 className="font-display font-bold text-amber-100 mb-4 text-lg">Popular Breeds</h4>
            <ul className="space-y-2">
              {['Golden Retriever', 'Labrador', 'German Shepherd', 'Siberian Husky', 'Rottweiler', 'Beagle', 'Pomeranian', 'Shih Tzu'].map(breed => (
                <li key={breed}>
                  <Link to={`/pets?breed=${breed}`} className="text-amber-300/80 hover:text-gold-400 transition-colors text-sm flex items-center gap-2">
                    <span className="text-gold-500">›</span> {breed}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-amber-100 mb-4 text-lg">Contact Info</h4>
            <div className="space-y-3 text-sm text-amber-300/80">
              <div className="flex gap-3">
                <span className="text-gold-400 mt-0.5 flex-shrink-0">📍</span>
                <span>12-11-1653/A, Vidya Nagar, Amber Nagar, Warasiguda, Hyderabad</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-400">📞</span>
                <a href="tel:9666985145" className="hover:text-gold-400 transition-colors">+91 96669 85145</a>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-400">⏰</span>
                <span>Mon–Sun: 9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gold-400">📍</span>
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-brown-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-amber-400/60 text-sm text-center">
            © 2024 Chaitanya Pets Kennels. All rights reserved. | Hyderabad, India
          </p>
          <div className="flex items-center gap-2 text-amber-400/60 text-sm">
            <span>Made with</span>
            <span className="text-red-400">❤</span>
            <span>for pet lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
