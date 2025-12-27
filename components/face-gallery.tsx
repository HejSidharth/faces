"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { FACE_URLS } from "@/lib/face-urls";

interface FaceCardProps {
  url: string;
  index: number;
  copiedUrl: string | null;
  onCopy: (url: string) => void;
}

// Memoized FaceCard component to prevent unnecessary re-renders
const FaceCard = memo(function FaceCard({ url, index, copiedUrl, onCopy }: FaceCardProps) {
  const handleClick = useCallback(() => {
    onCopy(url);
  }, [url, onCopy]);

  // High priority for first 24 images (above the fold)
  const fetchPriority = index < 24 ? "high" : "low";

  return (
    <button
      onClick={handleClick}
      className="face-card group relative aspect-square rounded-2xl bg-white border border-white/20 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl"
    >
      <Image
        src={url}
        alt=""
        width={120}
        height={120}
        sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        unoptimized
        fetchPriority={fetchPriority}
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        {copiedUrl === url ? (
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </div>
    </button>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to only re-render if url changes or copied state changes for this specific card
  return (
    prevProps.url === nextProps.url &&
    prevProps.copiedUrl === nextProps.copiedUrl &&
    prevProps.index === nextProps.index
  );
});

export function FaceGallery() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Memoize the copy handler to prevent recreating it on every render
  const handleCopy = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }, []);

  // Memoize the URLs array to prevent unnecessary recalculations
  const faceUrls = useMemo(() => FACE_URLS, []);

  return (
    <section id="gallery" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Face Directory</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse through our collection of Notion-style avatar faces. Click any face to copy its URL.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {faceUrls.map((url, index) => (
            <FaceCard
              key={url}
              url={url}
              index={index}
              copiedUrl={copiedUrl}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
