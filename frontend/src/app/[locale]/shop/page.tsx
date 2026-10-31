export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductCatalog } from "@/components/catalog/ProductCatalog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { getCollections, listProducts } from "@/lib/api";
import type { Locale } from "@/i18n/config";
import { pageSeo } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ collection?: string; feeling?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return pageSeo({
    title: t("title"),
    description: t("subtitle"),
    pathname: "/shop",
    locale: locale as Locale,
  });
}

export default async function ShopPage({ params, searchParams }: Props) {
  await params;
  const sp = await searchParams;
  const t = await getTranslations("shop");
  const [collections, products] = await Promise.all([
    getCollections(),
    listProducts({
      collection: sp.collection,
      feeling: sp.feeling,
    }),
  ]);

  return (
    <div>
      <Reveal>
        <SectionHeading title={t("title")} description={t("subtitle")} />
      </Reveal>
      <div className="mt-10">
        <ProductCatalog
          products={products}
          collections={collections}
          initialCollection={sp.collection}
          initialFeeling={sp.feeling}
        />
      </div>
    </div>
  );
}
