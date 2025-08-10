"use server";

import OpenAI from "openai";
import { getGeminiResponse } from "@/ai/flows/mualim-flow";
import { type Skill, type Language } from "./page";

export type AIModel = "gemini" | "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getSystemPrompt = (skill: Skill, language: Language): string => {
    const languageInstruction = language === "Recommended" 
        ? `(Important: Respond in the same language as the user's query.)`
        : `(Important: Please provide the answer in clear ${language}.)`;

    switch (skill) {
      case "fiqh-comparison":
        return `You are an expert in Islamic jurisprudence (Fiqh). You will compare the rulings on a specified topic from given sources and provide a detailed comparison. ${languageInstruction}`;
      case "summarization":
        return `You are an expert in Islamic texts and summarization. Please provide a concise summary of the key points in the following text. ${languageInstruction}`;
      case "concept-extraction":
        return `You are an expert in Islamic studies. Please read the following text and extract the core themes or concepts. Return a bulleted list. ${languageInstruction}`;
      case "shamela-guidance":
        return `You are an expert in using the Shamela digital library. Guide the user step-by-step to find the information they are looking for. Provide a numbered list of steps. Be as specific as possible, including search terms, book names, and chapter titles if applicable. ${languageInstruction}`;
      default:
        return `You are a helpful AI assistant. ${languageInstruction}`;
    }
}

const getUserContent = (skill: Skill, input: any): string => {
    switch (skill) {
        case "fiqh-comparison":
            return `Topic: ${input.topic}\nSources: ${input.sources}`;
        case "summarization":
        case "concept-extraction":
            return `Text: ${input.text}`;
        case "shamela-guidance":
            return `User Query: ${input.query}`;
        default:
            return input.text || input.query;
    }
}

async function getOpenAiResponse(
  skill: Skill,
  input: any,
  language: Language
): Promise<{ content: string }> {
  if (!process.env.OPENAI_API_KEY) {
      return {
          content: "The OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable."
      }
  }
  
  try {
    const systemPrompt = getSystemPrompt(skill, language);
    const userContent = getUserContent(skill, input);

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
        ],
        model: "gpt-3.5-turbo",
    });

    const content = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";
    return { content };

  } catch (error) {
    console.error("AI Action Error:", error);
    let errorMessage = "I'm sorry, but I encountered an issue while processing your request. Please check your input or try again.";
    if (error instanceof OpenAI.APIError) {
      errorMessage = `OpenAI API Error: ${error.status} ${error.name}. Please check your API key and network connection.`;
    }
    return {
      content: errorMessage,
    };
  }
}


export async function getAiResponse(
  model: AIModel,
  skill: Skill,
  input: any,
  language: Language
): Promise<{ content: string }> {
  if (model === 'gemini') {
    return getGeminiResponse(skill, input, language);
  }
  return getOpenAiResponse(skill, input, language);
}
