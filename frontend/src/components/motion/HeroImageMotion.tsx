"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  children?: ReactNode;
};

export function HeroImageMotion({ src, alt, sizes, priority, children }: Props) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-black/5 md:aspect-[3/4]">
      <div className="hero-ken-burns absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes={sizes}
        />
      </div>
      {children}
    </div>
  );
}
