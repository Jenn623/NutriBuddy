import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../Context/ThemeContext'; // <-- Importar useTheme

interface MacroBarChartProps {
    consumed: { proteinG: number; carbsG: number; fatG: number; };
    goals: { proteinG: number; carbsG: number; fatG: number; };
}

const MacroBarChart: React.FC<MacroBarChartProps> = ({ consumed, goals }) => {

    const { theme } = useTheme(); // Obtener el tema actual
    
    // Colores base para el Modo Oscuro
    const AXIS_COLOR = theme === 'dark' ? '#94A3B8' : '#333'; // Gris claro para modo oscuro
    const GRID_COLOR = theme === 'dark' ? '#3B4958' : '#ccc'; // Gris oscuro/azul para la cuadrícula
    
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
            <h3 className="chart-title">MACRONUTRIENTES CONSUMIDOS</h3>
            
            <ResponsiveContainer width="100%" height={250}> 
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                    {/* Aplicar el color de la cuadrícula */}
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                    
                    {/* Aplicar el color de los ejes */}
                    <XAxis dataKey="name" stroke={AXIS_COLOR} fill={AXIS_COLOR} />
                    <YAxis unit="g" stroke={AXIS_COLOR} fill={AXIS_COLOR} />
                    
                    {/* El Tooltip se controla con CSS, pero pasamos el estilo aquí si es necesario */}
                    <Tooltip 
                        contentStyle={{ backgroundColor: theme === 'dark' ? '#1F2A37' : 'white', border: `1px solid ${GRID_COLOR}` }}
                        itemStyle={{ color: AXIS_COLOR }}
                        formatter={(value, name) => [`${value}g`, name === 'Goal' ? 'Meta' : 'Consumido']}
                    />
                    <Legend iconType="square" verticalAlign="top" height={30} />
                    
                    {/* Barras: Mantenemos el color de acción (Verde/Azul) */}
                    <Bar dataKey="Consumed" fill="#0BB35A" name="Consumido" />
                    <Bar dataKey="Goal" fill="#60A5FA" name="Meta" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MacroBarChart;