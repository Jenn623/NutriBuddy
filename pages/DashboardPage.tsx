// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importamos useNavigate
import { useAuth } from '../Context/AuthContext';
import { useDailyTracker } from '../hooks/useDailyTracker';
import DashboardPage from '../components/common/DashboardHeader';
import { FoodItem } from '../services/foodData';
import '../components/Ui/DashboardPage.css';
import DashboardHeader from '../components/common/DashboardHeader';
import CalorieSummaryPanel from '../components/common/CalorieSummaryPanel';
import MacroBarChart from '../components/charts/MacroBarChart';

// Componente simulado para el historial de barras (basado en el mockup)
const CalorieHistoryChart: React.FC<{ data: any[] }> = ({ data }) => {

    // Función para imprimir el mensaje en consola
    const handleViewHistory = () => {
        console.log("Viendo historial");
    };

    return (
        // Contenedor que ayuda a controlar el layout interno (CSS)
        <div className="history-chart-mock-container"> 
            <h3 className="chart-title">Calorías últimos días</h3>
            
            <div className="bar-chart-visualization">
                {/* Visualización de barras */}
                {data.map(d => (
                    <div key={d.day} className="bar" style={{ height: `${(d.calories / data[2].calories) * 80}px` }}>
                        {d.day === 'Today' ? 'Today' : ''}
                    </div>
                ))}
            </div>
            
            {/* NUEVO: Botón "Ver historial" */}
            <button onClick={handleViewHistory} className="view-history-btn">
                Ver historial
            </button>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    // Usamos la meta calórica del usuario registrado
    //const calorieGoal = currentUser?.calorieGoal || 2000; 
    //const user = currentUser!; // Asumimos que el usuario está logueado
    //const calorieGoal = user.calorieGoal;

    const navigate = useNavigate();

    // ⭐️ PASO 1: Redirección si el usuario no existe
    useEffect(() => {
        if (currentUser === null) {
            console.warn("Usuario no autenticado. Redirigiendo a Login.");
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // ⭐️ PASO 2: Manejo de la carga (Muestra un spinner o nulo mientras redirige)
    if (currentUser === null) {
        return <div className="loading-screen">Cargando o redirigiendo...</div>;
    }

    // ⭐️ PASO 3: Asignación segura (solo se ejecuta si currentUser NO es null)
    // Eliminamos el operador '!' ya que la verificación de arriba asegura que es un User
    const user = currentUser; 
    const calorieGoal = user.calorieGoal;

    // Inicializamos el hook de seguimiento diario
    const { 
        totalConsumed, 
        consumedList, 
        addFood, 
        removeFood,
        motivationalMessage, 
        foodCatalog, 
        historyData,
        macroConsumed,
        macroGoals 
    } = useDailyTracker(user); //calorieGoal

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

    // Lógica de búsqueda [cite: 90-93]
    const filteredFoods = foodCatalog.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectFood = (food: FoodItem) => {
        setSelectedFood(food);
        setSearchTerm(food.name);
    };

    const handleAddFood = () => {
        if (selectedFood) {
            // Asumimos 1 porción estándar por simplicidad en la UI
            addFood(selectedFood, selectedFood.portionSizeG); 
            setSelectedFood(null);
            setSearchTerm('');
        }
    };

    return (
        <div className="dashboard-page-container">
            <div className="dashboard-card">
                
                {/* 1. Header (NutriBuddy y Configuración) */}
                <DashboardHeader />
                <h2 className="dashboard-title">Dashboard</h2>
                
                <div className="dashboard-grid">
                    
                    {/* 2. Resumen Calórico (REEMPLAZADO) */}
                    <div className="summary-panel-wrapper"> 
                        <CalorieSummaryPanel 
                            calorieGoal={calorieGoal} 
                            totalConsumed={totalConsumed}
                        />
                    </div>

                    {/* GRÁFICA 2: MACRONUTRIENTES */}
                    <div className="macro-panel"> {/* Nuevo panel para macros */}
                        <MacroBarChart 
                            consumed={macroConsumed} 
                            goals={macroGoals} 
                        />
                    </div>



                    {/* 4. Buscador de Alimentos y Registro */}
                    <div className="food-entry-panel">
                        <h3 className="search-label">Search food...</h3>
                        
                        {/* CONTENEDOR FLEXIBLE PARA INPUT Y BOTÓN */}
                        <div className="search-input-group"> 
                            <input
                                type="text"
                                placeholder="Buscar alimento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="food-search-input"
                            />
                            {/* El botón "Add food" se mantiene fijo aquí */}
                            <button 
                                onClick={handleAddFood} 
                                className={`add-food-btn ${!selectedFood ? 'disabled' : ''}`}
                                disabled={!selectedFood} // Deshabilita si no hay nada seleccionado
                            >
                                Add food
                            </button>
                        </div>
                        
                        {/* RESULTADOS DE LA BÚSQUEDA: ENVUELTO EN UN CONTENEDOR CON Z-INDEX */}
                    <div className="search-results-wrapper"> 
                        {searchTerm && filteredFoods.length > 0 && (
                            <ul className="search-results-list">
                                {filteredFoods.map(food => (
                                    <li key={food.id} onClick={() => handleSelectFood(food)}>
                                        {food.name} • {food.portionSizeG} g • {food.calories} kcal
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                        {/* Lista de Consumidos */}
                    <div className="consumed-list">
                        {/* ⭐️ CAMBIO CRÍTICO: Añadir función de eliminar por índice */}
                        {consumedList.slice().reverse().map((entry, index) => ( // Reverse para mostrar el más reciente arriba
                            <div key={index} className="consumed-item">
                                <span className="consumed-info">
                                    {entry.food.name} • {entry.quantityG} g • {entry.totalCalories} kcal
                                </span>
                                {/* El índice es relative al array original, no al invertido, ajustamos: */}
                                <button 
                                    className="delete-btn"
                                    // Usamos el índice REAL en el array consumedList
                                    onClick={() => removeFood(consumedList.length - 1 - index)} 
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    </div>

                    {/* 5. Mensajes Motivacionales (Lado Inferior Derecho del Mockup) */}
                    <div className="message-panel">
                        <p className="motivational-text">{motivationalMessage}</p>
                    </div>
                </div>

                {/* 3. Gráfica de Historial (Lado Superior Derecho del Mockup) */}
                <div className="history-panel full-width-panel">
                    <CalorieHistoryChart data={historyData} />
                </div>
                
            </div>
        </div>
    );
};

export default DashboardPage;