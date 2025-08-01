
'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { teenFormSchema, type TeenFormValues, type GenerationResult, type QuizAnswers } from '@/lib/definitions';
import { quizQuestions } from '@/lib/quiz';
import { generateForTeen } from '@/lib/actions';
import { CameraCapture } from '@/components/camera-capture';
import { ResultCard } from '@/components/result-card';

const totalSteps = 4;

export default function CreateTeenPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TeenFormValues | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(Array(quizQuestions.length).fill(''));
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<TeenFormValues>({
    resolver: zodResolver(teenFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      gender: undefined,
    },
  });

  const processDetails = (data: TeenFormValues) => {
    setFormData(data);
    setStep(2);
  };

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answer;
    setQuizAnswers(newAnswers);
  };
  
  const submitQuiz = () => {
    if (quizAnswers.some(answer => answer === '')) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
  };

  const handleCapture = (dataUri: string) => {
    if (!formData) return;
    setPhotoDataUri(dataUri);
    setStep(4);

    startTransition(async () => {
      const { data, error } = await generateForTeen(formData, dataUri, quizAnswers);
      if (error) {
        toast({
          title: 'Generation Failed',
          description: error,
          variant: 'destructive',
        });
        setStep(3); // Go back to camera step
        return;
      }
      setResult(data);
    });
  };

  const handleStartOver = () => {
    setStep(1);
    setFormData(null);
    setQuizAnswers(Array(quizQuestions.length).fill(''));
    setPhotoDataUri(null);
    setResult(null);
    form.reset();
  };
  
  const getStepTitle = () => {
    switch (step) {
        case 1: return "Basic Information";
        case 2: return "Personality Quiz";
        case 3: return "Get a Photo";
        case 4: return isPending ? "Crafting Your Future..." : "Your Future Self!";
        default: return "";
    }
  }

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(processDetails)} className="space-y-8 animate-fade-in">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><User/> Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Jamie" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">Start Quiz <ArrowRight className="ml-2"/></Button>
            </form>
          </Form>
        );
      case 2:
        return (
          <Form {...form}>
            <form onSubmit={e => { e.preventDefault(); submitQuiz(); }} className="space-y-6 animate-fade-in">
                {quizQuestions.map((q, index) => (
                  <div key={index}>
                    <p className="font-medium mb-2">{index + 1}. {q.question}</p>
                    <RadioGroup onValueChange={(value) => handleQuizAnswer(index, value)} value={quizAnswers[index]} className="flex flex-col space-y-1">
                      {q.options.map((option, optIndex) => (
                        <FormItem key={optIndex} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={option} /></FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                <div className='flex gap-4 pt-4'>
                    <Button variant="outline" onClick={() => setStep(1)} className="w-full">Back</Button>
                    <Button type="submit" className="w-full">Next <ArrowRight className="ml-2"/></Button>
                </div>
            </form>
          </Form>
        );
      case 3:
        return (
            <div className="animate-fade-in">
                <CameraCapture onCapture={handleCapture} onRetake={() => setPhotoDataUri(null)} />
                <Button variant="outline" onClick={() => setStep(2)} className="mt-4 w-full">Back to Quiz</Button>
            </div>
        );
      case 4:
        return (
          <div className="animate-fade-in text-center">
            {isPending && (
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">Finding a suitable profession and generating image...</p>
              </div>
            )}
            {result && formData && (
              <ResultCard name={formData.name} imageUrl={result.generatedImage} description={result.description} onStartOver={handleStartOver} />
            )}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-3xl mt-24 mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Future Self (Ages 11-17)</h1>
      </header>
      
      <Card className="w-full max-w-3xl bg-black/30 bg-glass border-purple-500/20">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
                <span className="text-sm font-medium text-muted-foreground">Step {step} / {totalSteps}</span>
            </div>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex flex-col justify-center">
            {renderStepContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
