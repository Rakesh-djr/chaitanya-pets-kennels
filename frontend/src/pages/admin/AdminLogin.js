import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { useAuth, useTheme } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.username || !form.password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.admin);
      toast.success('Welcome back, Admin! 🐾');
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else if (err.response?.status === 401) {
        setErrorMsg('Invalid username or password. Default: admin / chaitanya2024');
      } else {
        setErrorMsg(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // One-click admin setup if DB is empty
  const handleSetup = async () => {
    setSetupLoading(true);
    setErrorMsg('');
    try {
      await authAPI.setup();
      toast.success('Admin account created! Now login with admin / chaitanya2024');
      setForm({ username: 'admin', password: 'chaitanya2024' });
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('already exists')) {
        setErrorMsg('Admin already exists. Try logging in with admin / chaitanya2024');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        setErrorMsg(msg || 'Setup failed.');
      }
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-brown-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        {['10%', '30%', '50%', '70%', '90%'].map((l, i) =>
          ['20%', '60%'].map((t, j) => (
            <div key={`${i}-${j}`} className="absolute text-9xl" style={{ left: l, top: t }}>🐾</div>
          ))
        )}
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-brown-800 shadow flex items-center justify-center text-gold-600 hover:scale-110 transition-transform"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white dark:bg-brown-900 rounded-3xl shadow-2xl p-10 border border-amber-100 dark:border-brown-800">

          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040, #b8860b)' }}
            >
              <span className="text-4xl">🐾</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-brown-800 dark:text-amber-100">Admin Login</h1>
            <p className="text-brown-500 dark:text-amber-400/60 text-sm mt-1">Chaitanya Pets Kennels</p>
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex gap-2 items-start">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Username</label>
              <input
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={e => { setForm(p => ({ ...p, username: e.target.value })); setErrorMsg(''); }}
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrorMsg(''); }}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-gold-600 text-lg"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-lg disabled:opacity-60 hover:opacity-90 transition-all hover:scale-105 shadow-lg mt-2"
              style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)' }}
            >
              {loading ? '⏳ Logging in...' : '🔐 Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-amber-100 dark:bg-brown-800" />
            <span className="text-xs text-brown-400 dark:text-amber-500/50">First time?</span>
            <div className="flex-1 h-px bg-amber-100 dark:bg-brown-800" />
          </div>

          {/* Setup button — creates admin if not already present */}
          <button
            onClick={handleSetup}
            disabled={setupLoading}
            className="w-full py-3 rounded-xl font-semibold text-brown-700 dark:text-amber-200 border-2 border-amber-200 dark:border-brown-700 hover:border-gold-400 hover:bg-amber-50 dark:hover:bg-brown-800 disabled:opacity-50 transition-all text-sm"
          >
            {setupLoading ? '⏳ Setting up...' : '⚙️ Create Admin Account (run seed first)'}
          </button>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gold-600 dark:text-gold-400 hover:underline">
              ← Back to Website
            </a>
          </div>

          {/* Hint box */}
          <div className="mt-5 p-4 rounded-xl bg-amber-50 dark:bg-brown-800 border border-amber-200 dark:border-brown-700">
            <p className="text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2">🛠 Quick Setup Checklist</p>
            <ul className="text-xs text-brown-500 dark:text-amber-400/70 space-y-1">
              <li>1. Start MongoDB locally or use Atlas</li>
              <li>2. <code className="bg-amber-100 dark:bg-brown-700 px-1 rounded">cd backend && npm run seed</code></li>
              <li>3. Login: <strong>admin</strong> / <strong>chaitanya2024</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
