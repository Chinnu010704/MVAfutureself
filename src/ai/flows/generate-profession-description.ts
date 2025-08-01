'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a description of a profession.
 *
 * The flow takes the profession name as input and returns a short description of the profession.
 * It exports:
 *   - generateProfessionDescription: The function to call to generate the description.
 *   - GenerateProfessionDescriptionInput: The input type for the function.
 *   - GenerateProfessionDescriptionOutput: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfessionDescriptionInputSchema = z.object({
  profession: z.string().describe('The name of the profession to describe.'),
});

export type GenerateProfessionDescriptionInput = z.infer<typeof GenerateProfessionDescriptionInputSchema>;

const GenerateProfessionDescriptionOutputSchema = z.object({
  description: z.string().describe('A short, 3-line description of the profession.'),
});

export type GenerateProfessionDescriptionOutput = z.infer<typeof GenerateProfessionDescriptionOutputSchema>;

const professionDescriptionPrompt = ai.definePrompt({
  name: 'professionDescriptionPrompt',
  input: {schema: GenerateProfessionDescriptionInputSchema},
  output: {schema: GenerateProfessionDescriptionOutputSchema},
  prompt: `You are an expert career counselor. Generate a short, sweet, 3-line description of the following profession:

Profession: {{{profession}}}`,
});

const generateProfessionDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProfessionDescriptionFlow',
    inputSchema: GenerateProfessionDescriptionInputSchema,
    outputSchema: GenerateProfessionDescriptionOutputSchema,
  },
  async input => {
    const {output} = await professionDescriptionPrompt(input);
    return output!;
  }
);

export async function generateProfessionDescription(input: GenerateProfessionDescriptionInput): Promise<GenerateProfessionDescriptionOutput> {
  return generateProfessionDescriptionFlow(input);
}
