import React from 'react';
import CalorieCircularChart from '../charts/CalorieCircularChart';

interface CalorieSummaryPanelProps {
    calorieGoal: number;
    totalConsumed: number;
}

const CalorieSummaryPanel: React.FC<CalorieSummaryPanelProps> = ({ calorieGoal, totalConsumed }) => {
    
    return (
        <div className="summary-panel">
            {/* LADO IZQUIERDO */}
            <div className="summary-info-left">
                {/* Daily Caloric Intake y Meta */}
                <span className="summary-label">Ingesta diaria</span>
                <h3 className="calorie-goal">{calorieGoal} kcal</h3>
                
                <hr className="summary-divider" /> {/* Línea divisora */}
                
                {/* Today's Intake y Consumo Actual */}
                <span className="summary-label">Ingesta del día</span>
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