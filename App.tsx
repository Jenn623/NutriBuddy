// src/App.tsx
// ...
// Importa el nuevo componente LoginPage
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// NUEVO: Importar el Dashboard
import DashboardPage from './pages/DashboardPage'; 
import HistoryPage from './pages/HistoryPage';

import { AuthProvider } from './Context/AuthContext'; 
import { ThemeProvider } from './Context/ThemeContext'; // <-- Importar ThemeProvider

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* ⭐️ PASO CRÍTICO: Envuelve todo con ThemeProvider ⭐️ */}
      <ThemeProvider> 
        <AuthProvider> 
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/historial" element={<HistoryPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;