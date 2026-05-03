import { GoogleGenAI } from "@google/genai";

export async function getStylistRecommendation(preferences: any, brands: any) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required");
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are an expert Cairo fashion stylist. Given the buyer's preferences and the list of available brands, recommend the 3 best matching brands.
      
      Buyer preferences: ${JSON.stringify(preferences)}
      Available brands: ${JSON.stringify(brands)}

      Return a JSON object with:
      {
        "matchedBrands": [{"name": string, "tier": string, "why": string, "pieces": string[], "priceRange": string}],
        "outfitBreakdown": {"top": string, "bottom": string, "shoes": string, "accessories": string, "totalBudget": string},
        "stylistNoteEn": "English stylist note",
        "stylistNoteAr": "Arabic stylist note"
      }
      ONLY return the JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}

export async function getChatResponse(messages: { role: 'user' | 'model', content: string }[], mode: 'b2c' | 'b2b') {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required");
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = mode === 'b2c' 
      ? "You are an expert Cairo fashion stylist assistant. Provide fashion advice, outfit ideas, and brand guidance for Cairo shoppers."
      : "You are a Cairo fashion business intelligence assistant. Provide data-driven insights, market analysis, and brand growth advice for Egyptian brand owners.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model', 
        parts: [{ text: m.content }] 
      })),
      config: {
        systemInstruction
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw error;
  }
}
