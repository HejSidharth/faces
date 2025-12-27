"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Icon {
  face_id: string;
  url: string;
  notion_url: string;
}

interface IconGridProps {
  icons?: Icon[];
}

export function IconGrid({ icons: externalIcons }: IconGridProps) {
  const [icons, setIcons] = useState<Icon[]>(externalIcons || []);
  const [loading, setLoading] = useState(!externalIcons);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (externalIcons) {
      setIcons(externalIcons);
      setLoading(false);
      return;
    }

    fetch("/api/icons?count=12")
      .then((res) => res.json())
      .then((data) => {
        setIcons(data.icons || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [externalIcons]);

  if (!mounted || loading) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Loading icons...
      </div>
    );
  }

  if (icons.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 text-sm text-muted-foreground">
        Sample icons from the API
      </div>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
        {icons.map((icon) => (
          <div
            key={icon.face_id}
            className="group relative aspect-square overflow-hidden rounded-full bg-muted transition-all hover:scale-110 hover:ring-2 hover:ring-accent/50"
          >
            <Image
              src={icon.url}
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-cover"
              loading="lazy"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
