import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../../context/AppContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { to: '/admin/pets', icon: '🐾', label: 'Manage Pets' },
  { to: '/admin/gallery', icon: '🖼️', label: 'Gallery' },
  { to: '/admin/reviews', icon: '⭐', label: 'Reviews' },
];

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <div className="min-h-screen flex bg-amber-50 dark:bg-brown-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brown-900 dark:bg-brown-950 border-r border-brown-800 shadow-2xl transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-brown-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{background: 'linear-gradient(135deg, #d4a017, #f0c040)'}}>
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <div className="font-display font-bold text-amber-100 text-sm">Admin Panel</div>
              <div className="text-amber-400/60 text-xs">Chaitanya Pets</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item)
                  ? 'text-white shadow-lg'
                  : 'text-amber-300/70 hover:text-amber-100 hover:bg-brown-800'
              }`}
              style={isActive(item) ? {background: 'linear-gradient(135deg, #d4a017, #b8860b)'} : {}}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-brown-800 space-y-2">
          <a href="/"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-300/70 hover:text-amber-100 hover:bg-brown-800 transition-all">
            <span className="text-xl">🌐</span> View Website
          </a>
          <button onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-300/70 hover:text-amber-100 hover:bg-brown-800 transition-all">
            <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span> {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all">
            <span className="text-xl">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-brown-900 border-b border-amber-100 dark:border-brown-800 shadow-sm px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-brown-800 text-brown-600 dark:text-amber-300">
            ☰
          </button>
          <div className="hidden sm:block">
            <span className="text-brown-500 dark:text-amber-400/60 text-sm">Welcome back, </span>
            <span className="font-bold text-brown-800 dark:text-amber-100">{admin?.username}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow"
              style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}>
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
