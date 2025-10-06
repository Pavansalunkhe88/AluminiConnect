import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/auth/Login.jsx';

function App() {


  return (
    <>
    <BrowserRouter>
     
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
     
      </BrowserRouter>
    </>
  )
}

export default App
