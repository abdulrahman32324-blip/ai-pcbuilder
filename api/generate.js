import { GoogleGenAI, Type } from "@google/genai";

const buildSchema = {
  type: Type.OBJECT,
  properties: {
    buildName: { type: Type.STRING },
    totalPrice: { type: Type.NUMBER },
    currency: { type: Type.STRING },
    estimatedWattage: { type: Type.NUMBER },
    targetResolution: { type: Type.STRING },
    averageFps: { type: Type.NUMBER },
    components: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          priceLink: { type: Type.STRING },
          specs: { type: Type.STRING },
          powerDraw: { type: Type.NUMBER }
        },
        required: ["type", "name", "price", "priceLink", "specs"]
      }
    },
    performance: { type: Type.STRING },
    gamePerformance: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          gameName: { type: Type.STRING },
          fps: { type: Type.STRING },
          settings: { type: Type.STRING },
        },
        required: ["gameName", "fps", "settings"]
      }
    }
  },
  required: [
    "buildName",
    "totalPrice",
    "currency",
    "components",
    "performance",
    "gamePerformance",
    "estimatedWattage",
    "targetResolution",
    "averageFps"
  ]
};

const resolveModelName = (rawModel) => {
  const DEFAULT_MODEL = "gemini-2.5-flash";
  if (!rawModel) return DEFAULT_MODEL;
  const trimmed = String(rawModel).trim();
  if (/(?:-flash|-pro)(?::latest)?$/i.test(trimmed)) return trimmed;
  if (/^gemini-2\.5$/i.test(trimmed)) return "gemini-2.5-flash";
  if (/^gemini-2\.0$/i.test(trimmed)) return "gemini-2.0-flash";
  return DEFAULT_MODEL;
};

const allowCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  // Use environment variable first, then fallback to hardcoded key (only for demo purposes)
  const apiKey = process.env.API_KEY || 
                process.env.GEMINI_API_KEY || 
                "AIzaSyBG-Zo_5DhTihJ9ErMXHaS_VMZdCxjIInc";
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key. Set API_KEY or GEMINI_API_KEY in project settings." });
  }

  const { request } = req.body || {};
  if (!request) {
    return res.status(400).json({ error: "Missing request payload." });
  }

  const { budget, currency, count, purpose, performanceTier, notes } = request;

  try {
    const ai = new GoogleGenAI({ apiKey });

    let prompt = `You are an expert PC builder. Generate ${count} complete PC builds for a budget of ${budget} ${currency}. The user's primary use for this PC is '${purpose}' and they are looking for a '${performanceTier}' performance tier. The builds must be optimized for this purpose and performance level. For each build, provide a unique name, a list of components (CPU, GPU, Motherboard, RAM, Storage, PSU, Case) with their individual estimated prices, key specs for each component (e.g., '16GB DDR5 6000MHz' for RAM), estimated power draw for CPU and GPU, the total price, total estimated wattage, a target resolution (e.g., '1080p', '1440p', '4K') the build is optimized for, an estimated average FPS as a number for that resolution across modern AAA games, a one-sentence performance summary, and estimated performance in popular games like Fortnite and Warzone. Also provide a plausible Amazon search URL for each component, formatted as 'https://www.amazon.com/s?k=COMPONENT_NAME&tag=deazlly-20'. The total price must not exceed the budget. Respond in valid JSON format according to the provided schema.`;
    if (notes) {
      prompt += ` The user also provided these additional notes: '${notes}'. Please take these into consideration.`;
    }

    const response = await ai.models.generateContent({
      model: resolveModelName(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { builds: { type: Type.ARRAY, items: buildSchema } },
          required: ["builds"]
        },
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      return res.status(502).json({ error: "Empty response from model" });
    }

    const parsed = JSON.parse(responseText);
    if (!parsed.builds || !Array.isArray(parsed.builds)) {
      return res.status(502).json({ error: "Invalid response format from model" });
    }

    return res.status(200).json({ builds: parsed.builds });
  } catch (err) {
    console.error("/api/generate error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
