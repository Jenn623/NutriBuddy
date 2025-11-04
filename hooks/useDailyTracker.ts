// src/hooks/useDailyTracker.ts
import { useState, useMemo, useEffect } from 'react';
import { FoodItem, initialFoodList } from '../services/foodData';
import { useCalorieCalculator } from './useCalorieCalculator';
import { User }  from '../types/User';
import { DailyRecord, UserHistory } from '../types/CalorieRecord';

// Interfaz para un registro de alimento consumido
export interface ConsumedFood {
    food: FoodItem;
    quantityG: number;
    totalCalories: number;
}

const HISTORY_KEY_PREFIX = 'nutri_history_';
const DAILY_CONSUMED_KEY_PREFIX = 'nutri_daily_consumed_'; // Nueva clave para el estado temporal

// Helper para obtener la fecha de hoy
//const getTodayDate = () => new Date().toISOString().split('T')[0];

// Helper para obtener la fecha de hoy (Ajustada a la zona horaria local)
const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useDailyTracker = (user: User) => {
    // Lista de alimentos consumidos hoy (simulados)
    const { calorieGoal } = user;
    const [consumedList, setConsumedList] = useState<ConsumedFood[]>([]);

    //const [consumedList, setConsumedList] = useState<ConsumedFood[]>(initializeConsumedList);

    const dailyKey = DAILY_CONSUMED_KEY_PREFIX + user.name;
    const historyKey = HISTORY_KEY_PREFIX + user.name;

    // ⭐️ NUEVO ESTADO: Historial de los últimos 5 días
    const [history, setHistory] = useState<UserHistory>([]);
    
    // ⭐️ NUEVO: Inicializar el hook de cálculo para obtener las METAS de MACROS
    const { calculateGoals } = useCalorieCalculator();
    
    // ⭐️ CALCULAR LAS METAS DE MACROS UNA VEZ
    const macroGoals = useMemo(() => {
        // user debe ser pasado sin las propiedades 'id', 'calorieGoal', 'password'
        const goals = calculateGoals(user); 
        return goals;
    }, [user, calculateGoals]);

    // ⭐️ EFECTO: Carga el historial del usuario al iniciar
    /*useEffect(() => {
        const key = HISTORY_KEY_PREFIX + user.name;
        const storedHistory = localStorage.getItem(key);
        if (storedHistory) {
            // Asegura que solo se mantengan los últimos 5 días (o menos si hay menos)
            const parsedHistory: UserHistory = JSON.parse(storedHistory);
            setHistory(parsedHistory.slice(-5));
        }
    }, [user.name]);*/

        // ⭐️ EFECTO 1: Carga y Persistencia del Consumo Diario (y Reset)
    // ⭐️ EFECTO 1: Carga y Persistencia del Consumo Diario (y Reset)
    useEffect(() => {
        const storedDailyData = localStorage.getItem(dailyKey);
        const storedHistoryData = localStorage.getItem(historyKey);
        
        // 1. Cargar Historial (5 días)
        if (storedHistoryData) {
            const parsedHistory: UserHistory = JSON.parse(storedHistoryData);
            setHistory(parsedHistory.slice(-5));
        }

        if (storedDailyData) {
            const { date, list } = JSON.parse(storedDailyData);
            
            // 2. Comprobar si es un NUEVO DÍA
            if (date === getTodayDate()) {
                // Mismo día: Cargar datos guardados
                setConsumedList(list);
            } else {
                // Nuevo día: Borrar el estado diario. El estado queda como [] (vacío).
                localStorage.removeItem(dailyKey);
            }
        }
        
        // Función de limpieza: Guarda el estado de consumedList ANTES de que el componente se desmonte
        const handleBeforeUnload = () => {
            localStorage.setItem(dailyKey, JSON.stringify({
                date: getTodayDate(),
                list: consumedList,
            }));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Guardar el estado al desmontar el componente (por ejemplo, al hacer logout)
        return () => {
            handleBeforeUnload();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user.name, dailyKey, historyKey]);

    // ⭐️ EFECTO 2: Persistencia cuando cambia la lista (para logout/navegación dentro de la app)
    useEffect(() => {
        // Guarda el estado actual de consumedList en cada cambio (necesario para la navegación interna)
        localStorage.setItem(dailyKey, JSON.stringify({
            date: getTodayDate(),
            list: consumedList,
        }));
    }, [consumedList, dailyKey]);


    // ⭐️ FUNCIÓN: Guardar el registro del día y actualizar el historial
    /*const saveDailyRecord = (): boolean => {
        const today = new Date().toISOString().split('T')[0];
        
        // Evitar guardar si ya existe un registro para hoy (simulación)
        if (history.some(record => record.date === today)) {
             console.warn("Ya existe un registro para hoy.");
             return false;
        }

        const newRecord: DailyRecord = {
            date: today,
            caloriesConsumed: totalConsumed,
            macrosConsumed: totalMacros,
        };
        
        // 1. Añadir el nuevo registro y limitar a 5 elementos
        const updatedHistory = [...history, newRecord].slice(-5);
        
        // 2. Guardar en LocalStorage
        const key = HISTORY_KEY_PREFIX + user.name;
        localStorage.setItem(key, JSON.stringify(updatedHistory));
        
        // 3. Actualizar el estado local
        setHistory(updatedHistory);

        // 4. (Opcional): Resetear el consumedList después de guardar
        // setConsumedList([]); 
        
        return true;
    };*/


    // ⭐️ MODIFICACIÓN: historyData ahora usa el historial real
    const historyData = useMemo(() => {
        // Mapear los últimos 5 registros guardados para la visualización de la gráfica
        if (history.length === 0) {
            return [];
        }
        
        return history.map(record => ({
            day: record.date.substring(5), // Solo mes y día
            calories: record.caloriesConsumed,
            // Añadir un identificador para la gráfica si es necesario
        }));
    }, [history]);


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

    // ⭐️ FUNCIÓN: Guardar el registro del día y actualizar el historial (SOBRESCRIBIR/ACTUALIZAR)
    const saveDailyRecord = (): boolean => {
        const today = getTodayDate();
        
        // 1. Crear el nuevo registro del día actual
        const newRecord: DailyRecord = {
            date: today,
            caloriesConsumed: totalConsumed,
            macrosConsumed: totalMacros,
            foodsConsumedList: consumedList,
        };
        
        // 2. Actualizar/Sobreescribir el registro en el historial (si la fecha coincide)
        /*let updatedHistory: UserHistory;
        
        const existingIndex = history.findIndex(record => record.date === today);

        if (existingIndex !== -1) {
            // Caso A: Existe un registro para hoy -> SOBREESCRIBIR
            updatedHistory = history.map((record, index) => 
                index === existingIndex ? newRecord : record
            );
        } else {
            // Caso B: Es un nuevo registro para hoy -> AÑADIR y limitar a 5
            updatedHistory = [...history, newRecord].slice(-5);
        }
        
        // 3. Guardar en LocalStorage y actualizar el estado
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
        setHistory(updatedHistory);*/

        let updatedHistory: UserHistory;
        const existingIndex = history.findIndex(record => record.date === today);

        if (existingIndex !== -1) {
             // Caso A: Existe un registro para hoy -> SOBREESCRIBIR
             updatedHistory = history.map((record, index) => 
                 index === existingIndex ? newRecord : record
             );
        } else {
             // Caso B: Es un nuevo registro para hoy -> AÑADIR y limitar a 5
             updatedHistory = [...history, newRecord].slice(-5);
        }

        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
        
        // 4. No resetear el consumedList (se permite seguir agregando hoy)
        
        return true;
    };
    

    // Lógica para el mensaje motivacional 
    const motivationalMessage = useMemo(() => {
        const difference = calorieGoal - totalConsumed;

        // Convertimos a valor absoluto si es exceso
        const excessAmount = Math.abs(difference);

        const messages = {
            good: ["¡Excelente! Estás logrando tus metas 💪", "Sigue así, NutriBuddy.", "¡Perfecto! Ya casi llegas a la meta."],
            passed: [
            `¡Cuidado! Superaste tu límite por ${excessAmount} kcal. Intenta compensar mañana.`, 
            `Te has pasado ${excessAmount} kcal. Recuerda que la consistencia es la clave.`,
            `Alerta: Estás en Superávit calórico. ¡Mañana lo harás mejor!`,
        ],
            lacking: ["Te faltan energías, ¡come algo nutritivo! 🍎", "Estás en déficit, puedes comer más.", "No olvides tu cena."],
        };

        if (totalConsumed >= calorieGoal * 1.05) { // 10% de margen
            return messages.passed[Math.floor(Math.random() * messages.passed.length)]; // Si se pasó [cite: 79-80]
        } else if (totalConsumed < calorieGoal * 0.8) {
            return messages.lacking[Math.floor(Math.random() * messages.lacking.length)]; // Si falta [cite: 81-82]
        } else {
            return messages.good[Math.floor(Math.random() * messages.good.length)]; // Si va bien [cite: 77-78]
        }
    }, [totalConsumed, calorieGoal]);

    // Simulación de historial para la gráfica de barras
    /*const historyData = [
        { day: '2 days ago', calories: calorieGoal * 0.8 },
        { day: 'Yesterday', calories: calorieGoal * 0.9 },
        { day: 'Today', calories: totalConsumed },
    ];*/

    return {
        totalConsumed,
        consumedList,
        addFood,
        removeFood,
        motivationalMessage,
        calorieDifference: calorieGoal - totalConsumed,
        foodCatalog: initialFoodList,
        saveDailyRecord,
        history,
        historyData,
        /*totalMacros*/
        macroConsumed: totalMacros,
        macroGoals: macroGoals
    };
};