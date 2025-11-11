// src/hooks/useCalorieCalculator.ts

// src/hooks/useCalorieCalculator.ts
import type { User, ActivityLevel } from '../types/User';

/**
 * Define la estructura de los objetivos nutricionales calculados.
 * Esto incluye el Gasto Energético Diario Total (TDEE) en calorías 
 * y las metas en gramos para cada macronutriente.
 */
interface CalorieGoals {
    tdee: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
}

const activityFactors: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    intense: 1.725,
};

/**
 * Custom hook para calcular la Tasa Metabólica Basal (TMB), 
 * el Gasto Energético Diario Total (TDEE) y las metas de macronutrientes.
 */
export const useCalorieCalculator = () => {

    /**
     * Calcula los objetivos calóricos y de macronutrientes basados en los datos del usuario.
     * @param userData Datos físicos del usuario (edad, peso, altura, sexo, nivel de actividad).
     * @returns Un objeto CalorieGoals con TDEE y gramos meta de macronutrientes.
     */
    const calculateGoals = (userData: Omit<User, 'id' | 'calorieGoal' | 'password'>): CalorieGoals => {
        const { age, weightKg, heightCm, gender, activityLevel } = userData;
        let bmr: number;

        if (gender === 'male') {
            // Hombres: (10 * peso en kg) + (6.25 * altura en cm) - (5 * edad en años) + 5
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
        } else {
            // Mujeres: (10 * peso en kg) + (6.25 * altura en cm) - (5 * edad en años) - 161
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
        }
        
        // Si BMR es negativo o cero (caso muy improbable para un adulto), evitamos errores.
        bmr = Math.max(1, bmr); 

        const activityMultiplier = activityFactors[activityLevel];
        const tdee = Math.round(bmr * activityMultiplier);

        // 3. CÁLCULO DE METAS DE MACRONUTRIENTES (Simplificado: 50% Carbs / 25% Proteínas / 25% Grasas)
        
        // Asignación de calorías por macronutriente
        const proteinCal = tdee * 0.25; // 25% de calorías para proteína
        const carbsCal = tdee * 0.50;  // 50% de calorías para carbohidratos
        const fatCal = tdee * 0.25;    // 25% de calorías para grasa

        // Conversión de Calorías a Gramos: (4-4-9 regla)
        // Proteína: 4 kcal/g | Carbohidratos: 4 kcal/g | Grasa: 9 kcal/g
        const proteinG = Math.round(proteinCal / 4);
        const carbsG = Math.round(carbsCal / 4);
        const fatG = Math.round(fatCal / 9);

        return {
            tdee: tdee,
            proteinG: proteinG,
            carbsG: carbsG,
            fatG: fatG,
        };
    };

    return { calculateGoals };
};
