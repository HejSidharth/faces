"use client";

import { useState } from "react";
import { APPWRITE_FACE_URLS } from "@/lib/face-urls";
import { useToast } from "@/components/ui/toast";

const MIN_FACE_COUNT = 1;
const DEFAULT_FACE_COUNT = 5;

function clampFaceCount(value: number) {
  return Math.max(MIN_FACE_COUNT, Math.min(value, APPWRITE_FACE_URLS.length));
}

export function LinkGenerator() {
  const [countInput, setCountInput] = useState(String(DEFAULT_FACE_COUNT));
  const { toast } = useToast();

  const parsedCount = Number.parseInt(countInput, 10);
  const count = Number.isNaN(parsedCount)
    ? MIN_FACE_COUNT
    : clampFaceCount(parsedCount);

  const generateLinks = () => {
    // Shuffle and pick N random URLs
    const shuffled = [...APPWRITE_FACE_URLS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, APPWRITE_FACE_URLS.length));
  };

  const handleCountChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    setCountInput(digitsOnly);
  };

  const handleCountBlur = () => {
    setCountInput(String(count));
  };

  const handleGenerateAndCopy = () => {
    const urls = generateLinks();
    const jsonArray = JSON.stringify(urls, null, 2);
    navigator.clipboard.writeText(jsonArray);
    toast({
      title: `Copied ${urls.length} face${urls.length !== 1 ? "s" : ""}`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="code-block rounded-xl p-1">
        <div className="rounded-lg bg-muted/30 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">
              How many faces?
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={countInput}
              onChange={(e) => handleCountChange(e.target.value)}
              onBlur={handleCountBlur}
              className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              / {APPWRITE_FACE_URLS.length} available
            </span>
          </div>

          <button
            onClick={handleGenerateAndCopy}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
          >
            Generate & Copy
          </button>
        </div>
      </div>
    </div>
  );
}
