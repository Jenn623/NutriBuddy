// Define la interfaz de los datos del alimento
export interface FoodItem {
    id: number;
    name: string;
    category: string;
    portionSizeG: number; // Porción estándar en gramos (ej. 100g)
    calories: number;     // Kcal por esa porción
    macros: {
        proteinG: number;
        carbsG: number;
        fatG: number;
    }
}

// Dataset estático de alimentos (Ejemplo)
export const initialFoodList: FoodItem[] = [
    { id: 1, name: "Manzana", category: "Frutas", portionSizeG: 100, calories: 52, macros: { proteinG: 0.3, carbsG: 14, fatG: 0.2 } },
    { id: 2, name: "Pollo (pechuga)", category: "Proteínas", portionSizeG: 100, calories: 165, macros: { proteinG: 31, carbsG: 0, fatG: 3.6 } },
    { id: 3, name: "Arroz Blanco", category: "Granos", portionSizeG: 100, calories: 130, macros: { proteinG: 2.7, carbsG: 28.6, fatG: 0.3 } },
    { id: 4, name: "Refresco Cola", category: "Bebidas", portionSizeG: 350, calories: 140, macros: { proteinG: 0, carbsG: 39, fatG: 0 } },
    { id: 5, name: "Huevo Cocido", category: "Proteínas", portionSizeG: 50, calories: 78, macros: { proteinG: 6.3, carbsG: 0.6, fatG: 5.3 } },
    { id: 6, name: "Pescado (Salmón)", category: "Proteínas", portionSizeG: 100, calories: 208, macros: { proteinG: 20, carbsG: 0, fatG: 13 } },
];