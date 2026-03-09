import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Pages publiques
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Collectivites from './pages/Collectivites.jsx';
import Actualites from './pages/Actualites.jsx';
import ActualiteDetail from './pages/ActualiteDetail.jsx';
import Contact from './pages/Contact.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import CGV from './pages/CGV.jsx';
import NotFound from './pages/NotFound.jsx';

// Admin
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminArticles from './pages/admin/AdminArticles.jsx';
import AdminArticleForm from './pages/admin/AdminArticleForm.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* ── Site public ───────────────────────── */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/collectivites" element={<Collectivites />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:slug" element={<ActualiteDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ── Admin ─────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="actualites" element={<AdminArticles />} />
          <Route path="actualites/nouveau" element={<AdminArticleForm />} />
          <Route path="actualites/:id/modifier" element={<AdminArticleForm />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
