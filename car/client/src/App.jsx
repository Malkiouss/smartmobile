import { lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Cars = lazy(() => import('./pages/Cars'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const SellCar = lazy(() => import('./pages/SellCar'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AddCar = lazy(() => import('./pages/admin/AddCar'));
const EditCar = lazy(() => import('./pages/admin/EditCar'));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));

const AdminSeo = () => {
  const location = useLocation();
  if (!location.pathname.startsWith('/admin')) return null;

  return (
    <SEO
      title="Administration | AutoSmart Maroc"
      description="Espace admin reserve AutoSmart Maroc."
      path={location.pathname}
      noindex
    />
  );
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <AdminSeo />
        <ScrollToTop />
        <Navbar />
        <main className="app-main">
          <Suspense fallback={<div className="spinner" style={{ marginTop: '120px' }} />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/voitures" element={<Cars />} />
              <Route path="/voitures/:id" element={<CarDetails />} />
              <Route path="/vendre" element={<SellCar />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/admin/add" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
              <Route path="/admin/edit/:id" element={<ProtectedRoute><EditCar /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton floating />
      </div>
    </MotionConfig>
  );
}

export default App;
