// src/types/CalorieRecord.ts
import { ConsumedFood } from "../hooks/useDailyTracker";

export interface DailyRecord {
    date: string; // Formato YYYY-MM-DD
    caloriesConsumed: number;
    macrosConsumed: {
        proteinG: number;
        carbsG: number;
        fatG: number;
    };
    // Opcional: Podrías guardar la lista detallada de alimentos consumidos
     foods: ConsumedFood[]; 
}

// La clave en LocalStorage será prefijada con el nombre del usuario
export type UserHistory = DailyRecord[];