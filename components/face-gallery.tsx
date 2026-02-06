"use client";

import { useState, useCallback, useEffect, useRef, memo } from "react";
import Image from "next/image";
import { FACE_URLS, PRIORITY_FACE_COUNT } from "@/lib/face-urls";
import { useImagePreloader } from "@/lib/use-image-preloader";
import { LoadingScreen } from "@/components/loading-screen";

interface FaceCardProps {
  url: string;
  index: number;
  isCopied: boolean;
  onCopy: (url: string) => void;
  isPriority: boolean;
}

// Memoized FaceCard component to prevent unnecessary re-renders
const FaceCard = memo(function FaceCard({
  url,
  index,
  isCopied,
  onCopy,
  isPriority,
}: FaceCardProps) {
  const handleClick = useCallback(() => {
    onCopy(url);
  }, [url, onCopy]);

  const shouldPrioritizeFetch = index < 2;

  return (
    <button
      onClick={handleClick}
      className="face-card group relative aspect-square rounded-2xl bg-white border border-white/20 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl"
    >
      <Image
        src={url}
        alt={`Avatar face ${index + 1}`}
        width={120}
        height={120}
        sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={shouldPrioritizeFetch ? "high" : "auto"}
        priority={shouldPrioritizeFetch}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        {isCopied ? (
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    </button>
  );
},
(prevProps, nextProps) => {
  // Custom comparison to only re-render when this specific card state changes.
  return (
    prevProps.url === nextProps.url &&
    prevProps.isCopied === nextProps.isCopied &&
    prevProps.index === nextProps.index &&
    prevProps.isPriority === nextProps.isPriority
  );
});

export function FaceGallery() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const copyResetTimeoutRef = useRef<number | null>(null);

  const { progress, loadedCount, totalCount, priorityLoaded } =
    useImagePreloader({
      imageUrls: FACE_URLS,
      priorityCount: PRIORITY_FACE_COUNT,
    });

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);

    if (copyResetTimeoutRef.current !== null) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }

    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  }, []);

  const showGallery = priorityLoaded;

  return (
    <>
      {/* Loading Screen - shows until priority images are loaded */}
      <LoadingScreen
        isVisible={!showGallery}
        progress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
      />

      {/* Gallery Section */}
      <section
        id="gallery"
        className={`py-24 px-6 transition-opacity duration-500 ${
          showGallery ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Face Directory
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Browse through our collection of Notion-style avatar faces. Click
              any face to copy its URL.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {FACE_URLS.map((url, index) => (
              <FaceCard
                key={url}
                url={url}
                index={index}
                isCopied={copiedUrl === url}
                onCopy={handleCopy}
                isPriority={index < PRIORITY_FACE_COUNT}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
