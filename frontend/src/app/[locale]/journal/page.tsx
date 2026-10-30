import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { pexelsPhoto } from "@may-flower/shared";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journal" });
  return pageSeo({
    title: t("title"),
    description: t("subtitle"),
    pathname: "/journal",
    locale: locale as Locale,
  });
}

const posts = [
  {
    slug: "y-nghia-hoa-hong",
    titleKey: "post1Title" as const,
    excerptKey: "post1Excerpt" as const,
    imageId: 36388273,
    imageAltVi: "Hoa cẩm tú cầu tại Đà Nẵng",
    imageAltEn: "Hydrangeas in Da Nang",
  },
  {
    slug: "cham-hoa-tuoi",
    titleKey: "post2Title" as const,
    excerptKey: "post2Excerpt" as const,
    imageId: 35151100,
    imageAltVi: "Bình minh trên biển Mỹ Khê, Đà Nẵng",
    imageAltEn: "Sunrise at My Khe Beach, Da Nang",
  },
];

export default async function JournalPage() {
  const t = await getTranslations("journal");
  const locale = await getLocale();

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="mt-2 text-ink/70">{t("subtitle")}</p>
      </Reveal>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2">
        {posts.map((p, i) => {
          const alt = locale === "en" ? p.imageAltEn : p.imageAltVi;
          return (
            <li key={p.slug}>
              <Reveal delay={i * 80}>
                <Link
                  href={`/journal/${p.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pexelsPhoto(p.imageId, 800)}
                      alt={alt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 480px"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-xl group-hover:text-umber">{t(p.titleKey)}</h2>
                    <p className="mt-1 text-ink/70">{t(p.excerptKey)}</p>
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
