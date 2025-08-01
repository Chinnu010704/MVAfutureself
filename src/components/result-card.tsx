
"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Download, RefreshCw, Sparkles, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface ResultCardProps {
  name: string;
  imageUrl: string;
  description: string;
  profession?: string;
}

export function ResultCard({ name, imageUrl, description, profession }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const downloadCard = () => {
    // This is a placeholder for a proper library like html2canvas
    // as we are not allowed to add new dependencies.
    toast({
      title: 'Coming Soon!',
      description: 'The download functionality is being worked on.',
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
      <div className="text-center">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white">Chinnu's Future!</h2>
          <p className="text-muted-foreground">Here's how {name} might look as a {profession || 'professional'}</p>
      </div>

      <Card ref={cardRef} className="w-full max-w-lg bg-black/30 bg-glass border-purple-500/20 shadow-2xl overflow-hidden">
        <CardContent className="p-6">
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-primary">Chinnu as a {profession || 'Future Professional'}</h3>
                <p className="text-sm text-muted-foreground">Look how amazing {name} looks as a {profession}</p>
            </div>
          
            <div className="relative aspect-square w-full max-w-sm mx-auto rounded-xl bg-muted/30 overflow-hidden flex items-center justify-center p-4 shadow-inner">
                <Image
                    src={imageUrl}
                    alt={`AI generated image for ${name}`}
                    fill
                    className="object-cover"
                    data-ai-hint="futuristic portrait"
                />
                 <div className="absolute top-4 right-4 p-3 bg-black/50 rounded-full backdrop-blur-sm">
                    <Briefcase className="w-6 h-6 text-white"/>
                </div>
                <div className="absolute bottom-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
                    <p className="text-white font-semibold">Your Future Self as a {profession}</p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <h4 className="font-semibold text-white">Your Career Vision</h4>
                <p className="text-sm text-muted-foreground">Based on your personality and interests</p>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30">
                <h5 className="font-bold text-primary mb-1">{profession}</h5>
                <p className="text-sm text-white/80">{description}</p>
            </div>

        </CardContent>
      </Card>

      <div className="flex gap-4 w-full max-w-lg">
        <Link href="/" className="w-full">
            <Button variant="outline" className="w-full h-12 text-base">
                <RefreshCw className="mr-2 h-4 w-4" /> Start New Journey
            </Button>
        </Link>
        <Button onClick={downloadCard} className="w-full h-12 text-base bg-gradient-button">
          <Download className="mr-2 h-4 w-4" /> Download My Card
        </Button>
      </div>
    </div>
  );
}

    