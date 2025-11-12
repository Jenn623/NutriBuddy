import React, { useState } from 'react';
import LogoHeader from '../components/common/LogoHeader';
import Input from '../components/common/Input';
import Button from '../components/common/Buttons'; // Asumo que el archivo se llama 'Buttons.tsx'
import type { User, ActivityLevel } from '../types/User'; 
// Importamos el archivo CSS de este componente
import '../components/Ui/ResgisterPage.css'
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Definición de tipos para el estado del formulario (incluye el campo de confirmación)
type RegisterFormData = Partial<Omit<User, 'id' | 'calorieGoal'>> & { confirmPassword?: string };

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({});
    const navigate = useNavigate();
    const { register } = useAuth(); // Obtiene la función de registro del Contexto
    
    // Función para manejar el envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const { confirmPassword, ...userData } = formData;
        
        // 1. Validación de Contraseñas
        if (userData.password !== confirmPassword) {
            alert('Las contraseñas no coinciden. Por favor, verifica.');
            return;
        }

        // 2. Validación de Campos Requeridos
        const requiredFields = ['name', 'password', 'age', 'weightKg', 'heightCm', 'gender', 'activityLevel'];
        const missingField = requiredFields.find(field => !userData[field as keyof typeof userData]);
        
        if (missingField) {
            alert(`Falta completar el campo: ${missingField}`);
            return;
        }

        // 3. Llamada a la función de registro
        // Se asegura que userData cumpla con el tipo esperado por la función register
        const success = register(userData as Omit<User, 'id' | 'calorieGoal'>);

        if (success) {
            alert("¡Registro exitoso! Serás redirigido para iniciar sesión.");
            // 4. Redirige a la página de login
            navigate('/login'); 
        } else {
            // Este error ocurre si el nombre de usuario ya existe (lógica en AuthContext)
            alert("Error en el registro. Es posible que el nombre de usuario ya exista.");
        }
    };

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };
    
    // Datos para el campo Nivel de Actividad Física
    const activityLevels: { value: ActivityLevel, label: string }[] = [
        { value: 'sedentary', label: 'Sedentario' },
        { value: 'light', label: 'Ligera' },
        { value: 'moderate', label: 'Moderada' },
        { value: 'intense', label: 'Intensa' },
    ];

    return (
        <div className="register-page">
            <div className="form-container">
                
                {/* Encabezado con logo */}
                <LogoHeader 
                    title="NutriBuddy"
                    subtitle="¡Regístrate para comenzar el NutriSeguimiento!"
                />
                
                <form onSubmit={handleSubmit} className="form-content">
                    {/* Campo Nombre */}
                    <Input 
                        type="text" 
                        name="name" 
                        placeholder="Usuario" 
                        onChange={handleChange} 
                        required 
                    />

                    {/* Fila: Edad y Peso */}
                    <div className="form-row">
                        <Input 
                            type="number" 
                            name="age" 
                            placeholder="Edad" 
                            min="1" 
                            onChange={handleChange} 
                            required 
                        />
                        <Input 
                            type="number" 
                            name="weightKg" 
                            placeholder="Peso (kg)" 
                            step="0.1" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    {/* Fila: Sexo y Altura */}
                    <div className="form-row">
                        <select 
                            name="Sexo" 
                            onChange={handleChange} 
                            className="form-select-half" 
                            defaultValue="" 
                            required
                        >
                            <option value="" disabled>Sex</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                        </select>
                        <Input 
                            type="number" 
                            name="heightCm" 
                            placeholder="Altura (cm)" 
                            min="1" 
                            onChange={handleChange} 
                            required 
                            className="form-input-half" 
                        />
                    </div>

                    {/* Nivel de Actividad Física */}
                    <select 
                        name="activityLevel" 
                        onChange={handleChange} 
                        className="form-select-full" 
                        defaultValue="" 
                        required
                    >
                        <option value="" disabled>Nivel de Actividad Física</option>
                        {activityLevels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                    </select>

                    {/* Fila: Contraseña y Confirmar Contraseña */}
                    <div className="form-row">
                        <Input 
                            type="password" 
                            name="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" className="submit-button">REGISTRARSE</Button>
                </form>
                
                {/* Enlace de Login */}
                <p className="login-link-text">
                    ¿Ya tienes una cuenta? 
                    <a href="/login" className="login-link">
                        Iniciar Sesión
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;