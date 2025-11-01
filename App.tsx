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

import { AuthProvider } from './Context/AuthContext'; 

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider> 
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          
          {/* NUEVA RUTA: Para la pantalla principal */}
          <Route path="/dashboard" element={<DashboardPage />} /> 
          
          {/* Redirección: En un proyecto real, esto redirigiría a /login si no está autenticado. 
             Por ahora, sigue enviando a /login. */}
          <Route path="/" element={<Navigate to="/login" replace />} />
            
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;