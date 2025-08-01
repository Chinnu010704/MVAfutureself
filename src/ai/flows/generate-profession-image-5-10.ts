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
  description: z.string().describe('A description of the generated image. Should be a fancy, 5-line paragraph.'),
});
export type GenerateProfessionImage5To10Output = z.infer<typeof GenerateProfessionImage5To10OutputSchema>;

export async function generateProfessionImage5To10(
  input: GenerateProfessionImage5To10Input
): Promise<GenerateProfessionImage5To10Output> {
  return generateProfessionImage5To10Flow(input);
}

const descriptionPrompt = ai.definePrompt({
  name: 'generateProfessionDescription5To10Prompt',
  input: {schema: z.object({
    name: z.string(),
    profession: z.string()
  })},
  output: {schema: z.object({
    description: z.string().describe('A fancy, 5-line paragraph about the student and their profession.')
  })},
  prompt: `You are an expert career counselor and storyteller. Generate a fancy, inspiring, 5-line paragraph about a student named {{{name}}} who wants to be a {{{profession}}}. The tone should be uplifting and imaginative.`,
});

const generateProfessionImage5To10Flow = ai.defineFlow(
  {
    name: 'generateProfessionImage5To10Flow',
    inputSchema: GenerateProfessionImage5To10InputSchema,
    outputSchema: GenerateProfessionImage5To10OutputSchema,
  },
  async input => {
    const [imageGenResponse, descriptionGenResponse] = await Promise.all([
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          {text: `Generate a realistic image of a young student named ${input.name} as a ${input.profession}. The image should be high quality and show the student in an environment and attire suitable for the profession.`},
          {media: {url: input.photoDataUri}},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
      descriptionPrompt({name: input.name, profession: input.profession})
    ]);
    
    const generatedImage = imageGenResponse.media;
    if (!generatedImage?.url) {
      throw new Error('Image generation failed');
    }

    const description = descriptionGenResponse.output?.description;
    if (!description) {
        throw new Error('Description generation failed');
    }

    return {
      generatedImage: generatedImage.url,
      description: description,
    };
  }
);
