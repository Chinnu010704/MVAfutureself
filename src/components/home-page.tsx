
"use client";

import { BrainCircuit, Briefcase, Sparkles, ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/5 h-full">
    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 mb-3">
      {icon}
    </div>
    <h3 className="font-bold text-lg mb-1 text-white">{title}</h3>
    <p className="text-sm text-purple-200/70">{description}</p>
  </div>
);

export function HomePage() {

  const handleStartJourney = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mva-futureself-visited', 'true');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 animate-fade-in">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        
        <Card className="w-full bg-black/30 bg-glass border-purple-500/20 shadow-2xl shadow-purple-500/10 rounded-2xl">
          <CardHeader className="pt-10 pb-4">
            <div className="mx-auto p-4 inline-block bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              MVAFutureSelf
            </h1>
            <p className="mt-2 text-lg text-purple-300/80">
              Powered by Skill Satron Technologies Pvt.Ltd
            </p>
          </CardHeader>
          <CardContent className="px-6 sm:px-10 pb-10">
            <p className="max-w-xl mx-auto text-base sm:text-lg text-white/80 mb-8">
              Discover your potential through AI-powered insights. Answer personalized questions and visualize your future self in your dream career.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <FeatureCard icon={<BrainCircuit size={24} />} title="AI Analysis" description="Smart questionnaire tailored to your age" />
              <FeatureCard icon={<Briefcase size={24} />} title="Career Matching" description="Discover careers that fit your interests" />
              <FeatureCard icon={<Bot size={24} />} title="Visual Future" description="See yourself in your dream profession" />
            </div>

            <Link href="/start" passHref>
              <Button onClick={handleStartJourney} size="lg" className="w-full max-w-xs mx-auto bg-gradient-button text-white font-bold text-lg rounded-xl h-14 shadow-lg shadow-purple-600/30 transition-all duration-300 transform hover:scale-105">
                Start Your Journey <ArrowRight className="ml-2" />
              </Button>
            </Link>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
