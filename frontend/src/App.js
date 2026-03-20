import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, AuthProvider, useAuth } from './context/AppContext';

// Public pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Pets from './pages/Pets';
import PetDetail from './pages/PetDetail';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPets from './pages/admin/AdminPets';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReviews from './pages/admin/AdminReviews';
import AdminLayout from './pages/admin/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-brown-900"><div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div></div>;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-cream dark:bg-brown-950 transition-colors duration-300">
    <Navbar />
    <main>{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/pets" element={<PublicLayout><Pets /></PublicLayout>} />
      <Route path="/pets/:id" element={<PublicLayout><PetDetail /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="pets" element={<AdminPets />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#fefaf4', color: '#5c3d08', border: '1px solid #d4a017' },
              success: { iconTheme: { primary: '#d4a017', secondary: '#fff' } },
              error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
