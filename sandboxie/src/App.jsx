import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navigation from './components/Navigation';
import SideRays from './components/SideRays';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Module1 from './pages/Module1';
import Module2 from './pages/Module2';
import Module3 from './pages/Module3';
import Module4 from './pages/Module4';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ProfileSidebar from './components/ProfileSidebar';

// Admin Imports
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTutorials from './pages/admin/AdminTutorials';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminSimulations from './pages/admin/AdminSimulations';

const MainLayout = ({ isProfileOpen, setIsProfileOpen }) => (
  <div className="app-shell">
    <Navigation onOpenProfile={() => setIsProfileOpen(true)} />
    <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    <main className="app-main">
      <Outlet />
    </main>
    <footer className="app-footer">
      <div className="app-footer-inner">
        <span className="app-footer-logo">Sandboxie</span>
        <span className="app-footer-copy">© {new Date().getFullYear()} An Ilocano-Based Tutorial System</span>
      </div>
    </footer>
  </div>
);

function App() {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
        <Router>
        <ScrollToTop />
        <SideRays
          rayColor1="#6d28d9" 
          rayColor2="#a78bfa" 
          speed={3} 
          intensity={1.2} 
          spread={2.5}
        />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="tutorials" element={<AdminTutorials />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
            <Route path="simulations" element={<AdminSimulations />} />
          </Route>

          {/* Standard App Routes */}
          <Route element={<MainLayout isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} />}>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/module/1" element={<ProtectedRoute><Module1 /></ProtectedRoute>} />
            <Route path="/module/2" element={<ProtectedRoute><Module2 /></ProtectedRoute>} />
            <Route path="/module/3" element={<ProtectedRoute><Module3 /></ProtectedRoute>} />
            <Route path="/module/4" element={<ProtectedRoute><Module4 /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
