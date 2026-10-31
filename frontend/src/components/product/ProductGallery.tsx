"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string | null;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!imageUrl) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-gold/20 to-paper ring-1 ring-black/5" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        {!loaded ? (
          <div className="absolute inset-0 animate-pulse bg-gold/10" aria-hidden />
        ) : null}
        <Image
          src={imageUrl}
          alt={name}
          fill
          priority
          className={`object-cover transition duration-700 ${loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
