
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { BreedInfo } from "../types";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY for Gemini is not configured. Breed information feature will be disabled.");
}

export const getBreedInfo = async (breedName: string): Promise<{info: BreedInfo | null, sources: GroundingChunk[] | null, error?: string}> => {
  if (!ai) {
    return { info: null, sources: null, error: "Gemini API key not configured." };
  }

  const model = "gemini-2.5-flash-preview-04-17";
  const prompt = `Proporciona una breve descripción de la raza de gallina "${breedName}". 
  Incluye características clave, temperamento general y nivel de producción de huevos si es conocido. 
  Formatea la respuesta como un objeto JSON con las siguientes claves: "breedName", "description", "characteristics" (array of strings), "temperament", "eggProduction".
  Si la información no está disponible para un campo, omítelo o pon "No disponible".
  Prioriza la información útil para criadores de traspatio.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // responseMimeType: "application/json", // Removed as per guidelines when using googleSearch
        tools: [{googleSearch: {}}] 
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as BreedInfo;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || null;

    return { info: parsedData, sources };

  } catch (error) {
    console.error("Error fetching breed information from Gemini:", error);
    let errorMessage = "No se pudo obtener información sobre la raza.";
    if (error instanceof Error) {
        errorMessage += ` Detalles: ${error.message}`;
    }
    return { info: null, sources: null, error: errorMessage };
  }
};