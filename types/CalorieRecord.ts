// src/types/CalorieRecord.ts
import { ConsumedFood } from "../hooks/useDailyTracker";
import { MacroGoals } from "./User";

export interface DailyRecord {
    date: string; // Formato YYYY-MM-DD
    caloriesConsumed: number;
    /*macrosConsumed: {
        proteinG: number;
        carbsG: number;
        fatG: number;
    };*/

    macrosConsumed: MacroGoals;

    // Opcional: Podrías guardar la lista detallada de alimentos consumidos
     foodsConsumedList: ConsumedFood[]; 
}

// La clave en LocalStorage será prefijada con el nombre del usuario
export type UserHistory = DailyRecord[];