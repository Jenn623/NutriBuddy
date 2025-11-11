// src/components/common/Button.tsx
import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button
            className="w-full py-3 mt-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;