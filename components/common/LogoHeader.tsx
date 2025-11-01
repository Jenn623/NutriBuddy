// componente reutilizable para el logo y titulo del proyecto

import React from 'react';

// props para su reutilización
interface LogoHeaderProps{
    title: string;
    subtitle: string;
}

// componente base
const LogoHeader: React.FC<LogoHeaderProps> = ({title, subtitle}) => {
    return(
        <div className='text-center mb-6'>
            <div className='mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2'>
                {/*Aqui colocar el icono cuando lo consiga lol*/}
                <span className='text-white text-3xl'>🥕</span>
            </div>
            <h1 className='text-2xl font-bold text-gray-800'>{title}</h1>
            <p className='text-sm text-gray-500'>{subtitle}</p>
        </div>
    );
};

export default LogoHeader;