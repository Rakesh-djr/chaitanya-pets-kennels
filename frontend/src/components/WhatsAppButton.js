import React, { useState } from 'react';

export default function WhatsAppButton({ petName = null }) {
  const [hovered, setHovered] = useState(false);

  const message = petName
    ? `Hi, I'm interested in ${petName}. Is it available?`
    : `Hi, I'm interested in your puppies at Chaitanya Pets Kennels!`;

  const url = `https://wa.me/919666985145?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip */}
      <div className={`transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <div className="bg-white dark:bg-brown-900 text-brown-800 dark:text-amber-100 text-sm font-medium px-4 py-2 rounded-full shadow-xl border border-green-200 whitespace-nowrap">
          {petName ? `Enquire about ${petName}` : 'Chat with us!'}
        </div>
      </div>

      {/* Button */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
        style={{
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          animation: 'pulseGold 2s ease-in-out infinite',
          boxShadow: '0 8px 32px rgba(37, 211, 102, 0.5)'
        }}
      >
        <svg viewBox="0 0 32 32" className="w-9 h-9 fill-white">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.823.737 5.471 2.027 7.773L0 32l8.48-2.003A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.21 22.297c-.34.96-1.983 1.83-2.72 1.947-.736.117-1.666.166-2.688-.168a24.7 24.7 0 01-2.436-.9c-4.285-1.853-7.08-6.183-7.293-6.47-.213-.287-1.73-2.3-1.73-4.385s1.096-3.114 1.486-3.54c.39-.427.853-.534 1.137-.534l.82.015c.262.013.614-.1.96.733.347.833 1.18 2.877 1.28 3.085.1.207.167.45.033.72-.133.27-.2.437-.393.673-.194.237-.407.53-.58.713-.194.207-.396.43-.17.844.226.414.998 1.646 2.144 2.667 1.473 1.313 2.717 1.72 3.13 1.913.413.194.654.166.893-.1.24-.266 1.023-1.193 1.296-1.606.273-.413.547-.34.92-.207.373.133 2.37 1.12 2.777 1.327.407.207.68.31.78.48.1.17.1.98-.24 1.94z"/>
        </svg>
      </div>
    </a>
  );
}
