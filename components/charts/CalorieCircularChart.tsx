import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../Context/ThemeContext'; // <-- Importar useTheme

interface CalorieCircularChartProps {
    current: number; // Calorías consumidas
    max: number;     // Meta calórica
}

const CalorieCircularChart: React.FC<CalorieCircularChartProps> = ({ current, max }) => {
    const { theme } = useTheme(); // Obtener el tema actual
    
    const consumedPercentage = Math.min(100, Math.round((current / max) * 100));

    // Lógica de Color (Se mantiene: Rojo para exceso, Verde para normal)
    const isExcess = current > max;
    const ACTIVE_COLOR = isExcess ? '#ff6b6b' : '#10b981'; // Rojo Brillante para Dark Mode
    const INACTIVE_COLOR = theme === 'dark' ? '#3B4958' : '#E0E0E0'; // Gris más oscuro para Dark Mode
    const COLORS = [ACTIVE_COLOR, INACTIVE_COLOR];
    
    // ⭐️ COLOR DEL TEXTO CENTRAL ⭐️
    const TEXT_COLOR = theme === 'dark' ? '#E6EEF8' : '#333'; 
    
    let displayValue = current;
    let remainingValue = max - current;
    if (isExcess) {
        displayValue = max;
        remainingValue = 0; 
    }

    const data = [
        { name: 'Consumido', value: displayValue },
        { name: 'Restante', value: remainingValue },
    ];
    
    // Color de la celda: Verde para el consumo, gris para lo restante
    //const COLORS = ['#10b981', '#E0E0E0']; // Verde del mockup y Gris claro

    // Manejo de la etiqueta central (porcentaje)
    const renderCustomLabel = ({ cx, cy }: any) => {
        return (
            <text x={cx} y={cy} dy={5} textAnchor="middle" fill={TEXT_COLOR} fontSize="1.8rem" fontWeight="bold">
                {consumedPercentage}%
            </text>
        );
    };

    return (
        <div className="chart-wrapper">
            <PieChart width={150} height={150}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={60} // Grosor del anillo
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                >
                    {data.map((_, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            // Opcional: Si el consumo excede el 100%, podríamos usar un color de exceso
                            strokeWidth={0}
                        />
                    ))}
                </Pie>
                {/* Etiqueta del Porcentaje en el centro */}
                {renderCustomLabel({ cx: 75, cy: 75 })}
            </PieChart>
            
            {/* Texto de Kcal Restantes/Excedidas debajo del círculo */}
             <div className="remaining-kcal-text">
                {remainingValue > 0 
                    ? `${remainingValue} kcal restantes`
                    : `${current - max} kcal excedidas`}
            </div>
        </div>
    );
};

export default CalorieCircularChart;