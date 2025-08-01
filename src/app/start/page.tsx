"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Baby, User } from "lucide-react";

export default function StartPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-transparent animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white font-headline tracking-tight">
          Let's Get Started
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
          Choose your age group to begin your journey into the future.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/create/child" className="group">
            <Card className="bg-black/30 bg-glass border-purple-500/20 hover:shadow-2xl h-full flex flex-col hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Baby className="w-8 h-8 text-primary" />
                  </div>
                  Ages 5-10
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-6">
                  Already have a dream job? Pick a profession and let's see you in action!
                </p>
                <div className="flex justify-end items-center text-primary font-semibold text-lg">
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/create/teen" className="group">
            <Card className="bg-black/30 bg-glass border-purple-500/20 hover:shadow-2xl h-full flex flex-col hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  Ages 11-17
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-6">
                  Unsure of your path? Discover a career that fits your personality by taking our quiz.
                </p>
                <div className="flex justify-end items-center text-primary font-semibold text-lg">
                  Take the Quiz
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
