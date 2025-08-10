'use server';

/**
 * @fileOverview Summarizes a section of text from an Islamic book.
 *
 * - summarizeIslamicText - A function that handles the summarization process.
 * - SummarizeIslamicTextInput - The input type for the summarizeIslamicText function.
 * - SummarizeIslamicTextOutput - The return type for the summarizeIslamicText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIslamicTextInputSchema = z.object({
  text: z.string().describe('The section of text from an Islamic book to summarize.'),
});
export type SummarizeIslamicTextInput = z.infer<typeof SummarizeIslamicTextInputSchema>;

const SummarizeIslamicTextOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key points in the provided text.'),
});
export type SummarizeIslamicTextOutput = z.infer<typeof SummarizeIslamicTextOutputSchema>;

export async function summarizeIslamicText(input: SummarizeIslamicTextInput): Promise<SummarizeIslamicTextOutput> {
  return summarizeIslamicTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIslamicTextPrompt',
  input: {schema: SummarizeIslamicTextInputSchema},
  output: {schema: SummarizeIslamicTextOutputSchema},
  prompt: `You are an expert in Islamic texts and summarization. Please provide a concise summary of the key points in the following text:\n\n{{{text}}}`,
});

const summarizeIslamicTextFlow = ai.defineFlow(
  {
    name: 'summarizeIslamicTextFlow',
    inputSchema: SummarizeIslamicTextInputSchema,
    outputSchema: SummarizeIslamicTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
