// src/components/common/DashboardHeader.tsx
import React from 'react';
// Asume que tienes un ícono de ajustes (simulado con un div)

const DashboardHeader: React.FC = () => {
    return (
        <div className="dashboard-header">
            <div className="header-info">
                <div className="logo-icon">🥕</div> {/* Reutiliza el logo */}
                <span className="app-title">NutriBuddy</span>
            </div>
            <button className="settings-btn">⚙️</button>
        </div>
    );
};

export default DashboardHeader;