
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiModel, FounderArchetype, SynapseGeneration, PitchAnalysis } from '../types';

// Helper to always get a fresh instance with the latest key
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Ideation & Research ---

export const generateIdeaValidation = async (idea: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.PRO,
      contents: `You are a startup validator. Analyze this startup idea rigorously: "${idea}". 
      Provide a structure response with: 
      1. Core Value Proposition
      2. Potential Pitfalls
      3. Target Audience
      4. Go-To-Market Strategy Suggestion.
      Format in Markdown.`,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to validate idea. Please try again.";
  }
};

export const generateFounderArchetype = async (input: string): Promise<FounderArchetype | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH, // Flash is faster for JSON tasks
      contents: `Analyze this abstract idea or vision: "${input}". 
      Determine the "Founder Archetype" (a creative persona like 'The Digital Weaver' or 'The System Architect').
      Provide a description of this persona, a visual art prompt to represent it, recommended business models, and core values.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Creative title of the founder archetype" },
            description: { type: Type.STRING, description: "Inspiring description of what this founder builds" },
            visualPrompt: { type: Type.STRING, description: "A highly detailed, artistic, cinematic image prompt to visualize this concept. Abstract, 8k, unreal engine style." },
            suggestedBusinessModels: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3 concrete business models (e.g. SaaS, Marketplace)" 
            },
            coreValues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 core values"
            }
          }
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text) as FounderArchetype;
    }
    return null;
  } catch (error) {
    console.error("Archetype Gen Error:", error);
    return null;
  }
};

// --- Synapse: Cross-Module Automation ---
export const generateStartupEcosystem = async (idea: string, archetype: string): Promise<SynapseGeneration | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Based on the startup idea: "${idea}" and the founder archetype: "${archetype}", generate a starter ecosystem for their operating system.
      1. Create 3 initial Product Features for the roadmap.
      2. Create 2 Marketing Campaign ideas.
      3. Create 3 fictional Investor profiles that would be a perfect match.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productFeatures: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                    }
                }
            },
            marketingHooks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        channel: { type: Type.STRING, enum: ['Social', 'Email', 'Ads', 'Content'] }
                    }
                }
            },
            investorMatches: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        firm: { type: Type.STRING },
                        notes: { type: Type.STRING }
                    }
                }
            }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as SynapseGeneration;
    }
    return null;
  } catch (error) {
    console.error("Synapse Error:", error);
    return null;
  }
};

export const performMarketResearch = async (query: string): Promise<{ text: string; links: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Conduct market research on: ${query}. Focus on competitors, market size, and trends.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      text: response.text || "No research data found.",
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Research Error:", error);
    return { text: "Error performing research.", links: [] };
  }
};

// --- Marketing ---

export const generateMarketingCopy = async (topic: string, format: 'Social' | 'Blog' | 'Ad'): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Write ${format} copy about "${topic}". Tone: Professional, engaging, and high-conversion.`,
    });
    return response.text || "No copy generated.";
  } catch (error) {
    return "Error generating copy.";
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.IMAGE_GEN,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K" // High quality
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const generateMarketingVideo = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    // 1. Start Operation
    let operation = await ai.models.generateVideos({
      model: GeminiModel.VEO,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // 2. Poll for completion
    // Note: In production, we might want to handle this polling in the UI with a progress bar,
    // but for simplicity we await here (can take 30s+).
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        // Fetch the actual bytes using the API key
        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);
    }
    return null;

  } catch (error) {
    console.error("Video Gen Error:", error);
    throw error;
  }
};

// --- Sales ---

export const generateSalesEmail = async (leadContext: string, objection?: string): Promise<string> => {
    const ai = getAI();
    try {
        const prompt = objection 
            ? `Draft a response to a sales lead who said: "${objection}". Context: ${leadContext}. Handle the objection politely but persuasively.`
            : `Draft a cold outreach email to a potential client. Context: ${leadContext}. Keep it short, personalized, and value-driven.`;

        const response = await ai.models.generateContent({
            model: GeminiModel.FLASH,
            contents: prompt
        });
        return response.text || "Could not draft email.";
    } catch (error) {
        return "Error drafting email.";
    }
};

// --- Investor Pitch ---

export const generateInvestorPitch = async (details: { companyName: string; problem: string; solution: string; traction: string; ask: string }): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.PRO,
      contents: `You are a top-tier VC pitch deck consultant. Create a 10-slide pitch deck structure for this startup:
      
      Company: ${details.companyName}
      Problem: ${details.problem}
      Solution: ${details.solution}
      Traction: ${details.traction}
      Funding Ask: ${details.ask}

      For each slide, provide:
      1. Slide Title
      2. Key Bullet Points (Content)
      3. Speaker Notes (Script)
      
      Format the output in clean Markdown.`,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return response.text || "Unable to generate pitch.";
  } catch (error) {
    console.error("Gemini Pitch Error:", error);
    return "Error generating pitch deck. Please try again.";
  }
};

export const analyzePitchDeckImage = async (base64Image: string): Promise<PitchAnalysis | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.PRO,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: "You are a ruthless VC analyst. Grade this pitch deck slide. Give it a score out of 100. Provide a brutal but helpful critique and 3 specific bullet points on how to improve it." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                critique: { type: Type.STRING },
                improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
      }
    });
    if (response.text) {
        return JSON.parse(response.text) as PitchAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Slide Analysis Error:", error);
    return null;
  }
};
