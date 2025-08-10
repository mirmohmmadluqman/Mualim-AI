'use server';

/**
 * @fileOverview A Shamela search guidance AI agent.
 *
 * - shamelaSearchGuidance - A function that guides the user step-by-step to find specific information within the Shamela digital library.
 * - ShamelaSearchGuidanceInput - The input type for the shamelaSearchGuidance function.
 * - ShamelaSearchGuidanceOutput - The return type for the shamelaSearchGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShamelaSearchGuidanceInputSchema = z.object({
  query: z.string().describe('The information the user is trying to find in the Shamela digital library.'),
});
export type ShamelaSearchGuidanceInput = z.infer<typeof ShamelaSearchGuidanceInputSchema>;

const ShamelaSearchGuidanceOutputSchema = z.object({
  steps: z.array(z.string()).describe('A step-by-step guide to find the information in the Shamela digital library.'),
});
export type ShamelaSearchGuidanceOutput = z.infer<typeof ShamelaSearchGuidanceOutputSchema>;

export async function shamelaSearchGuidance(input: ShamelaSearchGuidanceInput): Promise<ShamelaSearchGuidanceOutput> {
  return shamelaSearchGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shamelaSearchGuidancePrompt',
  input: {schema: ShamelaSearchGuidanceInputSchema},
  output: {schema: ShamelaSearchGuidanceOutputSchema},
  prompt: `You are an expert in using the Shamela digital library.

You will guide the user step-by-step to find the information they are looking for in the Shamela digital library.

User Query: {{{query}}}

Provide a numbered list of steps to find the information. Be as specific as possible, including search terms, book names, and chapter titles if applicable.
`,
});

const shamelaSearchGuidanceFlow = ai.defineFlow(
  {
    name: 'shamelaSearchGuidanceFlow',
    inputSchema: ShamelaSearchGuidanceInputSchema,
    outputSchema: ShamelaSearchGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
