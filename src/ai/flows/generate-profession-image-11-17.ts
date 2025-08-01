'use server';
/**
 * @fileOverview Generates an image of a student aged 11-17 in a profession that matches their personality.
 *
 * - generateProfessionImage11To17 - A function that handles the image generation process.
 * - GenerateProfessionImage11To17Input - The input type for the generateProfessionImage11To17 function.
 * - GenerateProfessionImage11To17Output - The return type for the generateProfessionImage11To17 function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfessionImage11To17InputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the student, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  name: z.string().describe('The name of the student.'),
  personalityAnswers: z
    .array(z.string())
    .length(10)
    .describe('Answers to a 10-question personality questionnaire.'),
});
export type GenerateProfessionImage11To17Input = z.infer<typeof GenerateProfessionImage11To17InputSchema>;

const GenerateProfessionImage11To17OutputSchema = z.object({
  generatedImageDataUri: z
    .string()
    .describe("The generated image of the student in a profession, as a data URI."),
  description: z.string().describe('A description of the generated image.'),
});
export type GenerateProfessionImage11To17Output = z.infer<typeof GenerateProfessionImage11To17OutputSchema>;

export async function generateProfessionImage11To17(
  input: GenerateProfessionImage11To17Input
): Promise<GenerateProfessionImage11To17Output> {
  return generateProfessionImage11To17Flow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProfessionImage11To17Prompt',
  input: {schema: GenerateProfessionImage11To17InputSchema},
  output: {schema: GenerateProfessionImage11To17OutputSchema},
  prompt: `You are an AI that generates images of students in professions that match their personality.

  The student's name is {{{name}}}.
  Here is their photo: {{media url=photoDataUri}}
  Here are the answers to their personality questionnaire:
  {{#each personalityAnswers}}
  - {{{this}}}
  {{/each}}

  Based on this information, generate an image of the student in a profession that matches their personality.  The image should match the profession with the field, dressing, environment, and equipment appropriate for the profession.

  Also, generate a short description of the image.
  `,
});

const generateProfessionImage11To17Flow = ai.defineFlow(
  {
    name: 'generateProfessionImage11To17Flow',
    inputSchema: GenerateProfessionImage11To17InputSchema,
    outputSchema: GenerateProfessionImage11To17OutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
