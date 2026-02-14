import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";
import { SITE_CONFIG } from "../siteConfig";

export const getGeminiAssistantResponse = async (history: ChatMessage[], userMessage: string) => {
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
        systemInstruction: `You are the AI Assistant for '${SITE_CONFIG.name}', a premier real estate and construction company based in Dhaka, Bangladesh. We specialize in areas including ${SITE_CONFIG.areas.map(a => a.name).join(", ")}. Be professional, luxurious, and helpful. When asked about prices, provide ranges in BDT (৳) using terms like "Lac" or "Crore". Encourage users to call our helpline at ${SITE_CONFIG.phone} or email ${SITE_CONFIG.email}. Our head office is at ${SITE_CONFIG.address}. Focus on building trust and showcasing architectural excellence. If a specific property isn't mentioned in your data, suggest viewing our 'Projects' page.`,
        temperature: 0.7,
      },
    });

    return response.text || `I apologize, I'm having trouble processing that right now. Please contact our support team at ${SITE_CONFIG.phone}.`;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `I'm sorry, I'm currently experiencing connectivity issues. Please call us at ${SITE_CONFIG.phone} for immediate assistance.`;
  }
};