"use client";

interface LoadingScreenProps {
  isVisible: boolean;
  progress: number;
  loadedCount: number;
  totalCount: number;
}

export function LoadingScreen({
  isVisible,
  progress,
  loadedCount,
  totalCount,
}: LoadingScreenProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      {/* Loading Content */}
      <div className="flex flex-col items-center gap-8 px-6">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 border-t-primary animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Loading Faces
          </h2>
          <p className="text-muted-foreground text-sm">
            Preparing your avatar collection...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{loadedCount} / {totalCount}</span>
            <span>{progress}%</span>
          </div>
          
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
