// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/User'; // Asume que User.ts contiene la interfaz actualizada
import { useCalorieCalculator } from '../hooks/useCalorieCalculator';

const SESSION_KEY = 'nutri_session_user'; // Clave para guardar el nombre del usuario activo

// 1. Definir la forma del Contexto de Autenticación
interface AuthContextType {
    currentUser: User | null;
    login: (name: string, password: string) => boolean;
    register: (userData: Omit<User, 'id' | 'calorieGoal'>) => boolean; 
    logout: () => void;
}

// Valor por defecto (usamos valores que no deben ser llamados si el Hook se usa correctamente)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Custom Hook para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// 3. Proveedor del Contexto (Lógica de Almacenamiento Local)
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<any> = ({ children }) => {
    // El estado mantendrá al usuario actualmente logueado
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Nota: Por simplicidad y los requisitos del proyecto, el ID de usuario será el nombre.

    // ⭐️ NUEVO ESTADO: Para evitar que el Dashboard intente renderizar antes de la carga ⭐️
    const [isLoading, setIsLoading] = useState(true);

    // ⭐️ INICIALIZAMOS EL HOOK DE CÁLCULO
    const { calculateGoals } = useCalorieCalculator();

    // ⭐️ EFECTO: Carga inicial de la sesión desde LocalStorage ⭐️
    useEffect(() => {
        const storedName = localStorage.getItem(SESSION_KEY);
        
        if (storedName) {
            const storedUserData = localStorage.getItem(storedName);
            if (storedUserData) {
                // Si encontramos el usuario, lo cargamos en el estado
                setCurrentUser(JSON.parse(storedUserData) as User);
                console.log(`Sesión reestablecida para: ${storedName}`);
            } else {
                // Limpiar la clave si el usuario no existe (seguridad)
                localStorage.removeItem(SESSION_KEY);
            }
        }
        
        // La carga ha terminado, permitimos que los componentes se rendericen
        setIsLoading(false); 
    }, []); // Array de dependencias vacío para que se ejecute solo al montar

    // Función de REGISTRO
    const register = (userData: Omit<User, 'id' | 'calorieGoal' | 'macroGoals'>): boolean => {
        // Validación de existencia (el nombre debe ser único)
        if (localStorage.getItem(userData.name)) {
            console.error('El nombre de usuario ya existe.');
            return false;
        }

        // ⭐️ CAMBIO CRÍTICO: CALCULAR METAS REALES
        const goals = calculateGoals(userData); 
        const realCalorieGoal = goals.tdee; // TDEE calculado

        // Crea el objeto User completo
        /*const newUser: User = {
            ...userData,
            id: userData.name, // Usamos el nombre como ID único
            calorieGoal: realCalorieGoal,
        };*/

        const newUser: User = {
            ...userData,
            id: userData.name, 
            calorieGoal: goals.tdee, 
            macroGoals: { // ⭐️ GUARDAMOS LAS METAS CALCULADAS AQUÍ ⭐️
                proteinG: goals.proteinG,
                carbsG: goals.carbsG,
                fatG: goals.fatG
            }
        };

        try {
            // Guarda los datos en LocalStorage (la clave es el nombre)
            localStorage.setItem(newUser.name, JSON.stringify(newUser));
            
            // Asigna el usuario actual y lo loguea inmediatamente después del registro
            setCurrentUser(newUser); 
            console.log(`Registro exitoso. Meta calórica: ${realCalorieGoal} kcal`);
            return true;
        } catch (error) {
            console.error('Error al guardar en LocalStorage:', error);
            return false;
        }
    };

    // Función de LOGIN
    const login = (name: string, password: string): boolean => {
        const storedUserData = localStorage.getItem(name);

        if (!storedUserData) {
            console.error('Fallo de inicio de sesión: Usuario no encontrado.');
            return false;
        }

        const user: User = JSON.parse(storedUserData);

        // Verificación de Contraseña (sin hashing, según los requisitos simples)
        if (user.password === password) {
            setCurrentUser(user);
            console.log('Inicio de sesión exitoso:', user.name);
            // ⭐️ GUARDAR EL NOMBRE EN LA CLAVE DE SESIÓN ACTIVA ⭐️
            localStorage.setItem(SESSION_KEY, name); 
            console.log('Inicio de sesión exitoso:', user.name);
            return true;
        } else {
            console.error('Fallo de inicio de sesión: Contraseña incorrecta.');
            return false;
        }
    };
    
    // Función de Cierre de Sesión
    const logout = () => {
        setCurrentUser(null);
        // También puedes limpiar cualquier token de sesión si existiera
        console.log('Sesión cerrada.');
        // ⭐️ ELIMINAR LA CLAVE DE SESIÓN ACTIVA ⭐️
        localStorage.removeItem(SESSION_KEY); 
        console.log('Sesión cerrada.');
    };

    // Si la aplicación está cargando la sesión, mostramos un indicador para evitar el contenido
    if (isLoading) {
        return <div className="auth-loading">Cargando sesión...</div>;
    }

    const value = {
        currentUser,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};