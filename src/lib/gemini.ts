import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  // We don't throw here to avoid crashing the server on startup, 
  // but we'll check it in the route handlers.
  console.warn("GEMINI_API_KEY is not set in environment variables.");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
