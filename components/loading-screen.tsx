"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LOADING_FACES = [
  "/icon.png",
  "/icon-2.png",
  "/icon-3.png",
  "/icon-4.png",
  "/icon-5.png",
  "/icon-6.png",
];

interface LoadingScreenProps {
  onLoadComplete: () => void;
  galleryUrls: string[];
}

export function LoadingScreen({
  onLoadComplete,
  galleryUrls,
}: LoadingScreenProps) {
  const [facesDropped, setFacesDropped] = useState<boolean[]>(
    new Array(LOADING_FACES.length).fill(false)
  );
  const [showTitle, setShowTitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingScreenImagesLoaded, setLoadingScreenImagesLoaded] = useState(0);
  const [galleryImagesLoaded, setGalleryImagesLoaded] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  // Preload loading screen icons first and start animation
  useEffect(() => {
    const preloadLoadingScreenImages = async () => {
      // Preload the loading screen icons first
      const loadingPromises = LOADING_FACES.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue even if error
          img.src = src;
        });
      });

      await Promise.all(loadingPromises);

      // Start the face dropping animation
      LOADING_FACES.forEach((_, index) => {
        setTimeout(() => {
          setFacesDropped((prev) => {
            const next = [...prev];
            next[index] = true;
            return next;
          });
          setLoadingScreenImagesLoaded((prev) => prev + 1);
        }, index * 120);
      });
    };

    preloadLoadingScreenImages();
  }, []);

  // Preload ALL gallery images and track progress
  useEffect(() => {
    const preloadGalleryImages = async () => {
      let loadedCount = 0;
      const totalImages = galleryUrls.length;

      // Load all images and track progress
      const loadPromises = galleryUrls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              loadedCount++;
              setGalleryImagesLoaded(loadedCount);
              resolve();
            };
            img.onerror = () => {
              loadedCount++;
              setGalleryImagesLoaded(loadedCount);
              resolve(); // Continue even if error
            };
            img.src = src;
          })
      );

      await Promise.all(loadPromises);
      setAllImagesLoaded(true);
    };

    preloadGalleryImages();
  }, [galleryUrls]);

  // Show title after loading screen faces drop
  useEffect(() => {
    if (loadingScreenImagesLoaded === LOADING_FACES.length) {
      setTimeout(() => setShowTitle(true), 200);
    }
  }, [loadingScreenImagesLoaded]);

  // Fade out and complete only after ALL images are loaded
  useEffect(() => {
    if (showTitle && allImagesLoaded) {
      // Wait a bit for the user to see "all loaded", then fade out
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onLoadComplete, 600);
      }, 400);
    }
  }, [showTitle, allImagesLoaded, onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Faces dropping in */}
      <div className="flex items-end justify-center gap-3 mb-8 h-20">
        {LOADING_FACES.map((src, index) => (
          <div
            key={src}
            className={`transform transition-all duration-500 ease-out ${
              facesDropped[index]
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-24 opacity-0 scale-75"
            }`}
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-lg ${
                facesDropped[index] ? "animate-bounce-once" : ""
              }`}
              style={{
                animationDelay: `${index * 120 + 400}ms`,
              }}
            >
              <Image
                src={src}
                alt=""
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        ))}
      </div>

      {/* Title */}
      <div
        className={`text-center transform transition-all duration-700 ease-out ${
          showTitle ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Faces
        </h1>
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">
          By Hejamadi
        </p>
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">
          {allImagesLoaded
            ? "Ready!"
            : `Loading avatars... ${galleryImagesLoaded}/${galleryUrls.length}`}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
