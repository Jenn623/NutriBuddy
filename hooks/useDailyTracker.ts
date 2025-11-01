// src/hooks/useDailyTracker.ts
import { useState, useMemo } from 'react';
import { FoodItem, initialFoodList } from '../services/foodData';
import { useCalorieCalculator } from './useCalorieCalculator';
import { User } from '../types/User';

// Interfaz para un registro de alimento consumido
export interface ConsumedFood {
    food: FoodItem;
    quantityG: number;
    totalCalories: number;
}

export const useDailyTracker = (user: User) => {
    // Lista de alimentos consumidos hoy (simulados)
    const { calorieGoal } = user;
    const [consumedList, setConsumedList] = useState<ConsumedFood[]>([]);
    
    // ⭐️ NUEVO: Inicializar el hook de cálculo para obtener las METAS de MACROS
    const { calculateGoals } = useCalorieCalculator();
    
    // ⭐️ CALCULAR LAS METAS DE MACROS UNA VEZ
    const macroGoals = useMemo(() => {
        // user debe ser pasado sin las propiedades 'id', 'calorieGoal', 'password'
        const goals = calculateGoals(user); 
        return goals;
    }, [user, calculateGoals]);


    // Función para registrar un alimento consumido
    const addFood = (food: FoodItem, quantityG: number) => {
        const factor = quantityG / food.portionSizeG;
        const totalCalories = Math.round(food.calories * factor);

        const newEntry: ConsumedFood = {
            food,
            quantityG,
            totalCalories,
        };
        setConsumedList(prev => [...prev, newEntry]);
    };

    const removeFood = (indexToRemove: number) => {
        setConsumedList(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Calcula las calorías consumidas y los macros totales
    const { totalConsumed, totalMacros } = useMemo(() => {
        const totals = consumedList.reduce((acc, entry) => {
            const factor = entry.quantityG / entry.food.portionSizeG;
            
            acc.calories += entry.totalCalories;
            acc.proteinG += entry.food.macros.proteinG * factor;
            acc.carbsG += entry.food.macros.carbsG * factor;
            acc.fatG += entry.food.macros.fatG * factor;
            return acc;
        }, { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 });

        return {
            totalConsumed: totals.calories,
            totalMacros: {
                proteinG: Math.round(totals.proteinG),
                carbsG: Math.round(totals.carbsG),
                fatG: Math.round(totals.fatG),
            },
        };
    }, [consumedList]);

    // Lógica para el mensaje motivacional 
    const motivationalMessage = useMemo(() => {
        const difference = calorieGoal - totalConsumed;
        const messages = {
            good: ["¡Excelente! Estás logrando tus metas 💪", "Sigue así, NutriBuddy.", "¡Perfecto! Ya casi llegas a la meta."],
            passed: ["Ups… mañana lo harás mejor 😅", "Te has pasado, ¡cuidado con el superávit!", "Hora de beber agua."],
            lacking: ["Te faltan energías, ¡come algo nutritivo! 🍎", "Estás en déficit, puedes comer más.", "No olvides tu cena."],
        };

        if (totalConsumed >= calorieGoal * 1.1) { // 10% de margen
            return messages.passed[Math.floor(Math.random() * messages.passed.length)]; // Si se pasó [cite: 79-80]
        } else if (totalConsumed < calorieGoal * 0.8) {
            return messages.lacking[Math.floor(Math.random() * messages.lacking.length)]; // Si falta [cite: 81-82]
        } else {
            return messages.good[Math.floor(Math.random() * messages.good.length)]; // Si va bien [cite: 77-78]
        }
    }, [totalConsumed, calorieGoal]);

    // Simulación de historial para la gráfica de barras
    const historyData = [
        { day: '2 days ago', calories: calorieGoal * 0.8 },
        { day: 'Yesterday', calories: calorieGoal * 0.9 },
        { day: 'Today', calories: totalConsumed },
    ];

    return {
        totalConsumed,
        consumedList,
        addFood,
        removeFood,
        motivationalMessage,
        foodCatalog: initialFoodList,
        historyData,
        /*totalMacros*/
        macroConsumed: totalMacros,
        macroGoals: macroGoals
    };
};