'use server';
/**
 * @fileOverview This file defines a Genkit flow for comparing Fiqh rulings from different scholars or Islamic texts.
 *
 * - compareFiqhRulings - A function that handles the comparison of Fiqh rulings.
 * - CompareFiqhRulingsInput - The input type for the compareFiqhRulings function.
 * - CompareFiqhRulingsOutput - The return type for the compareFiqhRulings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareFiqhRulingsInputSchema = z.object({
  topic: z.string().describe('The specific topic for which Fiqh rulings are to be compared.'),
  sources: z.string().describe('A list of scholars or Islamic texts to compare the rulings from, separated by commas.'),
});
export type CompareFiqhRulingsInput = z.infer<typeof CompareFiqhRulingsInputSchema>;

const CompareFiqhRulingsOutputSchema = z.object({
  comparison: z.string().describe('A detailed comparison of the Fiqh rulings on the specified topic from the given sources.'),
});
export type CompareFiqhRulingsOutput = z.infer<typeof CompareFiqhRulingsOutputSchema>;

export async function compareFiqhRulings(input: CompareFiqhRulingsInput): Promise<CompareFiqhRulingsOutput> {
  return compareFiqhRulingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareFiqhRulingsPrompt',
  input: {schema: CompareFiqhRulingsInputSchema},
  output: {schema: CompareFiqhRulingsOutputSchema},
  prompt: `You are an expert in Islamic jurisprudence (Fiqh).

You will compare the rulings on the specified topic from the given sources and provide a detailed comparison.

Topic: {{{topic}}}
Sources: {{{sources}}}

Comparison:`,
});

const compareFiqhRulingsFlow = ai.defineFlow(
  {
    name: 'compareFiqhRulingsFlow',
    inputSchema: CompareFiqhRulingsInputSchema,
    outputSchema: CompareFiqhRulingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
