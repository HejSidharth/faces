"use client";

import { useState, useCallback, useEffect, useRef, useMemo, memo } from "react";
import Image from "next/image";
import {
  FACE_URLS,
  APPWRITE_FACE_URLS,
  PRIORITY_FACE_COUNT,
} from "@/lib/face-urls";
import { useImagePreloader } from "@/lib/use-image-preloader";
import { LoadingScreen } from "@/components/loading-screen";
import { useToast } from "@/components/ui/toast";

interface FaceCardProps {
  imageUrl: string;
  copyUrl: string;
  index: number;
  isSelectMode: boolean;
  isSelected: boolean;
  isCopied: boolean;
  onCopy: (url: string) => void;
  onToggleSelect: (url: string) => void;
  isPriority: boolean;
}

// Memoized FaceCard component to prevent unnecessary re-renders
const FaceCard = memo(function FaceCard({
  imageUrl,
  copyUrl,
  index,
  isSelectMode,
  isSelected,
  isCopied,
  onCopy,
  onToggleSelect,
  isPriority,
}: FaceCardProps) {
  const handleClick = useCallback(() => {
    if (isSelectMode) {
      onToggleSelect(copyUrl);
      return;
    }

    onCopy(copyUrl);
  }, [copyUrl, isSelectMode, onCopy, onToggleSelect]);

  const shouldPrioritizeFetch = index < 2;

  return (
    <button
      onClick={handleClick}
      aria-pressed={isSelectMode ? isSelected : undefined}
      className={`face-card group relative aspect-square rounded-2xl bg-white border border-white/20 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl ${
        isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
      }`}
    >
      <Image
        src={imageUrl}
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
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 flex items-center justify-center ${
          isSelectMode || isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {isSelectMode ? (
          isSelected ? (
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
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )
        ) : isCopied ? (
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
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.copyUrl === nextProps.copyUrl &&
    prevProps.isSelectMode === nextProps.isSelectMode &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isCopied === nextProps.isCopied &&
    prevProps.index === nextProps.index &&
    prevProps.isPriority === nextProps.isPriority
  );
});

export function FaceGallery() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedCopyUrls, setSelectedCopyUrls] = useState<string[]>([]);
  const copyResetTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  const { progress, loadedCount, totalCount, priorityLoaded } =
    useImagePreloader({
      imageUrls: FACE_URLS,
      priorityCount: PRIORITY_FACE_COUNT,
    });

  const selectedCopyUrlSet = useMemo(
    () => new Set(selectedCopyUrls),
    [selectedCopyUrls]
  );

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
    toast({
      title: "Copied face URL",
      duration: 2000,
    });

    if (copyResetTimeoutRef.current !== null) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }

    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  }, [toast]);

  const handleToggleSelectMode = useCallback(() => {
    setCopiedUrl(null);
    setIsSelectMode((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedCopyUrls([]);
      }
      return next;
    });
  }, []);

  const handleToggleSelected = useCallback((url: string) => {
    setSelectedCopyUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedCopyUrls([]);
  }, []);

  const handleCopySelected = useCallback(() => {
    if (selectedCopyUrls.length === 0) {
      return;
    }

    const orderedSelectedUrls = APPWRITE_FACE_URLS.filter((url) =>
      selectedCopyUrlSet.has(url)
    );
    const jsonArray = JSON.stringify(orderedSelectedUrls, null, 2);
    navigator.clipboard.writeText(jsonArray);
    toast({
      title: `Copied ${orderedSelectedUrls.length} selected face${orderedSelectedUrls.length !== 1 ? "s" : ""}`,
    });
  }, [selectedCopyUrlSet, selectedCopyUrls.length, toast]);

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
              any face to copy its URL, or use Select mode for multi-select.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleToggleSelectMode}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background/70 hover:bg-muted transition-colors"
              >
                {isSelectMode ? "Done" : "Select"}
              </button>
              {isSelectMode ? (
                <>
                  <button
                    onClick={handleCopySelected}
                    disabled={selectedCopyUrls.length === 0}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Copy Selected ({selectedCopyUrls.length})
                  </button>
                  <button
                    onClick={handleClearSelection}
                    disabled={selectedCopyUrls.length === 0}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background/70 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Clear
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {FACE_URLS.map((imageUrl, index) => (
              <FaceCard
                key={imageUrl}
                imageUrl={imageUrl}
                copyUrl={APPWRITE_FACE_URLS[index]}
                index={index}
                isSelectMode={isSelectMode}
                isSelected={selectedCopyUrlSet.has(APPWRITE_FACE_URLS[index])}
                isCopied={!isSelectMode && copiedUrl === APPWRITE_FACE_URLS[index]}
                onCopy={handleCopy}
                onToggleSelect={handleToggleSelected}
                isPriority={index < PRIORITY_FACE_COUNT}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
