
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getGeminiAssistantResponse = async (history: ChatMessage[], userMessage: string) => {
  // Always use process.env.API_KEY exclusively for initialization.
  // We initialize the client inside the function to ensure it always uses the most current API key available.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: "You are the AI Assistant for 'The Dream Homes & Constructions Ltd.', a premium real estate and construction company based in Dhaka, Bangladesh. Our headquarters is at ECB Chattor, Dhaka Cantonment. We specialize in Purbachal 300ft, Mirpur DOHS, Trust Green City, and Shagupta. Be professional, helpful, and aware of the Bangladeshi real estate market. When asked about prices, provide ranges in BDT (৳). Encourage users to call us at +8801708364030 for specific plot visits or luxury apartment viewings.",
        temperature: 0.7,
      },
    });

    // Directly access the .text property of GenerateContentResponse.
    return response.text || "I apologize, but I'm having trouble processing that request. Please contact our main office at +8801708364030.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm currently offline. Please try again later or contact us directly at +8801708364030.";
  }
};
