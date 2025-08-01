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
  description: z.string().describe('A fancy, 3-line paragraph about the student and their AI-suggested profession.'),
});
export type GenerateProfessionImage11To17Output = z.infer<typeof GenerateProfessionImage11To17OutputSchema>;

export async function generateProfessionImage11To17(
  input: GenerateProfessionImage11To17Input
): Promise<GenerateProfessionImage11To17Output> {
  return generateProfessionImage11To17Flow(input);
}

const professionSuggestionPrompt = ai.definePrompt({
    name: 'professionSuggestionPrompt',
    input: { schema: z.object({
        name: z.string(),
        personalityAnswers: z.array(z.string()),
    }) },
    output: { schema: z.object({
        profession: z.string().describe('A single profession title that fits the personality.'),
        description: z.string().describe('A fancy, 3-line paragraph about the student and their AI-suggested profession, explaining why it fits them.')
    }) },
    prompt: `You are an expert career counselor and storyteller. Based on the following 10 answers to a personality quiz for a student named {{{name}}}, suggest a single, specific profession that would be a great fit. Then, write a fancy, inspiring, 3-line paragraph about why {{{name}}} would be amazing in that profession, connecting it to their personality traits revealed in the quiz.

Personality Quiz Answers:
{{#each personalityAnswers}}
- {{{this}}}
{{/each}}
`
});

const generateProfessionImage11To17Flow = ai.defineFlow(
  {
    name: 'generateProfessionImage11To17Flow',
    inputSchema: GenerateProfessionImage11To17InputSchema,
    outputSchema: GenerateProfessionImage11To17OutputSchema,
  },
  async input => {
    const professionSuggestion = await professionSuggestionPrompt({
        name: input.name,
        personalityAnswers: input.personalityAnswers,
    });

    const profession = professionSuggestion.output?.profession;
    const description = professionSuggestion.output?.description;

    if (!profession || !description) {
        throw new Error('Failed to generate profession suggestion or description.');
    }

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
            {text: `Generate a realistic image of a teenage student named ${input.name} as a ${profession}. The image should be high quality and show the student in an environment and attire suitable for that profession.`},
            {media: {url: input.photoDataUri}},
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed');
    }

    return {
      generatedImageDataUri: media.url,
      description,
    };
  }
);
