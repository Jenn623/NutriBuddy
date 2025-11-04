import React from 'react';
import CalorieCircularChart from '../charts/CalorieCircularChart';

interface CalorieSummaryPanelProps {
    calorieGoal: number;
    totalConsumed: number;
    calorieDifference: number; // ⭐️ NUEVO PROP ⭐️
}

const CalorieSummaryPanel: React.FC<CalorieSummaryPanelProps> = ({ calorieGoal, totalConsumed, calorieDifference }) => {
    
    return (
        <div className="summary-panel">
            {/* LADO IZQUIERDO */}
            <div className="summary-info-left">
                {/* Daily Caloric Intake y Meta */}
                <span className="summary-label">Daily Caloric Intake</span>
                <h3 className="calorie-goal">{calorieGoal} kcal</h3>
                
                <hr className="summary-divider" /> {/* Línea divisora */}
                
                {/* Today's Intake y Consumo Actual */}
                <span className="summary-label">Today's Intake</span>
                <h3 className="calorie-consumed">{totalConsumed} kcal</h3>
            </div>

            {/* LADO DERECHO: Gráfico Circular */}
            <div className="summary-chart-right">
                <CalorieCircularChart 
                    current={totalConsumed} 
                    max={calorieGoal} 
                />
            </div>
        </div>
    );
};

export default CalorieSummaryPanel;