import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/AppContext';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/pets', label: 'Puppies' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 dark:bg-brown-950/95 backdrop-blur-xl shadow-lg shadow-amber-100/20 dark:shadow-brown-900/40'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300" style={{background: 'linear-gradient(135deg, #d4a017, #f0c040, #b8860b)'}}>
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight text-brown-750 dark:text-amber-100">
                Chaitanya Pets
              </div>
              <div className="font-accent text-xs text-gold-400 dark:text-gold-950 leading-tight">
                Premium Kennels
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-body font-medium text-lg tracking-wide transition-colors duration-200 group ${
                  location.pathname === link.to
                    ? 'text-gold-600 dark:text-gold-400'
                    : 'text-brown-950 dark:text-amber-200 hover:text-gold-600 dark:hover:text-gold-400'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 dark:bg-brown-800 text-gold-600 dark:text-gold-400 hover:bg-amber-200 dark:hover:bg-brown-700 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919666985145?text=Hi%2C%20I%27m%20interested%20in%20your%20puppies!"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #25d366, #128c7e)'}}
            >
              <span>💬</span> WhatsApp
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 dark:bg-brown-800 text-brown-700 dark:text-amber-200"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/98 dark:bg-brown-950/98 backdrop-blur-xl border-t border-amber-100 dark:border-brown-800 px-4 py-6 space-y-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block font-medium text-base py-2 border-b border-amber-50 dark:border-brown-800 ${
                location.pathname === link.to ? 'text-gold-600 dark:text-gold-400' : 'text-brown-700 dark:text-amber-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/919666985145?text=Hi%2C%20I%27m%20interested%20in%20your%20puppies!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-full text-white font-bold"
            style={{background: 'linear-gradient(135deg, #25d366, #128c7e)'}}
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
