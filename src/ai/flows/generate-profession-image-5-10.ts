'use server';

/**
 * @fileOverview Generates an image of a student (ages 5-10) in their chosen profession.
 *
 * - generateProfessionImage5To10 - A function that handles the image generation process.
 * - GenerateProfessionImage5To10Input - The input type for the generateProfessionImage5To10 function.
 * - GenerateProfessionImage5To10Output - The return type for the generateProfessionImage5To10 function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfessionImage5To10InputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  profession: z.string().describe('The chosen profession for the student.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the student, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProfessionImage5To10Input = z.infer<typeof GenerateProfessionImage5To10InputSchema>;

const GenerateProfessionImage5To10OutputSchema = z.object({
  generatedImage: z
    .string()
    .describe(
      'The generated image of the student in their chosen profession, as a data URI.'
    ),
  description: z.string().describe('A description of the generated image.'),
});
export type GenerateProfessionImage5To10Output = z.infer<typeof GenerateProfessionImage5To10OutputSchema>;

export async function generateProfessionImage5To10(
  input: GenerateProfessionImage5To10Input
): Promise<GenerateProfessionImage5To10Output> {
  return generateProfessionImage5To10Flow(input);
}

const generateProfessionPrompt = ai.definePrompt({
  name: 'generateProfessionPrompt',
  input: {schema: GenerateProfessionImage5To10InputSchema},
  output: {schema: GenerateProfessionImage5To10OutputSchema},
  prompt: `You are an AI that generates images of students in their chosen profession.

  The student's name is {{{name}}}.
  The student's chosen profession is {{{profession}}}.

  Generate an image of the student in their chosen profession, making sure the field, dressing, environment and equipments are matched with professional.

  Here is the student's photo: {{media url=photoDataUri}}

  Also generate a short description of the image.

  Your output should contain the generated image as a data URI and the description.
  `,
});

const generateProfessionImage5To10Flow = ai.defineFlow(
  {
    name: 'generateProfessionImage5To10Flow',
    inputSchema: GenerateProfessionImage5To10InputSchema,
    outputSchema: GenerateProfessionImage5To10OutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {text: `Generate an image of a student named ${input.name} in the profession of a  ${input.profession}`},
        {media: {url: input.photoDataUri}},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const {output} = await generateProfessionPrompt(input);
    if (!media?.url) {
      throw new Error('Image generation failed');
    }
    return {
      generatedImage: media.url,
      description: output?.description ?? `A photo of ${input.name} as a ${input.profession}.`,
    };
  }
);
