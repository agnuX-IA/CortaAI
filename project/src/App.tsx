import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BusinessLogin from './pages/auth/BusinessLogin';
import BusinessRegister from './pages/auth/BusinessRegister';
import ClientLogin from './pages/auth/ClientLogin';
import ClientRegister from './pages/auth/ClientRegister';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBusinesses from './pages/admin/Businesses';
import AdminBusinessDetails from './pages/admin/BusinessDetails';
import AdminBusinessEdit from './pages/admin/BusinessEdit';
import AdminBusinessCreate from './pages/admin/BusinessCreate';
import AdminSettings from './pages/admin/Settings';

// Business pages
import BusinessDashboard from './pages/business/Dashboard';
import BusinessClients from './pages/business/Clients';
import BusinessClientHistory from './pages/business/ClientHistory';
import BusinessClientEdit from './pages/business/ClientEdit';
import BusinessProfessionals from './pages/business/Professionals';
import BusinessProfessionalSchedule from './pages/business/ProfessionalSchedule';
import BusinessProfessionalEdit from './pages/business/ProfessionalEdit';
import BusinessServices from './pages/business/Services';
import BusinessServiceEdit from './pages/business/ServiceEdit';
import BusinessAppointments from './pages/business/Appointments';
import BusinessAppointmentReschedule from './pages/business/AppointmentReschedule';
import BusinessAppointmentDetails from './pages/business/AppointmentDetails';
import BusinessHours from './pages/business/Hours';
import BusinessSubscription from './pages/business/Subscription';
import BusinessSettings from './pages/business/Settings';

// Client pages
import ClientBooking from './pages/client/Booking';
import ClientHistory from './pages/client/History';
import ClientSettings from './pages/client/Settings';

// Auth context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business/login" element={<BusinessLogin />} />
          <Route path="/business/register" element={<BusinessRegister />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/businesses" element={<AdminBusinesses />} />
          <Route path="/admin/businesses/nova" element={<AdminBusinessCreate />} />
          <Route path="/admin/businesses/:id" element={<AdminBusinessDetails />} />
          <Route path="/admin/businesses/editar/:id" element={<AdminBusinessEdit />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Business routes */}
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/business/clients" element={<BusinessClients />} />
          <Route path="/business/clients/historico/:id" element={<BusinessClientHistory />} />
          <Route path="/business/clients/editar/:id" element={<BusinessClientEdit />} />
          <Route path="/business/professionals" element={<BusinessProfessionals />} />
          <Route path="/business/professionals/agenda/:id" element={<BusinessProfessionalSchedule />} />
          <Route path="/business/professionals/editar/:id" element={<BusinessProfessionalEdit />} />
          <Route path="/business/services" element={<BusinessServices />} />
          <Route path="/business/services/editar/:id" element={<BusinessServiceEdit />} />
          <Route path="/business/appointments" element={<BusinessAppointments />} />
          <Route path="/business/appointments/reagendar/:id" element={<BusinessAppointmentReschedule />} />
          <Route path="/business/appointments/detalhes/:id" element={<BusinessAppointmentDetails />} />
          <Route path="/business/hours" element={<BusinessHours />} />
          <Route path="/business/subscription" element={<BusinessSubscription />} />
          <Route path="/business/settings" element={<BusinessSettings />} />
          
          {/* Client routes */}
          <Route path="/client/:businessId/booking" element={<ClientBooking />} />
          <Route path="/client/:businessId/history" element={<ClientHistory />} />
          <Route path="/client/:businessId/settings" element={<ClientSettings />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;