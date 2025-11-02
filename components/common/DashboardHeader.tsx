// src/components/common/DashboardHeader.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asumimos esta ruta

const DashboardHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige al login después de cerrar sesión
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
            
            {/* Contenedor del menú de ajustes */}
            <div className="settings-menu-wrapper">
                <button 
                    className="settings-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ⚙️
                </button>
                
                {isMenuOpen && (
                    <div className="settings-dropdown">
                        <button onClick={handleMyProfile}>My Profile</button>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;