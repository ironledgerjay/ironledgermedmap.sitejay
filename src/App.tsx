import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Membership from './pages/Membership';
import DoctorPortal from './pages/DoctorPortal';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorEnrollment from './pages/DoctorEnrollment';
import EmergencyDoctors from './pages/EmergencyDoctors';
import AdminSetupPage from './pages/AdminSetupPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MedicalDisclaimers from './pages/MedicalDisclaimers';
import DoctorTerms from './pages/DoctorTerms';
import CookiePolicy from './pages/CookiePolicy';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/doctor-portal" element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorPortal />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/AdminDashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/doctor-enrollment" element={<DoctorEnrollment />} />
        <Route path="/emergency-doctors" element={<EmergencyDoctors />} />
        <Route path="/AdminSetupPage" element={<AdminSetupPage />} />
        <Route path="/admin-setup" element={<AdminSetupPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/medical-disclaimers" element={<MedicalDisclaimers />} />
        <Route path="/doctor-terms" element={<DoctorTerms />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
