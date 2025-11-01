// aqui se va a definir el tipado de los datos a manejar en el registro

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense';

// tipo de datos necesitados en el registro
export interface User {
    // para identificar al usuario
    id: string;
    name: string;
    password: string;

    // datos necesarios para el calculo
    age: number;
    weightKg: number;
    heightCm: number;
    gender: Gender;
    activityLevel: ActivityLevel;

    // meta calorica (calculada con el TDEE)
    calorieGoal: number;
}