export const dynamic = "force-dynamic";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  DA_NANG_HERO,
  DA_NANG_STORY_GALLERY,
  mediaPhoto,
} from "@may-flower/shared";
import { CollectionCard } from "@/components/CollectionCard";
import { Container, FullBleed } from "@/components/layout/Container";
import { HeroImageMotion } from "@/components/motion/HeroImageMotion";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCollections, getFeaturedProducts } from "@/lib/api";

const OCCASIONS = [
  { key: "birthday", href: "/shop?feeling=mung" },
  { key: "thanks", href: "/shop?feeling=cam-on" },
  { key: "love", href: "/shop?feeling=vi-thuong" },
  { key: "sorry", href: "/shop?feeling=xin-loi" },
  { key: "miss", href: "/shop?feeling=nho-ban" },
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");
  const collections = await getCollections();
  const emotional = collections.filter((c) => c.kind === "emotional");
  const seasonal = collections.filter((c) => c.kind === "seasonal");
  const signature = collections.filter((c) => c.kind === "signature");
  const featured = await getFeaturedProducts();

  return (
    <div className="-mt-6 space-y-20 pb-8 md:-mt-8 md:space-y-28">
      <FullBleed>
        <section className="relative min-h-[88vh] overflow-hidden bg-ink">
          <Image
            src={mediaPhoto(DA_NANG_HERO, 1600)}
            alt={DA_NANG_HERO.alt}
            fill
            priority
            className="object-cover opacity-75"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
          <Container className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:pb-24">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold/90">
                {t("studioTag")}
              </p>
              <h1 className="font-display mt-4 max-w-3xl text-4xl leading-[1.08] text-white md:text-6xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{t("heroSubtitle")}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/find-your-flowers" variant="primary" className="bg-white text-umber hover:bg-white/95">
                  {t("ctaConcierge")}
                </ButtonLink>
                <ButtonLink href="/shop" variant="secondary" className="border-white/40 text-white hover:bg-white/10">
                  {t("ctaShop")}
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </section>
      </FullBleed>

      <Container>
        <SectionHeading eyebrow={t("occasionsEyebrow")} title={t("occasionsTitle")} />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {OCCASIONS.map((o, i) => (
            <Reveal key={o.key} delay={60 * i}>
              <Link
                href={o.href}
                className="group flex min-h-[120px] flex-col justify-end rounded-2xl bg-white p-4 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="font-display text-lg text-ink group-hover:text-umber">
                  {t(`occasions.${o.key}`)}
                </span>
                <span className="mt-1 text-xs text-ink/50">{t("occasionsBrowse")}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container>
        <SectionHeading
          title={t("emotionalTitle")}
          description={t("emotionalDesc")}
          action={<ButtonLink href="/collections" variant="ghost">{t("viewAllCollections")}</ButtonLink>}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emotional.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} revealDelay={80 * i} />
          ))}
        </div>
      </Container>

      {seasonal.length > 0 ? (
        <Container>
          <SectionHeading title={t("seasonalTitle")} description={t("seasonalDesc")} />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {seasonal.slice(0, 2).map((c, i) => (
              <CollectionCard key={c.slug} collection={c} revealDelay={100 * i} />
            ))}
          </div>
        </Container>
      ) : null}

      <Container>
        <SectionHeading
          title={t("featuredTitle")}
          action={<ButtonLink href="/shop" variant="ghost">{t("ctaShop")}</ButtonLink>}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} revealDelay={70 * i} />
          ))}
        </div>
      </Container>

      <FullBleed>
        <section className="bg-umber py-16 md:py-20">
          <Container className="grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-gold/80">{t("customEyebrow")}</p>
              <h2 className="font-display mt-3 text-3xl text-white md:text-4xl">{t("customTitle")}</h2>
              <p className="mt-4 text-white/80 leading-relaxed">{t("customBody")}</p>
              <div className="mt-8">
                <ButtonLink href="/find-your-flowers" variant="primary" className="bg-gold text-ink hover:bg-gold/90">
                  {t("customCta")}
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <HeroImageMotion
                src={mediaPhoto(DA_NANG_STORY_GALLERY[0]!, 900)}
                alt={DA_NANG_STORY_GALLERY[0]!.alt}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </Reveal>
          </Container>
        </section>
      </FullBleed>

      {signature.length > 0 ? (
        <Container>
          <SectionHeading title={t("signatureTitle")} description={t("signatureDesc")} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {signature.map((c, i) => (
              <CollectionCard key={c.slug} collection={c} revealDelay={90 * i} />
            ))}
          </div>
        </Container>
      ) : null}

      <Container>
        <SectionHeading title={t("testimonialsTitle")} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {(["one", "two", "three"] as const).map((id, i) => (
            <Reveal key={id} delay={80 * i}>
              <blockquote className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-black/5">
                <p className="flex-1 text-ink/80 leading-relaxed italic">&ldquo;{t(`testimonials.${id}.quote`)}&rdquo;</p>
                <footer className="mt-4 text-sm font-medium text-umber">{t(`testimonials.${id}.name`)}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container>
        <Reveal>
          <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
            <div className="grid md:grid-cols-2 md:items-center">
              <div className="p-8 md:p-12">
                <h2 className="font-display text-2xl text-umber md:text-3xl">{t("storyTitle")}</h2>
                <p className="mt-4 text-ink/80 leading-relaxed">{t("storyBody")}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 p-4 md:p-6">
                {DA_NANG_STORY_GALLERY.map((img) => (
                  <div
                    key={`${img.source}-${img.id}`}
                    className="relative aspect-[4/5] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={mediaPhoto(img, 400)}
                      alt={img.alt}
                      fill
                      className="object-cover transition duration-700 hover:scale-[1.04]"
                      sizes="160px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      </Container>
    </div>
  );
}
