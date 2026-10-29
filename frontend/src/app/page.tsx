export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  DA_NANG_HERO,
  DA_NANG_STORY_GALLERY,
  pexelsPhoto,
} from "@may-flower/shared";
import { CollectionCard } from "@/components/CollectionCard";
import { HeroImageMotion } from "@/components/motion/HeroImageMotion";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { getCollections, getFeaturedProducts } from "@/lib/api";

export default async function HomePage() {
  const t = await getTranslations("home");
  const collections = await getCollections();
  const emotional = collections.filter((c) => c.kind === "emotional");
  const featured = await getFeaturedProducts();

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 py-8 md:grid-cols-2 md:py-12">
        <Reveal>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-umber/80">{t("studioTag")}</p>
            <h1 className="font-display mt-4 text-4xl leading-tight text-ink md:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg text-ink/75">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/find-your-flowers"
                className="rounded-full bg-umber px-6 py-3 text-sm font-medium text-white transition hover:bg-umber/90 hover:shadow-md"
              >
                {t("ctaConcierge")}
              </Link>
              <Link
                href="/collections"
                className="rounded-full border border-umber/40 px-6 py-3 text-sm font-medium text-umber transition hover:bg-white"
              >
                {t("ctaCollections")}
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <HeroImageMotion
            src={pexelsPhoto(DA_NANG_HERO.id, 1200)}
            alt={DA_NANG_HERO.alt}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </Reveal>
      </section>

      <section>
        <Reveal>
          <h2 className="font-display text-2xl text-ink">{t("emotionalTitle")}</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emotional.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} revealDelay={80 * i} />
          ))}
        </div>
      </section>

      <section>
        <Reveal>
          <h2 className="font-display text-2xl text-ink">{t("featuredTitle")}</h2>
        </Reveal>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} revealDelay={70 * i} />
          ))}
        </div>
      </section>

      <Reveal>
        <section className="rounded-2xl bg-white p-8 md:p-12 ring-1 ring-black/5">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-2xl text-umber">{t("storyTitle")}</h2>
              <p className="mt-4 max-w-xl text-ink/80 leading-relaxed">{t("storyBody")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {DA_NANG_STORY_GALLERY.map((img, i) => (
                <div
                  key={img.id}
                  className="relative aspect-[4/5] overflow-hidden rounded-xl ring-1 ring-black/5"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Image
                    src={pexelsPhoto(img.id, 600)}
                    alt={img.alt}
                    fill
                    className="object-cover transition duration-700 hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 220px"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
