
'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, User, Briefcase } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { childFormSchema, type ChildFormValues, type GenerationResult } from '@/lib/definitions';
import { generateForChild } from '@/lib/actions';
import { CameraCapture } from '@/components/camera-capture';
import { ResultCard } from '@/components/result-card';

const totalSteps = 3;

export default function CreateChildPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ChildFormValues | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    mode: 'onChange',
  });

  const processForm = (data: ChildFormValues) => {
    setFormData(data);
    setStep(2);
  };

  const handleCapture = (dataUri: string) => {
    if (!formData) return;
    setPhotoDataUri(dataUri);
    setStep(3);

    startTransition(async () => {
      const { data, error } = await generateForChild(formData, dataUri);
      if (error) {
        toast({
          title: 'Generation Failed',
          description: error,
          variant: 'destructive',
        });
        setStep(2); // Go back to camera step
        return;
      }
      setResult(data);
    });
  };

  const handleStartOver = () => {
    setStep(1);
    setFormData(null);
    setPhotoDataUri(null);
    setResult(null);
    form.reset();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-2xl mt-8 mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Future Self (Ages 5-10)</h1>
      </header>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step {step} of {totalSteps}</CardTitle>
          <CardDescription>
            {step === 1 && "Tell us about the young visionary."}
            {step === 2 && "Capture a photo for the AI."}
            {step === 3 && (isPending ? "Our AI is imagining the future..." : "Here is your Future Self!")}
          </CardDescription>
          <Progress value={(step / totalSteps) * 100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex flex-col justify-center">
            {step === 1 && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className="space-y-8 animate-fade-in">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User /> Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Alex" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="male" /></FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="female" /></FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="profession" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Briefcase /> Dream Profession</FormLabel>
                      <FormControl><Input placeholder="e.g., Astronaut" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full">Next <ArrowRight className="ml-2" /></Button>
                </form>
              </Form>
            )}
            {step === 2 && (
              <div className="animate-fade-in">
                <CameraCapture onCapture={handleCapture} onRetake={() => setPhotoDataUri(null)} />
                <Button variant="outline" onClick={() => setStep(1)} className="mt-4 w-full">Back to Details</Button>
              </div>
            )}
            {step === 3 && (
              <div className="animate-fade-in text-center">
                {isPending && (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p className="text-muted-foreground">Generating image... This may take a moment.</p>
                  </div>
                )}
                {result && formData && (
                  <ResultCard 
                    name={formData.name}
                    imageUrl={result.generatedImage}
                    description={result.description}
                    onStartOver={handleStartOver}
                  />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
