"use client";

import Image from 'next/image';
import { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-800">
        <Image
          src="/placeholder-car.jpg"
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-800 group">
      <Image
        src={images[currentIndex]}
        alt={`${alt} - Photo ${currentIndex + 1}`}
        fill
        priority
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      
      {/* Thumbnails */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-16 w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
              index === currentIndex
                ? 'border-amber-400 ring-2 ring-amber-400/50'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <Image
              src={images[index]}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-800 p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-800 p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

