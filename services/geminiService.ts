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
      description: "The highly detailed, optimized English prompt. MUST start with '[用户图1]'. The text following it should describe actions, clothing, or environment of the subject in the image.",
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
    You are an expert AI Art Prompt Engineer (specializing in image-to-image workflows).
    
    CRITICAL INSTRUCTION:
    The user is providing a reference image denoted by the tag "[用户图1]". 
    **[用户图1] IS THE SUBJECT.**
    
    Your goal is to generate a prompt that describes **what this subject is doing**, **wearing**, or **where they are**.
    
    Guidelines:
    1.  **Prefix Requirement**: The 'englishPrompt' MUST start with the exact text "[用户图1]".
    2.  **Grammar Flow**: Do NOT repeat a generic subject like "a person" or "a cat" immediately after the tag unless necessary for clarity. Instead, connect directly to attributes or actions.
        *   *Bad*: "[用户图1] a warrior holding a sword..."
        *   *Good*: "[用户图1] wearing silver armor, holding a glowing sword, standing in a stormy battlefield..."
        *   *Good*: "[用户图1] eating a delicious burger, happy expression, fast food restaurant background..."
    3.  **Analyze**: Extract the action, outfit, scene, and mood from the user's input.
    4.  **Enhance**: Add necessary details for lighting, composition, and texture.
    5.  **Style**: Strictly adhere to the requested style: ${styleInstruction}.
    6.  **Output**: Return the result in valid JSON format matching the schema.
    7.  **Language**: The input is Chinese. The prompt content (after the prefix) MUST be English.
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
    
    // Safety enforcement of the prefix
    if (!result.englishPrompt.startsWith('[用户图1]')) {
       // Prepend if missing.
       result.englishPrompt = `[用户图1] ${result.englishPrompt}`;
    }

    return result;

  } catch (error) {
    console.error("Error generating prompt:", error);
    throw new Error("生成失败，请稍后重试。");
  }
};