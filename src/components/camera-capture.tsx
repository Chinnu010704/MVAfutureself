
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (dataUri: string) => void;
  onRetake: () => void;
}

export function CameraCapture({ onCapture, onRetake }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'user' },
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
            setError("Camera permission was denied. Please allow camera access in your browser settings and refresh the page.");
        } else {
            setError("Could not access the camera. Please ensure it is not in use by another application.");
        }
      } else {
        setError("An unknown error occurred while trying to access the camera.");
      }
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    onRetake();
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setCapturedImage(dataUri);
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 bg-destructive/10 text-destructive rounded-lg">
        <p className="font-semibold">Camera Error</p>
        <p>{error}</p>
        <Button onClick={startCamera} className="mt-4" variant="destructive">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-lg aspect-[4/3] rounded-lg overflow-hidden bg-muted flex items-center justify-center border-2 border-dashed border-primary/20">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured or Uploaded" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        {!stream && !capturedImage && !error && <p className="text-muted-foreground">Starting camera...</p>}
      </div>
       <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png, image/jpeg"
          className="hidden"
        />
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={handleRetake} className="w-full">
              <RefreshCw /> Retake or Re-upload
            </Button>
            <Button onClick={handleConfirm} className="w-full">Confirm and Generate</Button>
          </>
        ) : (
          <>
             <Button onClick={handleCapture} disabled={!stream} className="w-full">
                <Camera /> Capture
              </Button>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload /> Upload Image
              </Button>
          </>
        )}
      </div>
    </div>
  );
}
