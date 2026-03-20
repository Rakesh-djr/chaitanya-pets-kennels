import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { petsAPI } from '../utils/api';
import PetCard from '../components/PetCard';
import { PetCardSkeleton } from '../components/Skeleton';

export default function Pets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    breed: searchParams.get('breed') || '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    petsAPI.getBreeds().then(res => setBreeds(res.data.breeds)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.breed) params.breed = filters.breed;
    if (filters.status) params.status = filters.status;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    petsAPI.getAll(params)
      .then(res => setPets(res.data.pets))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ breed: '', status: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
  };

  const hasFilters = filters.breed || filters.status || filters.minPrice || filters.maxPrice;

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-950 pt-24 pb-16">
      {/* Header */}
      <div className="relative py-16 text-center" style={{background: 'linear-gradient(135deg, #5c3d08 0%, #a0522d 50%, #d4a017 100%)'}}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-accent text-xl text-gold-300 mb-2">Find Your Friend</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">Our Puppies</h1>
          <p className="text-white/80 text-lg">Pure breed, healthy puppies waiting for their forever home</p>
        </div>
        <div className="absolute inset-0 opacity-5 flex flex-wrap items-center justify-center text-8xl overflow-hidden pointer-events-none">
          {'🐾🐾🐾🐾🐾🐾🐾🐾'.split('').map((p, i) => <span key={i}>{p}</span>)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Filters */}
        <div className="bg-white dark:bg-brown-900 rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-brown-800 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Breed filter */}
            <div className="flex-1 min-w-40">
              <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Breed</label>
              <select
                value={filters.breed}
                onChange={e => handleFilter('breed', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
              >
                <option value="">All Breeds</option>
                {breeds.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Status filter */}
            <div className="flex-1 min-w-36">
              <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Availability</label>
              <select
                value={filters.status}
                onChange={e => handleFilter('status', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
              >
                <option value="">All</option>
                <option value="Available">🟢 Available</option>
                <option value="Sold">🔴 Sold</option>
              </select>
            </div>

            {/* Min Price */}
            <div className="flex-1 min-w-32">
              <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Min Price (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={e => handleFilter('minPrice', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
              />
            </div>

            {/* Max Price */}
            <div className="flex-1 min-w-32">
              <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Max Price (₹)</label>
              <input
                type="number"
                placeholder="100000"
                value={filters.maxPrice}
                onChange={e => handleFilter('maxPrice', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
              />
            </div>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-5 py-3 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-brown-600 dark:text-amber-400/80">
            {loading ? 'Loading...' : `${pets.length} puppies found`}
            {hasFilters && ' (filtered)'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, i) => <PetCardSkeleton key={i} />)
            : pets.map(pet => <PetCard key={pet._id} pet={pet} />)
          }
        </div>

        {!loading && pets.length === 0 && (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="font-display text-2xl text-brown-700 dark:text-amber-200 mb-2">No puppies found</h3>
            <p className="text-brown-500 dark:text-amber-400/60 mb-6">Try adjusting your filters</p>
            <button onClick={clearFilters} className="px-6 py-3 rounded-full font-bold text-white"
              style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
