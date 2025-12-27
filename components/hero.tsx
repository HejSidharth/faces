"use client";

import Image from "next/image";
import { LinkGenerator } from "./link-generator";

// Use static local icons for preview to avoid hydration mismatches
// Floating background faces (4 different ones)
const FLOATING_ICONS = [
  "/icon-2.png",
  "/icon-3.png",
  "/icon-4.png",
  "/icon-5.png",
];

// Preview stack faces (5 different ones, distinct from floating)
const PREVIEW_ICONS = [
  "/icon.png",
  "/icon-6.png",
  "/icon-2.png",
  "/icon-3.png",
  "/icon-4.png",
];

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
      {/* Animated face icons floating in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] animate-float opacity-20">
          <Image
            src={FLOATING_ICONS[0]}
            alt=""
            width={80}
            height={80}
            className="rounded-full"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div
          className="absolute top-32 right-[15%] animate-float opacity-20"
          style={{ animationDelay: "0.5s" }}
        >
          <Image
            src={FLOATING_ICONS[1]}
            alt=""
            width={60}
            height={60}
            className="rounded-full"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div
          className="absolute bottom-40 left-[20%] animate-float opacity-20"
          style={{ animationDelay: "1s" }}
        >
          <Image
            src={FLOATING_ICONS[2]}
            alt=""
            width={50}
            height={50}
            className="rounded-full"
            loading="lazy"
          />
        </div>
        <div
          className="absolute bottom-32 right-[10%] animate-float opacity-20"
          style={{ animationDelay: "1.5s" }}
        >
          <Image
            src={FLOATING_ICONS[3]}
            alt=""
            width={70}
            height={70}
            className="rounded-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
        {/* Badge */}
       

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground pt-20">
          Want to add fun faces
          <br />
          to your app?
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto leading-relaxed">
          Beautiful Notion-style avatar icons for your projects.
        </p>

        {/* Face Preview Stack */}
        <div className="flex items-center justify-center gap-1 mb-12">
          {PREVIEW_ICONS.map((url, index) => (
            <div
              key={index}
              className="relative w-12 h-12 rounded-full border-2 border-background overflow-hidden animate-scale-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                marginLeft: index > 0 ? "-8px" : "0",
                zIndex: 5 - index,
              }}
            >
              <Image
                src={url}
                alt=""
                width={48}
                height={48}
                className="w-full h-full object-cover"
                loading={index < 3 ? "eager" : "lazy"}
                fetchPriority={index < 3 ? "high" : "low"}
              />
            </div>
          ))}
          <span className="ml-3 text-sm text-muted-foreground">
            & many more...
          </span>
        </div>

        {/* Link Generator */}
        <LinkGenerator />

        {/* Scroll indicator */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
