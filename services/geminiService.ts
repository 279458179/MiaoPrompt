import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptResponse } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const promptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    englishPrompt: {
      type: Type.STRING,
      description: "The highly detailed, optimized English prompt for text-to-image AI. Includes subject, medium, style, lighting, color palette, and quality boosters (e.g., 'masterpiece, best quality, 8k').",
    },
    chineseTranslation: {
      type: Type.STRING,
      description: "A beautiful and poetic Chinese translation of the generated prompt concept.",
    },
    negativePrompt: {
      type: Type.STRING,
      description: "A standard negative prompt to avoid bad quality (e.g., 'low quality, ugly, deformed').",
    },
    reasoning: {
      type: Type.STRING,
      description: "Brief explanation of why these keywords were chosen to match the user's intent.",
    },
    suggestedAspectRatio: {
        type: Type.STRING,
        description: "Suggested aspect ratio (e.g., '1:1', '16:9') based on the subject matter.",
    }
  },
  required: ["englishPrompt", "chineseTranslation", "negativePrompt", "reasoning", "suggestedAspectRatio"],
};

export const generateAiPrompt = async (
  userInput: string,
  styleId: string,
  aspectRatio: string
): Promise<PromptResponse> => {
  const model = "gemini-3-flash-preview";

  let styleInstruction = "";
  switch (styleId) {
    case 'anime': styleInstruction = "Style focus: Anime style, makoto shinkai style, vibrant colors, cel shading, highly detailed."; break;
    case 'photorealistic': styleInstruction = "Style focus: Photorealistic, raw photo, dslr, 8k uhd, raytracing, highly detailed texture, realistic lighting."; break;
    case '3d': styleInstruction = "Style focus: 3D render, blender, octane render, c4d, blind box style, cute, plastic texture, clay material."; break;
    case 'cyberpunk': styleInstruction = "Style focus: Cyberpunk, neon lights, futuristic city, synthwave, high contrast, sci-fi."; break;
    case 'oil': styleInstruction = "Style focus: Oil painting, impasto, brush strokes, textured canvas, classical art."; break;
    case 'ghibli': styleInstruction = "Style focus: Studio Ghibli style, hayao miyazaki, hand drawn, soothing colors, picturesque."; break;
    case 'chinese_ink': styleInstruction = "Style focus: Chinese ink painting, watercolor, traditional art, wash painting, minimal, zen."; break;
    default: styleInstruction = "Style focus: High quality, artistic composition."; break;
  }

  const systemInstruction = `
    You are an expert AI Art Prompt Engineer (specializing in Midjourney, Stable Diffusion, and Flux).
    Your goal is to take a user's input (usually in Chinese) and convert it into a TOP-TIER English prompt.
    
    Guidelines:
    1.  **Analyze**: Understand the core subject, action, and mood of the user's input.
    2.  **Enhance**: Add necessary details for lighting, composition, and texture that the user might have missed.
    3.  **Format**: Produce a comma-separated list of keywords and phrases.
    4.  **Style**: Strictly adhere to the requested style: ${styleInstruction}.
    5.  **Output**: Return the result in valid JSON format matching the schema.
    6.  **Language**: The input is Chinese. The 'englishPrompt' MUST be English. The 'chineseTranslation' MUST be Chinese.
  `;

  const userContent = `User Idea: ${userInput}\nDesired Aspect Ratio: ${aspectRatio}`;

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: model,
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: promptSchema,
        temperature: 0.7, // Creativity balance
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(jsonText) as PromptResponse;
    return result;

  } catch (error) {
    console.error("Error generating prompt:", error);
    throw new Error("生成失败，请稍后重试。");
  }
};