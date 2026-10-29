export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CollectionCard } from "@/components/CollectionCard";
import { Reveal } from "@/components/motion/Reveal";
import { getCollections } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("collections");
  return { title: t("title") };
}

export default async function CollectionsPage() {
  const t = await getTranslations("collections");
  const collections = await getCollections();

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <p className="mt-2 max-w-xl text-ink/70">{t("subtitle")}</p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <CollectionCard key={c.slug} collection={c} revealDelay={60 * i} />
        ))}
      </div>
    </div>
  );
}
