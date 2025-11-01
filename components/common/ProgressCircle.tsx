// src/components/charts/ProgressCircle.tsx
import React from 'react';

interface ProgressCircleProps {
    current: number;
    max: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ current, max }) => {
    const percentage = Math.round((current / max) * 100);
    // Nota: Aquí se implementaría la lógica de la librería de gráficos (ej. SVG/Canvas)
    
    return (
        <div className="progress-circle-wrapper">
            <div className="circle-graphic">{percentage}%</div>
            <span className="current-kcal">{current} kcal</span>
        </div>
    );
};

export default ProgressCircle;