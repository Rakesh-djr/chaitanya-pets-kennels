import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { petsAPI, reviewsAPI } from '../../utils/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 600 },
  plugins: { legend: { labels: { color: '#a0522d', font: { family: 'Lato', size: 12 } } } },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0 });
  const [petsOverTime, setPetsOverTime] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewsOverTime, setReviewsOverTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      petsAPI.getStats(),
      reviewsAPI.getStats(),
      reviewsAPI.getAllAdmin(),
    ]).then(([statsRes, reviewStatsRes, reviewsRes]) => {
      setStats(statsRes.data.stats);
      setPetsOverTime(statsRes.data.petsOverTime);
      setReviewsOverTime(reviewStatsRes.data.reviewsOverTime);
      setReviewCount(reviewsRes.data.reviews.length);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Pets', value: stats.total, icon: '🐾', color: 'from-amber-400 to-amber-600', link: '/admin/pets' },
    { label: 'Available', value: stats.available, icon: '🟢', color: 'from-green-400 to-green-600', link: '/admin/pets' },
    { label: 'Sold', value: stats.sold, icon: '🔴', color: 'from-red-400 to-red-600', link: '/admin/pets' },
    { label: 'Total Reviews', value: reviewCount, icon: '⭐', color: 'from-gold-400 to-gold-600', link: '/admin/reviews' },
  ];

  // Chart data
  const months = petsOverTime.map(d => d._id);
  const petCounts = petsOverTime.map(d => d.count);

  const lineData = {
    labels: months.length > 0 ? months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Pets Added',
      data: petCounts.length > 0 ? petCounts : [2, 5, 3, 8, 4, 6],
      borderColor: '#d4a017',
      backgroundColor: 'rgba(212, 160, 23, 0.15)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#d4a017',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
    }],
  };

  const pieData = {
    labels: ['Available', 'Sold'],
    datasets: [{
      data: [stats.available || 1, stats.sold || 0],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderColor: ['#16a34a', '#dc2626'],
      borderWidth: 2,
    }],
  };

  const revMonths = reviewsOverTime.map(d => d._id);
  const revCounts = reviewsOverTime.map(d => d.count);

  const barData = {
    labels: revMonths.length > 0 ? revMonths : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Reviews',
      data: revCounts.length > 0 ? revCounts : [1, 3, 2, 5, 4, 6],
      backgroundColor: 'rgba(212, 160, 23, 0.7)',
      borderColor: '#d4a017',
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-brown-800 dark:text-amber-100">Dashboard</h1>
        <p className="text-brown-500 dark:text-amber-400/60 mt-1">Overview of Chaitanya Pets Kennels</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Link key={i} to={card.link}
            className="group bg-white dark:bg-brown-900 rounded-2xl p-5 border border-amber-100 dark:border-brown-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div className="font-display text-3xl font-bold text-brown-800 dark:text-amber-100">{card.value}</div>
            <div className="text-sm text-brown-500 dark:text-amber-400/70 mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-white dark:bg-brown-900 rounded-2xl p-6 border border-amber-100 dark:border-brown-800 shadow-sm">
          <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 mb-5">Pets Added Over Time</h3>
          <div style={{ position: 'relative', height: '260px' }}>
            <Line data={lineData} options={{
              ...chartDefaults,
              maintainAspectRatio: false,
              scales: {
                x: { ticks: { color: '#a0522d' }, grid: { color: 'rgba(212,160,23,0.1)' } },
                y: { ticks: { color: '#a0522d', stepSize: 1 }, grid: { color: 'rgba(212,160,23,0.1)' } }
              }
            }} />
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-brown-900 rounded-2xl p-6 border border-amber-100 dark:border-brown-800 shadow-sm">
          <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 mb-5">Available vs Sold</h3>
          <div style={{ position: 'relative', height: '200px' }}>
            <Pie data={pieData} options={{ ...chartDefaults, maintainAspectRatio: false }} />
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Available: {stats.available}</div>
            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Sold: {stats.sold}</div>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white dark:bg-brown-900 rounded-2xl p-6 border border-amber-100 dark:border-brown-800 shadow-sm">
        <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 mb-5">Reviews Trend</h3>
        <div style={{ position: 'relative', height: '240px' }}>
          <Bar data={barData} options={{
            ...chartDefaults,
            maintainAspectRatio: false,
            scales: {
              x: { ticks: { color: '#a0522d' }, grid: { display: false } },
              y: { ticks: { color: '#a0522d', stepSize: 1 }, grid: { color: 'rgba(212,160,23,0.1)' } }
            }
          }} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-brown-900 rounded-2xl p-6 border border-amber-100 dark:border-brown-800 shadow-sm">
        <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/pets" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white shadow hover:shadow-md transition-all hover:scale-105 text-sm" style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}>
            ➕ Add New Pet
          </Link>
          <Link to="/admin/gallery" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white shadow hover:shadow-md transition-all hover:scale-105 text-sm bg-blue-500 hover:bg-blue-600">
            📷 Upload Photos
          </Link>
          <Link to="/admin/reviews" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white shadow hover:shadow-md transition-all hover:scale-105 text-sm bg-purple-500 hover:bg-purple-600">
            💬 Manage Reviews
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white shadow hover:shadow-md transition-all hover:scale-105 text-sm bg-green-500 hover:bg-green-600">
            🌐 View Website
          </a>
        </div>
      </div>
    </div>
  );
}
