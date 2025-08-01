
"use client";

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Download, RefreshCw, Sparkles } from 'lucide-react';
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

    // Temporarily remove shadow for cleaner capture
    const originalShadow = cardRef.current.style.boxShadow;
    cardRef.current.style.boxShadow = 'none';

    html2canvas(cardRef.current, {
      backgroundColor: null, 
      logging: false,
      useCORS: true, 
      scale: 2, 
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
    }).finally(() => {
        // Restore shadow after capture
        if (cardRef.current) {
            cardRef.current.style.boxShadow = originalShadow;
        }
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
        <div className="w-full max-w-2xl text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
                <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white">Your Future Unlocked!</h2>
            <p className="text-muted-foreground">Congratulations, {name}! Here is your AI-generated glimpse into a possible future.</p>
        </div>

        <div className="w-full max-w-4xl">
            <div 
              ref={cardRef} 
              className="w-full bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900/50 rounded-2xl border border-primary/20 p-1 shadow-2xl overflow-hidden"
            >
                <div className="bg-background/80 backdrop-blur-sm rounded-xl grid grid-cols-1 md:grid-cols-2">
                    {/* Left Column: Image */}
                    <div className="w-full aspect-[3/4]">
                        <Image
                            src={imageUrl}
                            alt={`AI generated image for ${name}`}
                            width={768}
                            height={1024}
                            className="w-full h-full object-cover rounded-l-xl"
                            data-ai-hint="futuristic portrait"
                            unoptimized
                        />
                    </div>
                    {/* Right Column: Content */}
                    <div className="flex flex-col p-6 sm:p-8 justify-between">
                        <div>
                             <header className="flex items-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0">
                                    MV
                                </div>
                                <span className="font-bold text-xl text-white flex items-center">
                                MVAFutureSelf
                                <Sparkles className="h-5 w-5 text-yellow-300 ml-1.5" />
                                </span>
                            </header>

                            <div className="text-left mb-6">
                                <h3 className="text-3xl sm:text-4xl font-bold text-white">{name}</h3>
                                <p className="text-xl sm:text-2xl text-primary font-semibold">{profession || 'Future Professional'}</p>
                            </div>
                            
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-base text-white/90 text-left">{description}</p>
                            </div>
                        </div>

                        <footer className="mt-8">
                             <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <Button variant="outline" className="w-full h-12 text-base" asChild>
                                    <Link href="/">
                                        <RefreshCw className="mr-2 h-4 w-4" /> Start Over
                                    </Link>
                                </Button>
                                <Button onClick={downloadCard} className="w-full h-12 text-base bg-gradient-button">
                                <Download className="mr-2 h-4 w-4" /> Download Card
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-4">Created by MVAFutureself</p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
