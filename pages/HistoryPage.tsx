import React, { useState, useMemo } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { DailyRecord } from '../types/CalorieRecord';
import DashboardHeader from '../components/common/DashboardHeader';
import MacroBarChart from '../components/charts/MacroBarChart'; 
import CalorieCircularChart from '../components/charts/CalorieCircularChart'; 
import '../components/Ui/HistoryPage.css';

// Función helper para cargar todo el historial del usuario desde LocalStorage
const loadUserHistory = (userName: string): DailyRecord[] => {
    const key = `nutri_history_${userName}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
};

const HistoryPage: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    // Si no está logueado, redirigir (Protección de ruta)
    if (!currentUser) {
        navigate('/login');
        return <div className="loading-screen">Redirigiendo...</div>;
    }

    const userHistory = useMemo(() => loadUserHistory(currentUser.name), [currentUser.name]);
    
    // Estado para la fecha seleccionada (usaremos el último día guardado como default)
    const [selectedDate, setSelectedDate] = useState(
        userHistory.length > 0 ? userHistory[userHistory.length - 1].date : ''
    );

    // ⭐️ Encontrar el registro del día seleccionado ⭐️
    const selectedRecord = useMemo(() => 
        userHistory.find(record => record.date === selectedDate)
    , [userHistory, selectedDate]);
    
    const calorieGoal = currentUser.calorieGoal;
    const userMacroGoals = currentUser.macroGoals; // ⭐️ OBTENER LA META DE MACROS DEL USUARIO ⭐️

    // ⭐️ SIMULACIÓN DE DETALLES DE ALIMENTOS (BASADO EN EL MOCKUP) ⭐️
    // Esto es un mock ya que no guardamos los detalles en DailyRecord
    /*const mockFoodDetails = [
        { name: "Sandwich", quantity: 0, calories: 350 },
        { name: "Apple", quantity: 150, calories: 78 },
        { name: "Scrambled Eggs", quantity: 0, calories: 160 },
        { name: "Fried Chicken", quantity: 200, calories: 400 },
    ];*/
    
    //const totalMockCalories = mockFoodDetails.reduce((sum, f) => sum + f.calories, 0);


    // Manejador del cambio de fecha
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className="history-page-container">
            <div className="history-card">
                <DashboardHeader /> 
                <h2 className="history-title">History</h2>
                
                <div className="history-filters">
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={handleDateChange} 
                        className="date-input"
                        max={new Date().toISOString().split('T')[0]} // No permite fechas futuras
                    />
                    <button className="filter-btn">FILTER</button>
                </div>

                <div className="history-grid">
                    
                    {/* LADO IZQUIERDO: Detalles de Alimentos y Progreso Circular */}
    <div className="details-panel">
        <h3 className="selected-date-display">{selectedDate}</h3>

        {selectedRecord ? (
            <>
                {/* ⭐️ CAMBIO CRÍTICO: Usar los alimentos guardados ⭐️ */}
                <div className="food-list-details">
                    {/* Usar los alimentos guardados en el registro del día */}
                    {selectedRecord.foodsConsumedList?.map((entry, index) => (
                        <div key={index} className="food-item-row">
                            <span className="food-name">
                                {entry.food.name} • {entry.quantityG} g
                            </span>
                            <span className="food-calories">{entry.totalCalories} kcal</span>
                        </div>
                    ))}
                </div>

                                {/* Gráfico Circular y Exceso */}
                                <div className="progress-area">
                                    <div className="circular-chart-wrapper">
                                        <CalorieCircularChart 
                                            current={selectedRecord.caloriesConsumed}
                                            max={calorieGoal} 
                                        />
                                    </div>
                                    {selectedRecord.caloriesConsumed > calorieGoal && (
                                        <div className="excess-message">Excess detected</div>
                                    )}
                                </div>
                                
                                <div className="total-row">
                                    <span>Total</span>
                                    <span className="total-calories-value">{selectedRecord.caloriesConsumed} kcal</span>
                                </div>
                            </>
                        ) : (
                            <p className="no-data-message">No hay registro de consumo para esta fecha.</p>
                        )}
                    </div>

                    {/* LADO DERECHO: Gráfica de Macronutrientes y Panel de Mensajes */}
                    <div className="summary-area">
                        {/* 1. Gráfica de Macronutrientes */}
                        <div className="macro-history-panel">
                            {selectedRecord && userMacroGoals ? (
                                <MacroBarChart 
                                    consumed={selectedRecord.macrosConsumed}
                                    goals={currentUser.macroGoals} // Asumimos que guardamos las metas en el usuario para simplificar
                                />
                            ) : (
                                <p className="chart-placeholder">Selecciona una fecha para ver los macros.</p>
                            )}
                        </div>

                        {/* 2. Panel de Mensajes (reutilizado del mockup) */}
                        <div className="message-panel history-message">
                            <p className="motivational-text">Next time, you'll do better!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;