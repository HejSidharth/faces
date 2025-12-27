"use client";

import { Hero } from "@/components/hero";
import { FaceGallery } from "@/components/face-gallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-background noise">
      {/* Hero Section */}
      <Hero />

      {/* Face Gallery */}
      <FaceGallery />
    </main>
  );
}
