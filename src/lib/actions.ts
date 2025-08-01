
'use server';

import { generateProfessionImage5To10 } from '@/ai/flows/generate-profession-image-5-10';
import { generateProfessionImage11To17 } from '@/ai/flows/generate-profession-image-11-17';
import type { ChildFormValues, QuizAnswers, TeenFormValues, GenerationResult } from './definitions';

export async function generateForChild(
  values: ChildFormValues,
  photoDataUri: string
): Promise<{ data: GenerationResult | null; error: string | null }> {
  try {
    const result = await generateProfessionImage5To10({
      name: values.name,
      profession: values.profession,
      photoDataUri: photoDataUri,
    });

    if (!result.generatedImage) {
      throw new Error('Image generation failed or returned no image.');
    }

    return { data: { generatedImage: result.generatedImage, description: result.description, profession: values.profession }, error: null };
  } catch (err) {
    console.error('[CHILD GENERATION ERROR]', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to generate image: ${errorMessage}` };
  }
}

export async function generateForTeen(
  values: TeenFormValues,
  photoDataUri: string,
  personalityAnswers: QuizAnswers
): Promise<{ data: GenerationResult | null; error: string | null }> {
  try {
    const result = await generateProfessionImage11To17({
      name: values.name,
      photoDataUri: photoDataUri,
      personalityAnswers,
    });
    
    if (!result.generatedImageDataUri) {
      throw new Error('Image generation failed or returned no image.');
    }

    return { data: { generatedImage: result.generatedImageDataUri, description: result.description, profession: result.profession }, error: null };
  } catch (err) {
    console.error('[TEEN GENERATION ERROR]', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to generate image: ${errorMessage}` };
  }
}

    