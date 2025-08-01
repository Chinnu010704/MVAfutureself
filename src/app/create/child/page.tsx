
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
    defaultValues: {
      name: '',
      gender: undefined,
      profession: '',
    },
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

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "About the Young Visionary";
      case 2:
        return "Capture a Photo";
      case 3:
        return "Your Future Self!";
      default:
        return "";
    }
  }

  if (step === 3 && isPending) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
        <div className="relative">
          <Loader2 className="h-20 w-20 animate-spin text-primary" />
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse-slow"></div>
        </div>
        <h2 className="text-3xl font-bold animate-pulse-slow">Imagining the Future...</h2>
        <p className="text-muted-foreground">Generating your personalized image. This may take a moment.</p>
      </div>
    );
  }

  if (step === 3 && result && formData) {
    return (
       <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center w-full mt-24">
          <ResultCard
            name={formData.name}
            imageUrl={result.generatedImage}
            description={result.description}
            profession={formData.profession}
          />
       </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-2xl mt-24 mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Future Self (Ages 5-10)</h1>
      </header>
      <Card className="w-full max-w-2xl bg-black/30 bg-glass border-purple-500/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
            <span className="text-sm font-medium text-muted-foreground">Step {step} / {totalSteps}</span>
          </div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
