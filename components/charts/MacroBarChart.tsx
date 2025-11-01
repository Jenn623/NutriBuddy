import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MacroBarChartProps {
    consumed: { proteinG: number; carbsG: number; fatG: number; };
    goals: { proteinG: number; carbsG: number; fatG: number; };
}

const MacroBarChart: React.FC<MacroBarChartProps> = ({ consumed, goals }) => {
    
    // Estructurar los datos para la gráfica de barras
    const data = [
        { 
            name: 'Carbohidratos', 
            Consumed: consumed.carbsG, 
            Goal: goals.carbsG 
        },
        { 
            name: 'Proteínas', 
            Consumed: consumed.proteinG, 
            Goal: goals.proteinG 
        },
        { 
            name: 'Grasas', 
            Consumed: consumed.fatG, 
            Goal: goals.fatG 
        },
    ];

    return (
        <div className="macro-chart-container">
            <h3 className="chart-title">MACRONUTRIENTS CONSUMED</h3>
            
            {/* ResponsiveContainer asegura que el gráfico se ajuste al contenedor del panel */}
            <ResponsiveContainer width="100%" height={250}> 
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#333" />
                    <YAxis unit="g" stroke="#333" />
                    <Tooltip 
                        formatter={(value, name) => [`${value}g`, name === 'Goal' ? 'Meta' : 'Consumido']}
                    />
                    <Legend iconType="square" verticalAlign="top" height={30} />
                    
                    {/* Barras de Consumido (Verde) */}
                    <Bar dataKey="Consumed" fill="#10b981" name="Consumido" />
                    
                    {/* Barras de Meta (Gris/Azul) */}
                    <Bar dataKey="Goal" fill="#3b82f6" name="Meta" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MacroBarChart;