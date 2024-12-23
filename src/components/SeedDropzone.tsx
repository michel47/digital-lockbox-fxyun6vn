import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { generateSeedFromImage } from '../lib/image';

interface SeedDropzoneProps {
  onSeedLoaded: (seed: string) => void;
}

export function SeedDropzone({ onSeedLoaded }: SeedDropzoneProps) {
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please drop an image file');
      return;
    }
    
    try {
      const seed = await generateSeedFromImage(file);
      onSeedLoaded(seed);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
    }
  }, [onSeedLoaded]);
  
  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drop any image here to initialize the lockbox
      </p>
    </div>
  );
}