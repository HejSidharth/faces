"use client";

import { useState } from "react";
import { FACE_URLS } from "@/lib/face-urls";
import { useToast } from "@/components/ui/toast";

export function LinkGenerator() {
  const [count, setCount] = useState(5);
  const { toast } = useToast();

  const generateLinks = () => {
    // Shuffle and pick N random URLs
    const shuffled = [...FACE_URLS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, FACE_URLS.length));
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
              type="number"
              min="1"
              max={FACE_URLS.length}
              value={count}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setCount(Math.max(1, Math.min(val, FACE_URLS.length)));
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              / {FACE_URLS.length} available
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
