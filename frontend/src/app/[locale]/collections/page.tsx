export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CollectionCard } from "@/components/CollectionCard";
import { Reveal } from "@/components/motion/Reveal";
import { getCollections } from "@/lib/api";
import type { Locale } from "@/i18n/config";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "collections" });
  return pageSeo({
    title: t("title"),
    description: t("subtitle"),
    pathname: "/collections",
    locale: locale as Locale,
  });
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
