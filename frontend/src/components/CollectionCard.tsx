import Link from "next/link";
import Image from "next/image";
import type { CollectionSummary } from "@may-flower/shared";
import { Reveal } from "@/components/motion/Reveal";

export function CollectionCard({
  collection,
  revealDelay = 0,
}: {
  collection: CollectionSummary;
  revealDelay?: number;
}) {
  return (
    <Reveal delay={revealDelay}>
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-xl text-white ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-lg"
      style={{ backgroundColor: collection.palette }}
    >
      {collection.imageUrl ? (
        <Image
          src={collection.imageUrl}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      <div className="relative p-6">
        <p className="text-xs uppercase tracking-widest opacity-90">{collection.mood}</p>
        <h3 className="font-display mt-1 text-2xl">{collection.title}</h3>
        <p className="mt-2 text-sm opacity-90 line-clamp-2">{collection.story}</p>
      </div>
    </Link>
    </Reveal>
  );
}
