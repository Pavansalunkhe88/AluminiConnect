import { useState } from 'react'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/auth/Login.jsx';
import RegisterPage from './pages/auth/Register.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
