// src/context/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// Clave de persistencia en LocalStorage
const THEME_STORAGE_KEY = 'nutri_theme_preference';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook para consumir el contexto fácilmente
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Inicialización perezosa: Carga el tema guardado o usa 'light' por defecto
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
    });

    // Efecto para aplicar la clase CSS al body y actualizar localStorage
    useEffect(() => {
        const body = document.body;
        // Aplica o remueve la clase .dark-mode
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        // Persistencia
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    // Función para cambiar el tema
    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};