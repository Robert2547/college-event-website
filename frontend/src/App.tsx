import React from "react";
import "./App.css";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import { useAuthStore } from "./hooks/useAuthStore";
import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicEvents from './pages/PublicEvents';
import PrivateEvents from './pages/PrivateEvents';
import RsoEvents from './pages/RsoEvents';
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Unauthorized from "./pages/Unathorized";
import Layout from "./components/Layout";
import CreateEventForm from "./pages/CreateEventForm";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className='App'>
        <Toaster position='top-center' />
        <Routes>
          {/* Public routes */}
          <Route
            path='/login'
            element={
              isAuthenticated ? <Navigate to='/dashboard' /> : <LoginForm />
            }
          />
          <Route
            path='/signup'
            element={
              isAuthenticated ? <Navigate to='/dashboard' /> : <SignUpForm />
            }
          />

          {/* Protected routes with Layout */}
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin routes example */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute requiredRole='ADMIN'>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/admin/create-event'
            element={
              <ProtectedRoute requiredRole='ADMIN'>
                <Layout>
                  <CreateEventForm />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Super Admin routes example */}
          <Route
            path='/superAdmin'
            element={
              <ProtectedRoute requiredRole='SUPER_ADMIN'>
                <Layout>
                  <SuperAdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path='/events/public' element={<PublicEvents />} />

          <Route
            path='/events/private'
            element={
              <ProtectedRoute>
                <Layout>
                  <PrivateEvents />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path='/events/rso'
            element={
              <ProtectedRoute>
                <Layout>
                  <RsoEvents />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Unauthorized route */}
          <Route
            path='/unauthorized'
            element={
              <Layout>
                <Unauthorized />
              </Layout>
            }
          />

          {/* Default redirect */}
          <Route path='/' element={<Navigate to='/dashboard' />} />
          <Route path='*' element={<Navigate to='/dashboard' />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
