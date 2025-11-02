import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/auth/Login.jsx';
import RegisterPage from './pages/auth/Register.jsx';

function App() {


  return (
    <>
    <BrowserRouter>
     
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
     
      </BrowserRouter>
    </>
  )
}

export default App
