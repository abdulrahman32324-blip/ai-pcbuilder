import { GoogleGenAI, Type } from "@google/genai";
import type { PCBuild, BuildRequest } from '../types';
import { translations } from "../utils/i18n";

// Prefer build-time injected keys from Vite (process.env.* is replaced at build time)
// Fall back to either API_KEY or GEMINI_API_KEY if provided
const API_KEY = (process.env.API_KEY as string) || (process.env.GEMINI_API_KEY as string);

let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!API_KEY) {
    throw new Error(`${translations.en.error.apiError}: Missing API key. Set API_KEY in environment.`);
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiInstance;
};

const buildSchema = {
    type: Type.OBJECT,
    properties: {
        buildName: {
            type: Type.STRING,
            description: "A creative and marketable name for the PC build, like 'The Budget Beast' or '4K Dominator'."
        },
        totalPrice: {
            type: Type.NUMBER,
            description: "The total estimated price of all components combined."
        },
        currency: {
            type: Type.STRING,
            description: "The currency for the total price (e.g., USD, SAR)."
        },
        estimatedWattage: {
            type: Type.NUMBER,
            description: "The total estimated power consumption of the build in watts. This helps in choosing a suitable PSU."
        },
        targetResolution: {
            type: Type.STRING,
            description: "The target gaming resolution this build is optimized for, e.g., '1080p', '1440p', or '4K'."
        },
        averageFps: {
            type: Type.NUMBER,
            description: "The estimated average frames per second for this build across modern AAA titles at its target resolution."
        },
        components: {
            type: Type.ARRAY,
            description: "An array of all PC components for the build.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        description: "The type of the component. Must be one of: 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case'."
                    },
                    name: {
                        type: Type.STRING,
                        description: "The specific model name of the component, e.g., 'AMD Ryzen 5 5600X' or 'NVIDIA GeForce RTX 4070'."
                    },
                     price: {
                        type: Type.NUMBER,
                        description: "The estimated price of this individual component in the specified currency."
                    },
                    priceLink: {
                        type: Type.STRING,
                        description: "A functional Amazon search URL for the component. It MUST be in the format `https://www.amazon.com/s?k={encoded_component_name}&tag=deazlly-20` where {encoded_component_name} is the URL-encoded component name."
                    },
                    specs: {
                        type: Type.STRING,
                        description: "Key specifications for the component, e.g., '16GB (2x8GB) DDR5 6000MHz CL30' for RAM, or '12GB GDDR6X' for GPU."
                    },
                    powerDraw: {
                        type: Type.NUMBER,
                        description: "Estimated power draw in watts for this component, especially for CPU and GPU. Should be 0 for components that don't draw significant power."
                    }
                },
                required: ["type", "name", "price", "priceLink", "specs"]
            }
        },
        performance: {
            type: Type.STRING,
            description: "A concise, one-sentence summary of the build's overall capability and target use case."
        },
        gamePerformance: {
            type: Type.ARRAY,
            description: "An array of estimated performance metrics in popular games.",
            items: {
                type: Type.OBJECT,
                properties: {
                    gameName: { type: Type.STRING, description: "The name of the game, e.g., 'Fortnite' or 'Warzone'." },
                    fps: { type: Type.STRING, description: "The estimated frames per second, e.g., '120-140 FPS'." },
                    settings: { type: Type.STRING, description: "The game settings used for the estimate, e.g., '1080p High'." },
                },
                required: ["gameName", "fps", "settings"]
            }
        }
    },
    required: ["buildName", "totalPrice", "currency", "components", "performance", "gamePerformance", "estimatedWattage", "targetResolution", "averageFps"]
};

export const generateBuilds = async (request: BuildRequest): Promise<PCBuild[]> => {
    
    const { budget, currency, count, purpose, performanceTier, notes } = request;
    
    let prompt = translations.en.prompt.base
        .replace('{count}', count.toString())
        .replace('{budget}', budget.toString())
        .replace('{currency}', currency)
        .replace('{purpose}', purpose)
        .replace('{performanceTier}', performanceTier);
    
    if (notes) {
        prompt += translations.en.prompt.notes.replace('{notes}', notes);
    }

    try {
        const resolveModelName = (rawModel?: string): string => {
            const DEFAULT_MODEL = "gemini-2.5-flash";
            if (!rawModel) return DEFAULT_MODEL;
            const trimmed = rawModel.trim();
            if (/-(flash|pro)(:latest)?$/i.test(trimmed)) return trimmed;
            if (/^gemini-2\.5$/i.test(trimmed)) return "gemini-2.5-flash";
            if (/^gemini-2\.0$/i.test(trimmed)) return "gemini-2.0-flash";
            return DEFAULT_MODEL;
        };

        const response = await getAI().models.generateContent({
            model: resolveModelName(process.env.GEMINI_MODEL as string),
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        builds: {
                            type: Type.ARRAY,
                            items: buildSchema
                        }
                    },
                    required: ["builds"]
                },
                temperature: 0.7,
                thinkingConfig: { thinkingBudget: 0 }
            },
        });
        
        const responseText = response.text;
        if (!responseText) {
            throw new Error(translations.en.error.noResponse);
        }

        const parsedJson = JSON.parse(responseText);
        
        if (!parsedJson.builds || !Array.isArray(parsedJson.builds)) {
            throw new Error(translations.en.error.invalidFormat);
        }

        return parsedJson.builds as PCBuild[];

    } catch (error) {
        console.error("Error generating builds:", error);
        if (error instanceof Error) {
            if(error.message.includes('SAFETY')) {
                throw new Error(translations.en.error.safety);
            }
             throw new Error(`${translations.en.error.apiError}: ${error.message}`);
        }
        throw new Error(translations.en.error.unknown);
    }
};