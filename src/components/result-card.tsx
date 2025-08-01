
"use client";

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
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
    if (!cardRef.current) {
      toast({
        title: 'Error',
        description: 'Could not find the card element to download.',
        variant: 'destructive',
      });
      return;
    }

    html2canvas(cardRef.current, {
      backgroundColor: null, // Use transparent background for the canvas itself
      logging: false,
      useCORS: true, 
      scale: 2, // Increase resolution for better quality
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'mva-future-self.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({
        title: 'Download Started',
        description: 'Your Future Self card is being downloaded.',
      });
    }).catch((err) => {
      console.error('Error generating canvas:', err);
      toast({
        title: 'Download Failed',
        description: 'Sorry, we were unable to generate the card for download.',
        variant: 'destructive',
      });
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
        <div className="w-full max-w-3xl text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
                <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white">Your Future Unlocked!</h2>
            <p className="text-muted-foreground">Congratulations, {name}! Here is your AI-generated glimpse into a possible future.</p>
        </div>

        {/* This is the card that will be downloaded */}
        <div 
          ref={cardRef} 
          className="w-full max-w-3xl bg-gradient-to-br from-gray-950 via-blue-950 to-purple-900/50 rounded-2xl border border-primary/20 p-1 shadow-2xl aspect-[9/16] flex flex-col"
        >
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 flex flex-col flex-grow">
                <header className="flex items-center justify-center pb-4 border-b border-border/50">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                            MV
                        </div>
                        <span className="font-bold text-xl text-white flex items-center">
                          MVAFutureSelf
                          <Sparkles className="h-5 w-5 text-yellow-300 ml-1.5" />
                        </span>
                    </div>
                </header>

                <main className="my-6 sm:my-8 flex flex-col items-center justify-center flex-grow">
                    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-border/50 aspect-[9/16]">
                        <Image
                            src={imageUrl}
                            alt={`AI generated image for ${name}`}
                            width={1024}
                            height={768}
                            className="w-full h-full object-cover"
                            data-ai-hint="futuristic portrait"
                            unoptimized // Important for html2canvas to access the image
                        />
                    </div>
                     <div className="text-center mt-6">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">{name}</h3>
                        <p className="text-lg sm:text-xl text-primary font-semibold">{profession || 'Future Professional'}</p>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-base text-white/90 text-center">{description}</p>
                        </div>
                    </div>
                </main>
                
                <footer className="text-center pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">Created by MVAFutureself</p>
                </footer>
            </div>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl mt-4">
            <Button variant="outline" className="w-full h-12 text-base" asChild>
                <Link href="/">
                    <RefreshCw className="mr-2 h-4 w-4" /> Start New Journey
                </Link>
            </Button>
            <Button onClick={downloadCard} className="w-full h-12 text-base bg-gradient-button">
              <Download className="mr-2 h-4 w-4" /> Download My Card
            </Button>
      </div>
    </div>
  );
}
