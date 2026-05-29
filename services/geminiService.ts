import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// 1. Guard Intent Parser
// Converts raw speech text (e.g., "Water tanker 10000 liters from Vendor A") into structured JSON
export const parseGuardIntent = async (transcript: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      You are an AI assistant for a security guard app called SocietySync. 
      Your job is to extract structured data from spoken commands.
      There are two main types of logs:
      1. VISITOR: e.g., "Courier for B-302", "Guest for A-101"
      2. TANKER: e.g., "Water tanker 10000 liters Vendor A"

      Return JSON with 'type', 'details' (containing flat, category, vendor, amount).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: transcript,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["VISITOR", "TANKER", "UNKNOWN"] },
            details: {
              type: Type.OBJECT,
              properties: {
                flat: { type: Type.STRING },
                category: { type: Type.STRING },
                vendor: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                unit: { type: Type.STRING },
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};

// 2. Neighborhood Guide
// Uses Google Search Grounding to find places and summarize them
export const getNeighborhoodRecommendations = async (query: string) => {
  try {
    const model = 'gemini-2.5-flash';
    
    // We want to find places and get a succinct summary
    const prompt = `
      Find 3 top rated places for: "${query}" nearby. 
      For each place, provide a 3-line summary focusing on why it's good for families or value for money.
      Return a JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    summary: { type: Type.STRING },
                    address: { type: Type.STRING },
                    type: { type: Type.STRING }
                }
            }
        }
      }
    });

    return JSON.parse(response.text || "[]");

  } catch (error) {
    console.error("Gemini Guide Error:", error);
    // Fallback mock data if API fails or key is missing
    return [
      {
        name: "Spice Garden (Mock)",
        rating: 4.5,
        summary: "Best for North Indian family dining. Affordable pricing, but parking is difficult on weekends.",
        address: "123 Main St",
        type: "Restaurant"
      }
    ];
  }
};