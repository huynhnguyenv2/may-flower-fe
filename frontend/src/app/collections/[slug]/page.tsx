export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCollection } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const c = await getCollection(slug);
    return { title: c.title, description: c.story };
  } catch {
    return { title: "Bộ sưu tập" };
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  let collection;
  try {
    collection = await getCollection(slug);
  } catch {
    notFound();
  }

  return (
    <div>
      {collection.imageUrl ? (
        <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl ring-1 ring-black/5">
          <Image
            src={collection.imageUrl}
            alt={collection.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white md:p-10">
            <p className="text-xs uppercase tracking-widest opacity-90">{collection.mood}</p>
            <h1 className="font-display mt-1 text-3xl md:text-4xl">{collection.title}</h1>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm uppercase tracking-widest text-umber/80">{collection.mood}</p>
          <h1 className="font-display mt-2 text-4xl text-ink">{collection.title}</h1>
        </>
      )}
      <p className="mt-4 max-w-2xl text-lg text-ink/75">{collection.story}</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collection.products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
