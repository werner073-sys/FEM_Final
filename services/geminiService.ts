import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure API Key exists
const apiKey = process.env.API_KEY || '';
if (!apiKey) {
  console.warn("Missing API_KEY in environment variables. Gemini features will fail.");
}

const ai = new GoogleGenAI({ apiKey });

// Models
const MODEL_FAST = 'gemini-flash-lite-latest'; // High speed
const MODEL_SMART = 'gemini-3-pro-preview';   // High intelligence
const MODEL_VISION = 'gemini-3-pro-preview';  // Vision capable

export const getDailyInsight = async (
  day: number,
  mode: 'CYCLE' | 'PREGNANCY',
  symptoms: string[]
): Promise<string> => {
  try {
    const prompt = `
      You are 'The Sage', a wise and comforting health companion for women.
      Current Context: User is in ${mode} mode, Day ${day}.
      Reported Symptoms today: ${symptoms.join(', ') || 'None reported yet'}.
      
      Provide a brief, poetic, yet medically grounded "Hormonal Weather Report" (max 2 sentences) and one specific, actionable tip (nutrition or movement).
      Tone: Gentle, bioluminescent, ethereal, supportive.
      Format: Plain text.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    return response.text || " The stars are aligning, but the mists obscure my vision momentarily.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Rest well today. Your body is doing important work.";
  }
};

export const streamChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  currentMessage: string,
  onChunk: (text: string) => void
) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_SMART,
      config: {
        systemInstruction: `You are Lumina's 'Sage', a compassionate, knowledgeable women's health guide. 
        Your persona is like a wise older sister or a gentle midwife. 
        You balance medical accuracy with emotional warmth.
        Never give definitive medical diagnosis; always suggest consulting a doctor for severe issues.
        Use formatting like *italics* for emphasis.
        Keep responses concise unless asked for deep detail.`
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessageStream({ message: currentMessage });

    for await (const chunk of result) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
            onChunk(text);
        }
    }
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    onChunk("I am having trouble connecting to the ether right now. Please try again in a moment.");
  }
};

export const analyzeImage = async (
  base64Image: string,
  promptText: string
): Promise<string> => {
  try {
    // Remove data URL prefix if present for the API call
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: MODEL_VISION,
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg', // Assuming jpeg for simplicity, though could detect
                        data: cleanBase64
                    }
                },
                { text: promptText || "Analyze this image in the context of women's health or nutrition." }
            ]
        }
    });
    return response.text || "I could not analyze this image.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "I encountered an issue seeing this image clearly.";
  }
};
