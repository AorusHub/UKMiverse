import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import UKM from './pages/UKM';
import About from './pages/About';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import TestProtectedRoutes from './pages/TestProtectedRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/daftar-ukm" element={<UKM />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/test-protected" element={<TestProtectedRoutes />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
