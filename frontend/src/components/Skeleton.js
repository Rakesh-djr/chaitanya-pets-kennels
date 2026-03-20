import React from 'react';

export const PetCardSkeleton = () => (
  <div className="bg-white dark:bg-brown-900 rounded-2xl overflow-hidden shadow">
    <div className="skeleton h-56 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4 rounded-full" />
      <div className="skeleton h-4 w-1/2 rounded-full" />
      <div className="skeleton h-4 w-1/3 rounded-full" />
      <div className="flex justify-between mt-4">
        <div className="skeleton h-8 w-24 rounded-full" />
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

export const ReviewSkeleton = () => (
  <div className="bg-white dark:bg-brown-900 rounded-2xl p-6 space-y-3 shadow">
    <div className="flex gap-3 items-center">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-4 w-1/3 rounded-full" />
        <div className="skeleton h-3 w-1/4 rounded-full" />
      </div>
    </div>
    <div className="skeleton h-4 w-full rounded-full" />
    <div className="skeleton h-4 w-5/6 rounded-full" />
  </div>
);

export const GallerySkeleton = () => (
  <div className="masonry-grid">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="masonry-item">
        <div className="skeleton rounded-xl" style={{ height: `${150 + (i % 3) * 60}px` }} />
      </div>
    ))}
  </div>
);

export default PetCardSkeleton;
