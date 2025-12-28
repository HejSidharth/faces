"use client";

import { useState, useEffect, useCallback } from "react";
import { Hero } from "@/components/hero";
import { FaceGallery } from "@/components/face-gallery";
import { LoadingScreen } from "@/components/loading-screen";
import { FACE_URLS } from "@/lib/face-urls";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => setContentReady(true), 100);
  }, []);

  return (
    <>
      {isLoading && (
        <LoadingScreen
          onLoadComplete={handleLoadComplete}
          galleryUrls={FACE_URLS}
        />
      )}
      <main
        className={`min-h-screen bg-background noise transition-opacity duration-500 ${
          contentReady ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Hero Section */}
        <Hero />

        {/* Face Gallery */}
        <FaceGallery />
      </main>
    </>
  );
}
