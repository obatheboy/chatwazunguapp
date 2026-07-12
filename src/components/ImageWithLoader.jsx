'use client';

import { useState } from 'react';

export default function ImageWithLoader({ src, alt, className, onError, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-[#2A2522] to-[#1A1715] ${className || ''}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 shimmer" />
      )}
      {!error && src && src !== '/default-avatar.png' ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            setError(true);
            if (onError) onError(e);
          }}
          {...props}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-6xl opacity-50">👤</span>
        </div>
      )}
    </div>
  );
}
