
"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface ResultCardProps {
  name: string;
  imageUrl: string;
  description: string;
}

export function ResultCard({ name, imageUrl, description }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const downloadCard = () => {
    if (!cardRef.current) {
        toast({ title: 'Error', description: 'Could not find card to download.', variant: 'destructive' });
        return;
    };

    const node = cardRef.current;
    const toastId = toast({ title: 'Preparing Download', description: 'Your card is being generated...' }).id;
    
    // We need to use an external library like html2canvas for this,
    // but per instructions we avoid adding new libs.
    // A pure canvas implementation is very complex to replicate DOM styling.
    // This will be a simplified version.
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        toast({ title: 'Error', description: 'Canvas not supported.', variant: 'destructive', id: toastId });
        return;
    }

    const scale = 2;
    const padding = 20 * scale;
    const imageAspectRatio = 16 / 9;
    const cardWidth = 500 * scale;

    const generatedImage = new window.Image();
    generatedImage.crossOrigin = 'Anonymous';
    generatedImage.src = imageUrl;

    generatedImage.onload = () => {
        // Calculate total height
        const imageHeight = cardWidth / imageAspectRatio;
        
        ctx.font = `${16 * scale}px Inter, sans-serif`;
        const descriptionLines = wrapText(ctx, description, cardWidth - (2*padding));
        const textHeight = (30 + 20 + 20 + (descriptionLines.length * 20) + 30 + 20) * scale;
        
        canvas.width = cardWidth;
        canvas.height = imageHeight + textHeight;
        
        // Background
        ctx.fillStyle = '#f3e5f5'; // Light purple background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Image
        ctx.drawImage(generatedImage, 0, 0, cardWidth, imageHeight);
        
        let currentY = imageHeight + padding * 1.5;

        // Draw Name
        ctx.fillStyle = '#333';
        ctx.font = `bold ${24 * scale}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(name, cardWidth / 2, currentY);
        currentY += 40 * scale;

        // Draw Description
        ctx.fillStyle = '#555';
        ctx.font = `${16 * scale}px Inter, sans-serif`;
        let textY = currentY;
        descriptionLines.forEach(line => {
            ctx.fillText(line, cardWidth / 2, textY);
            textY += 20 * scale;
        });
        currentY = textY + 20 * scale;

        // Draw Watermark
        ctx.fillStyle = '#888';
        ctx.font = `italic ${14 * scale}px Inter, sans-serif`;
        ctx.fillText('Created by MVAFutureself', cardWidth / 2, currentY);

        // Trigger Download
        const link = document.createElement('a');
        link.download = `${name.toLowerCase().replace(' ', '-')}-futureself.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        toast({ title: 'Download Started!', description: 'Your future self card is on its way.', id: toastId});
    };
    
    generatedImage.onerror = () => {
        toast({ title: 'Error', description: 'Could not load generated image for download.', variant: 'destructive', id: toastId });
    }
  };
  
  const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    let lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div ref={cardRef} className="w-full max-w-lg">
        <Card className="overflow-hidden shadow-2xl">
          <CardHeader className="p-0">
            <div className="aspect-video relative w-full bg-muted">
              <Image
                src={imageUrl}
                alt={`AI generated image for ${name}`}
                fill
                className="object-cover"
                data-ai-hint="futuristic portrait"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <CardTitle className="text-3xl font-bold text-primary mb-2">{name}</CardTitle>
            <p className="text-muted-foreground">{description}</p>
          </CardContent>
          <CardFooter className="bg-primary/5 p-4">
              <p className="text-xs text-primary/70 mx-auto italic">Created by MVAFutureself</p>
          </CardFooter>
        </Card>
      </div>

      <div className="flex gap-4 w-full max-w-lg">
        <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Start Over
            </Button>
        </Link>
        <Button onClick={downloadCard} className="w-full">
          <Download className="mr-2 h-4 w-4" /> Download Card
        </Button>
      </div>
    </div>
  );
}
