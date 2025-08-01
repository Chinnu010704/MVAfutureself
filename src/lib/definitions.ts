
import { z } from 'zod';

export const childFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  gender: z.enum(['male', 'female'], { required_error: "Please select a gender." }),
  profession: z.string().min(3, { message: "Profession must be at least 3 characters." }).max(50),
});
export type ChildFormValues = z.infer<typeof childFormSchema>;

export const teenFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  gender: z.enum(['male', 'female'], { required_error: "Please select a gender." }),
});
export type TeenFormValues = z.infer<typeof teenFormSchema>;

export type QuizAnswers = string[];

export interface GenerationResult {
  generatedImage: string;
  description: string;
  profession?: string;
}

    