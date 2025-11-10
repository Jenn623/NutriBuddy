// src/components/common/DashboardHeader.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // Asumimos esta ruta
import { useTheme } from '../../Context/ThemeContext'; // <-- Importar useTheme

const DashboardHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // <-- Obtener la ubicación actual

    // ⭐️ OBTENER TEMA Y TOGGLE ⭐️
    const { theme, toggleTheme } = useTheme();

    // Determinar si estamos en la página de Historial o en alguna que NO sea Dashboard
    const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/login' && location.pathname !== '/registro';

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige al login después de cerrar sesión
    };

    const handleBack = () => {
        // Simple función de regresar al Dashboard
        navigate('/dashboard'); 
    };

    const handleToggleTheme = () => {
        toggleTheme();
        setIsMenuOpen(false);
    };

    const handleMyProfile = () => {
        console.log("Navegando a Mi Perfil...");
        // navigate('/profile'); // (Ruta futura)
        setIsMenuOpen(false);
    };

    return (
        <div className="dashboard-header">
            
            <div className="header-info"> 
                <div className="logo-icon">🥕</div>
                <span className="app-title">NutriBuddy</span>
            </div>
            
            {/* ⭐️ GRUPO DE BOTONES A LA DERECHA ⭐️ */}
            <div className="buttons-group-wrapper"> 
                
                {/* 1. Botón de Regreso Condicional */}
                {showBackButton && (
                    <button 
                        className="back-btn settings-icon-btn" // <-- Añadimos la clase de estilo del botón de ajustes
                        onClick={handleBack}
                        aria-label="Volver al Dashboard"
                    >
                        &lt;
                    </button>
                )}

                {/* 2. Contenedor del menú de ajustes (el botón de ajustes está dentro) */}
                <div className="settings-menu-wrapper">
                    <button 
                        className="settings-btn settings-icon-btn" // <-- Usaremos settings-icon-btn para el estilo base
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ⚙️
                    </button>
                    
                    {isMenuOpen && (
                        <div className="settings-dropdown">
                            {/* ⭐️ CAMBIO CRÍTICO: Botón de Dark/Light Mode ⭐️ */}
                            <button onClick={handleToggleTheme}>
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </button>
                            <button onClick={handleLogout}>Log Out</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;