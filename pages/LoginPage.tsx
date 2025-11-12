import React, { useState } from 'react';
// Reutilizamos componentes comunes
import LogoHeader from '../components/common/LogoHeader';
import Input from '../components/common/Input';
import Button from '../components/common/Buttons'; 
import { useNavigate } from 'react-router-dom';
import '../components/Ui/LoginPage.css'; // Importamos los estilos específicos
import { useAuth } from '../Context/AuthContext';


const LoginPage: React.FC = () => {
    // Estado para nombre y contraseña
    const [credentials, setCredentials] = useState({ name: '', password: '' }); 
    const navigate = useNavigate();
    const { login } = useAuth(); // <--- Usamos la función login del Contexto

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        const success = login(credentials.name, credentials.password);

        if (success) {
            console.log("Acceso exitoso con useAuth. Redirigiendo a /dashboard.");
            // ⭐️ CAMBIO CRÍTICO: Redirigir al dashboard
            navigate('/dashboard'); 
        } else {
            alert("Credenciales inválidas. Por favor, verifica tu nombre y contraseña.");
        }
    };

    const handleRegisterClick = () => {
        navigate('/registro');
    };

    return (
        <div className="login-page">
            <div className="form-container">
                
                <LogoHeader 
                    title="NutriBuddy"
                    subtitle="¡Controla tu ingesta diaria fácilmente!"
                />
                
                <form onSubmit={handleLogin} className="form-content">
                    {/* Campo de Nombre */}
                    <Input 
                        type="text"
                        name="name"
                        placeholder="Usuario"
                        value={credentials.name}
                        onChange={handleChange}
                        required
                    />
                    
                    {/* Campo de Contraseña */}
                    <Input 
                        type="password" 
                        name="password"
                        placeholder="Contraseña"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" className="submit-button">
                        Iniciar Sesión
                    </Button>
                </form>
                
                <p className="register-link-text">
                    ¿No tienes una cuenta? 
                    <a onClick={handleRegisterClick} className="register-link">
                        Regístrate
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;