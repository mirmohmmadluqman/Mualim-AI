'use server';
/**
 * @fileOverview This file defines a Genkit flow for extracting core themes or concepts from a section of Islamic text.
 *
 * - extractConceptsFromText - A function that takes Islamic text as input and returns the extracted concepts.
 * - ExtractConceptsFromTextInput - The input type for the extractConceptsFromText function.
 * - ExtractConceptsFromTextOutput - The return type for the extractConceptsFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractConceptsFromTextInputSchema = z.object({
  islamicText: z.string().describe('A section of Islamic text to extract concepts from.'),
});
export type ExtractConceptsFromTextInput = z.infer<typeof ExtractConceptsFromTextInputSchema>;

const ExtractConceptsFromTextOutputSchema = z.object({
  concepts: z
    .array(z.string())
    .describe('A list of core themes or concepts extracted from the Islamic text.'),
});
export type ExtractConceptsFromTextOutput = z.infer<typeof ExtractConceptsFromTextOutputSchema>;

export async function extractConceptsFromText(input: ExtractConceptsFromTextInput): Promise<ExtractConceptsFromTextOutput> {
  return extractConceptsFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractConceptsFromTextPrompt',
  input: {schema: ExtractConceptsFromTextInputSchema},
  output: {schema: ExtractConceptsFromTextOutputSchema},
  prompt: `You are an expert in Islamic studies. Please read the following text and extract the core themes or concepts.
\nText: {{{islamicText}}}
\nConcepts:`, //The prompt should return a bulleted list
});

const extractConceptsFromTextFlow = ai.defineFlow(
  {
    name: 'extractConceptsFromTextFlow',
    inputSchema: ExtractConceptsFromTextInputSchema,
    outputSchema: ExtractConceptsFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
