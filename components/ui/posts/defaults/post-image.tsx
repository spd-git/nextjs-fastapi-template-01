import { useEffect, useState } from 'react';
import { generateImage } from '@/components/actions/image-action';

interface PostImageProps {
  imagePrompt: string;
  alt: string;
}

export function PostImage({ imagePrompt, alt }: PostImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
        try {
            const result = await generateImage(imagePrompt);
            if (result && typeof result === 'object' && 'message' in result) {
                // Error case
                throw new Error('Failed to generate image');
            } else if (result) {
                // Success case - result is a string
                setImageSrc(`data:image/png;base64,${result}`);
            } else {
                throw new Error('No image data received');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    fetchImage();
  }, [imagePrompt]);

  if (isLoading) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center animate-pulse text-gray-500">
        Loading image...
      </div>
    );
  }

  if (hasError || !imageSrc) {
    return (
      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-red-500">
        Failed to load image
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-gray-100">
        <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
        />
    </div>
  );
}