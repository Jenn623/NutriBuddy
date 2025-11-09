// src/hooks/useFoodSearch.ts
import { useState } from 'react';
import type { FoodItem } from '../services/foodData'; // Reutilizamos la interfaz FoodItem
 // Reutilizamos la interfaz FoodItem

// 🚨 REEMPLAZA ESTO CON TU CLAVE REAL DEL USDA 🚨
const USDA_API_KEY = ""; //3Xo043hve7ew4y46WKdEVkzPgv8m7iqKNenZL11X
const USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

// Función para mapear los datos detallados del USDA al formato FoodItem de tu app
const mapUsdaFoodToFoodItem = (usdaFood: any): FoodItem | null => {
    // 1. Encontrar la información nutricional por 100g (USDA usa 100g como base)
    const nutrients = usdaFood.foodNutrients || [];

    // Función helper para obtener el valor de un nutriente específico
    const getNutrientValue = (name: string): number => {
        const nutrient = nutrients.find((n: any) => n.nutrientName.includes(name) || n.nutrientName.includes(name.toUpperCase()));
        // Retorna el valor en gramos (gramValue) o kilocalorías (value), si está disponible
        return nutrient ? nutrient.value : 0;
    };
    
    // El USDA devuelve valores por 100g. Usaremos 100g como porción estándar.
    const standardPortionG = 100;

    // Mapeo de Macronutrientes y Calorías
    const proteinG = getNutrientValue('Protein');
    const fatG = getNutrientValue('Total lipid (fat)');
    const carbsG = getNutrientValue('Carbohydrate');
    const calories = getNutrientValue('Energy'); // Energy es el valor en kcal

    if (calories === 0 || proteinG === 0) {
        // Filtramos resultados sin datos nutricionales clave
        return null; 
    }

    return {
        id: usdaFood.fdcId, // ID único del USDA
        name: usdaFood.description,
        category: usdaFood.foodCategory,
        portionSizeG: standardPortionG, 
        calories: Math.round(calories),
        macros: {
            proteinG: Math.round(proteinG),
            carbsG: Math.round(carbsG),
            fatG: Math.round(fatG),
        }
    } as FoodItem;
};


export const useFoodSearch = () => {
    const [results, setResults] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchFood = async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${USDA_SEARCH_URL}?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&dataType=Branded,Survey&pageSize=15`
            );

            if (!response.ok) {
                throw new Error(`Error en la búsqueda: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Mapear los resultados y filtrar cualquier resultado incompleto (null)
            const mappedResults = (data.foods || [])
                .map(mapUsdaFoodToFoodItem)
                .filter((item: FoodItem | null): item is FoodItem => item !== null);
            
            setResults(mappedResults);

        } catch (err: any) {
            console.error("Error buscando alimentos:", err);
            setError("Error al conectar con la base de datos de alimentos.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return { results, searchFood, isLoading, error };
};