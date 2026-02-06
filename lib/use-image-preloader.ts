"use client";

import { useState, useEffect, useCallback } from "react";

interface UseImagePreloaderOptions {
  imageUrls: string[];
  priorityCount?: number;
  onComplete?: () => void;
  onProgress?: (loaded: number, total: number) => void;
}

interface UseImagePreloaderReturn {
  isLoading: boolean;
  progress: number;
  loadedCount: number;
  totalCount: number;
  priorityLoaded: boolean;
  error: string | null;
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const PRIORITY_CONCURRENCY = 4;
const BACKGROUND_CONCURRENCY = 6;
const BACKGROUND_IDLE_TIMEOUT_MS = 1500;

/**
 * Preloads images and tracks loading progress
 * @param options - Configuration options
 * @returns Loading state and progress information
 */
export function useImagePreloader({
  imageUrls,
  priorityCount = 8,
  onComplete,
  onProgress,
}: UseImagePreloaderOptions): UseImagePreloaderReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [priorityLoaded, setPriorityLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCount = imageUrls.length;

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";

      img.onload = () => resolve();
      img.onerror = () => {
        // Don't fail on individual image errors, just log them
        console.warn(`Failed to preload image: ${url}`);
        resolve(); // Resolve anyway to not block other images
      };

      img.src = url;
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    let loadedImages = 0;
    let rafId: number | null = null;
    let idleId: number | null = null;
    let timeoutId: number | null = null;
    const idleWindow: IdleWindow | undefined =
      typeof window !== "undefined" ? (window as IdleWindow) : undefined;

    const flushProgress = () => {
      if (!isMounted) {
        return;
      }

      const nextProgress =
        totalCount === 0 ? 100 : Math.round((loadedImages / totalCount) * 100);
      setLoadedCount(loadedImages);
      setProgress(nextProgress);
      onProgress?.(loadedImages, totalCount);
    };

    const scheduleProgressUpdate = () => {
      if (!isMounted) {
        return;
      }

      if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
        if (rafId !== null) {
          return;
        }

        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          flushProgress();
        });
        return;
      }

      flushProgress();
    };

    const runWithConcurrency = async (
      urls: string[],
      concurrency: number,
      onItemLoaded?: () => void
    ) => {
      if (urls.length === 0) {
        return;
      }

      let nextIndex = 0;
      const workerCount = Math.max(1, Math.min(concurrency, urls.length));

      const worker = async () => {
        while (isMounted) {
          const currentIndex = nextIndex;
          nextIndex += 1;

          if (currentIndex >= urls.length) {
            return;
          }

          await preloadImage(urls[currentIndex]);
          if (!isMounted) {
            return;
          }

          loadedImages += 1;
          onItemLoaded?.();
          scheduleProgressUpdate();
        }
      };

      await Promise.all(Array.from({ length: workerCount }, worker));
    };

    const preloadAllImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadedCount(0);
        setProgress(0);
        setPriorityLoaded(false);

        if (totalCount === 0) {
          setPriorityLoaded(true);
          setIsLoading(false);
          onComplete?.();
          return;
        }

        const safePriorityCount = Math.min(priorityCount, totalCount);
        const priorityUrls = imageUrls.slice(0, safePriorityCount);
        const remainingUrls = imageUrls.slice(safePriorityCount);

        await runWithConcurrency(priorityUrls, PRIORITY_CONCURRENCY);
        if (!isMounted) {
          return;
        }

        setPriorityLoaded(true);

        const finalizeLoading = () => {
          if (!isMounted) {
            return;
          }

          flushProgress();
          setIsLoading(false);
          onComplete?.();
        };

        if (remainingUrls.length === 0) {
          finalizeLoading();
          return;
        }

        const loadRemaining = async () => {
          try {
            await runWithConcurrency(remainingUrls, BACKGROUND_CONCURRENCY);
            finalizeLoading();
          } catch (backgroundError) {
            if (!isMounted) {
              return;
            }

            setError(
              backgroundError instanceof Error
                ? backgroundError.message
                : "Failed to preload images"
            );
            setIsLoading(false);
          }
        };

        if (idleWindow?.requestIdleCallback) {
          idleId = idleWindow.requestIdleCallback(
            () => {
              void loadRemaining();
            },
            { timeout: BACKGROUND_IDLE_TIMEOUT_MS }
          );
        } else {
          timeoutId = window.setTimeout(() => {
            void loadRemaining();
          }, 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to preload images");
          setIsLoading(false);
        }
      }
    };

    void preloadAllImages();

    return () => {
      isMounted = false;
      if (rafId !== null && typeof window !== "undefined") {
        window.cancelAnimationFrame(rafId);
      }
      if (idleId !== null && idleWindow?.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [imageUrls, priorityCount, preloadImage, onComplete, onProgress, totalCount]);

  return {
    isLoading,
    progress,
    loadedCount,
    totalCount,
    priorityLoaded,
    error,
  };
}
