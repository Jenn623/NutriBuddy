// src/hooks/useHybridFoodSearch.ts

import { useState, useMemo, useCallback } from 'react';
import { initialFoodList, type FoodItem } from '../services/foodData';
import { v4 as uuidv4 } from 'uuid'; 

// 🚨 REEMPLAZA ESTO CON TU CLAVE GEMINI API 🚨
const GEMINI_API_KEY = "AIzaSyBsx7P3C6hEbR3sFAc1pZKlDZ-vuc-lVg8"; 

// ⭐️ CORRECCIÓN 1: Usamos el modelo estable para respuesta JSON ⭐️
const MODEL_NAME = "gemini-2.5-flash"; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

const CACHE_KEY = 'nutri_food_cache';

// Interfaz para la respuesta estructurada de la IA
interface AIResponseItem {
    name: string;
    portionSizeG: number;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
}


// Carga la caché de alimentos generados por IA
const loadCache = (): FoodItem[] => {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        return cachedData ? JSON.parse(cachedData) : [];
    } catch (e) {
        console.error("Error al cargar la caché de alimentos:", e);
        return [];
    }
};

export const useFoodSearch = () => {
    const [results, setResults] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cache, setCache] = useState<FoodItem[]>(loadCache); 

    const fullCatalog = useMemo(() => {
        return [...initialFoodList, ...cache];
    }, [cache]); 

    // Función para buscar en el catálogo local (estático + caché)
    const searchLocal = useCallback((query: string): FoodItem[] => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        
        return fullCatalog.filter(item => 
            item.name.toLowerCase().includes(lowerQuery)
        ).slice(0, 10); 
    }, [fullCatalog]);

    // Función para llamar al Gemini API y generar un nuevo alimento
    const searchAI = useCallback(async (query: string): Promise<FoodItem | null> => {
        //const systemPrompt = `Actúa como un experto en nutrición. Tu objetivo es generar la información nutricional (por 100g) de UN alimento específico. Si el alimento '${query}' no es un alimento común, usa el alimento más cercano. Si el alimento es una bebida, especifica el tamaño de la porción. La respuesta debe ser un objeto JSON que siga estrictamente el esquema proporcionado.`;
        
        // ⭐️ CORRECCIÓN CRÍTICA: Estructura del PAYLOAD con 'generationConfig' ⭐️
        const payload = {
            contents: [{ 
                parts: [{ text: `Genera la información nutricional del alimento: ${query}.` }] 
            }],
            
            generationConfig: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING", description: "Nombre común del alimento (ej: Camarones Cocidos)" },
                        portionSizeG: { type: "NUMBER", description: "Tamaño de la porción estándar en gramos (ej: 100)" },
                        calories: { type: "NUMBER", description: "Calorías (kcal) en la porción estándar" },
                        proteinG: { type: "NUMBER", description: "Proteína en gramos en la porción estándar" },
                        carbsG: { type: "NUMBER", description: "Carbohidratos en gramos en la porción estándar" },
                        fatG: { type: "NUMBER", description: "Grasas en gramos en la porción estándar" },
                    },
                    required: ["name", "portionSizeG", "calories", "proteinG", "carbsG", "fatG"],
                    propertyOrdering: ["name", "portionSizeG", "calories", "proteinG", "carbsG", "fatG"]
                }
            }
        };

        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                 // Si la API falla, lanzamos error
                 throw new Error(`API call failed with status: ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!jsonText) throw new Error("Respuesta de IA vacía o incompleta.");
            
            const aiData: AIResponseItem = JSON.parse(jsonText);
            
            const newFood: FoodItem = {
                id: uuidv4(), // Usamos uuidv4 para el ID
                name: aiData.name,
                category: 'Generado por IA',
                portionSizeG: aiData.portionSizeG,
                calories: Math.round(aiData.calories),
                macros: {
                    proteinG: Math.round(aiData.proteinG),
                    carbsG: Math.round(aiData.carbsG),
                    fatG: Math.round(aiData.fatG),
                }
            };

            // Almacenar en caché y actualizar el estado
            setCache(prevCache => {
                const updatedCache = [...prevCache, newFood];
                localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
                return updatedCache;
            });
            
            return newFood;

        } catch (e: any) {
            console.error("Error durante la generación de IA:", e.message);
            setError("No se pudo generar información para ese alimento. Intenta una búsqueda más simple.");
            return null;
        }
    }, [fullCatalog]);

    
    // FUNCIÓN PRINCIPAL DE BÚSQUEDA HÍBRIDA 
    const hybridSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const localResults = searchLocal(query);
        
        if (localResults.length > 0) {
            setResults(localResults);
            setIsLoading(false);
            return;
        }

        // Paso 3: Llamar a la IA
        setResults([]); // Limpiar resultados mientras se espera la IA
        const aiFood = await searchAI(query);
        
        if (aiFood) {
            setResults([aiFood]);
        } 

        setIsLoading(false);
    }, [searchLocal, searchAI]);

    return { results, hybridSearch, isLoading, error };
};