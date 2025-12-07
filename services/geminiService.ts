import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Fallback for dev, but env is expected
const ai = new GoogleGenAI({ apiKey });

export const translateWords = async (words: string[]): Promise<Record<string, string>> => {
  if (!words.length) return {};

  try {
    const prompt = `Translate the following English words to Chinese.
    Words: ${words.join(', ')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING, description: "The original English word" },
                    translation: { type: Type.STRING, description: "The Chinese translation" }
                },
                required: ["word", "translation"]
            }
        }
      }
    });

    const text = response.text;
    if (!text) return {};
    
    // Parse the array response
    const list = JSON.parse(text) as { word: string; translation: string }[];
    
    // Convert back to Record<string, string> for app consumption
    const resultMap: Record<string, string> = {};
    if (Array.isArray(list)) {
      list.forEach(item => {
        if (item.word && item.translation) {
          resultMap[item.word] = item.translation;
        }
      });
    }
    
    return resultMap;
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    // Fallback: return keys as values so app doesn't crash, user can edit later
    const fallback: Record<string, string> = {};
    words.forEach(w => fallback[w] = "翻译失败");
    return fallback;
  }
};