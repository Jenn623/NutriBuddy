import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface CalorieCircularChartProps {
    current: number; // Calorías consumidas
    max: number;     // Meta calórica
}

const CalorieCircularChart: React.FC<CalorieCircularChartProps> = ({ current, max }) => {
    const consumedPercentage = Math.min(100, Math.round((current / max) * 100));

    // ⭐️ LÓGICA DE COLOR ⭐️
    const isExcess = current > max;
    const ACTIVE_COLOR = isExcess ? '#cc0000' : '#10b981'; // Rojo para exceso, Verde para normal
    const INACTIVE_COLOR = '#E0E0E0'; 
    const COLORS = [ACTIVE_COLOR, INACTIVE_COLOR];
    
    // Calcular el valor restante (o el exceso)
    //const remainingValue = max > current ? max - current : 0;
    //const consumedValue = max > current ? current : max; // Mostrar solo hasta el 100% en el círculo principal

    // Ajustamos los valores para el gráfico:
    let displayValue = current;
    let remainingValue = max - current;

    if (isExcess) {
        // Si hay exceso, mostramos el anillo completo (100%) en rojo.
        displayValue = max;
        remainingValue = 0; 
    }
    
    // Datos para la gráfica de pastel (PieChart)
    const data = [
        { name: 'Consumido', value: displayValue },  //consumedValue
        { name: 'Restante', value: remainingValue },
    ];
    
    // Color de la celda: Verde para el consumo, gris para lo restante
    //const COLORS = ['#10b981', '#E0E0E0']; // Verde del mockup y Gris claro

    // Manejo de la etiqueta central (porcentaje)
    const renderCustomLabel = ({ cx, cy }: any) => {
        return (
            <text x={cx} y={cy} dy={5} textAnchor="middle" fill="#333" fontSize="1.8rem" fontWeight="bold">
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
                    {data.map((entry, index) => (
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