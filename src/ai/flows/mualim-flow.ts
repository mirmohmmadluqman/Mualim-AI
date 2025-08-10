'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { type Skill } from '@/app/page';

const MualimInputSchema = z.object({
  skill: z.string(),
  language: z.string(),
  input: z.any(),
});

export type MualimInput = z.infer<typeof MualimInputSchema>;

const MualimOutputSchema = z.object({
  content: z.string(),
});

export type MualimOutput = z.infer<typeof MualimOutputSchema>;

const getSystemPrompt = (skill: Skill, language: "Urdu" | "English"): string => {
    const languageInstruction = `(Important: Please provide the answer in clear ${language}.)`;

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

const mualimPrompt = ai.definePrompt({
    name: 'mualimPrompt',
    input: { schema: MualimInputSchema },
    output: { schema: MualimOutputSchema },
    prompt: `{{getSystemPrompt skill language}}

{{getUserContent skill input}}`,
    config: {
        model: 'gemini-1.5-flash-latest',
    },
    customizers: {
        getSystemPrompt: (skill: Skill, language: "Urdu" | "English") => getSystemPrompt(skill, language),
        getUserContent: (skill: Skill, input: any) => getUserContent(skill, input),
    },
});

export async function getGeminiResponse(skill: Skill, input: any, language: "Urdu" | "English"): Promise<{ content: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return {
            content: "The Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable."
        }
    }
    const { output } = await mualimPrompt({ skill, language, input });
    return output ?? { content: "I'm sorry, I couldn't generate a response." };
}