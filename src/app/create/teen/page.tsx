
'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowLeft, Loader2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { teenFormSchema, type TeenFormValues, type GenerationResult, type QuizAnswers } from '@/lib/definitions';
import { quizQuestions } from '@/lib/quiz';
import { generateForTeen } from '@/lib/actions';
import { CameraCapture } from '@/components/camera-capture';
import { ResultCard } from '@/components/result-card';

const totalSteps = 4;

export default function CreateTeenPage() {
  const [step, setStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setQuizAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (quizAnswers[currentQuestionIndex] === '') {
      toast({
        title: "No Answer Selected",
        description: "Please select an answer to continue.",
        variant: "destructive",
      });
      return;
    }
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question, move to next step
      setStep(3);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setStep(1);
    }
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
  
  const getStepTitle = () => {
    switch (step) {
        case 1: return "Basic Information";
        case 2: return "Personality Quiz";
        case 3: return "Get a Photo";
        case 4: return "Your Future Self!";
        default: return "";
    }
  }

  const renderQuizContent = () => {
    const question = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    return (
      <div className="space-y-6 animate-fade-in">
          <div>
              <Progress value={progress} className="mb-4" />
              <p className="font-medium mb-2 text-lg">{currentQuestionIndex + 1}. {question.question}</p>
              <RadioGroup onValueChange={handleQuizAnswer} value={quizAnswers[currentQuestionIndex]} className="flex flex-col space-y-2 mt-4">
                  {question.options.map((option, optIndex) => (
                  <FormItem key={optIndex} className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-transparent transition-all has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10">
                      <FormControl><RadioGroupItem value={option} /></FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">{option}</FormLabel>
                  </FormItem>
                  ))}
              </RadioGroup>
          </div>
          <div className='flex gap-4 pt-4'>
              <Button variant="outline" onClick={handlePreviousQuestion} className="w-full">
                <ArrowLeft className="mr-2"/> Back
              </Button>
              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next' : 'Finish Quiz'} <ArrowRight className="ml-2"/>
              </Button>
          </div>
      </div>
    );
  }

  if (step === 4 && isPending) {
     return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4 bg-background animate-fade-in">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-75 animate-pulse-slow"></div>
                <div className="relative w-32 h-32 flex items-center justify-center bg-background rounded-full">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-white mt-8 tracking-wide">Crafting Your Future...</h2>
            <p className="text-lg text-muted-foreground mt-2">Analyzing your potential and generating your vision...</p>
        </div>
     );
  }

  if (step === 4 && result && formData) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center w-full mt-24">
        <ResultCard name={formData.name} imageUrl={result.generatedImage} description={result.description} profession={result.profession} />
      </div>
    );
  }
  
  const getStepNumber = () => {
    if (step === 1) return 1;
    if (step === 2) return 2;
    if (step === 3) return 3;
    if (step === 4) return 4;
    return 1;
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
                    <span className="text-sm font-medium text-muted-foreground">Step {getStepNumber()} / {totalSteps}</span>
                </div>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] flex flex-col justify-center">
                <Form {...form}>
                  {step === 1 && (
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
                      <Button type="submit" className="w-full">Next <ArrowRight className="ml-2"/></Button>
                    </form>
                  )}
                  {step === 2 && renderQuizContent()}
                  {step === 3 && (
                    <div className="animate-fade-in">
                        <CameraCapture onCapture={handleCapture} onRetake={() => setPhotoDataUri(null)} />
                        <Button variant="outline" onClick={() => setStep(2)} className="mt-4 w-full">Back to Quiz</Button>
                    </div>
                  )}
                </Form>
              </div>
            </CardContent>
        </Card>
    </div>
  );
}
