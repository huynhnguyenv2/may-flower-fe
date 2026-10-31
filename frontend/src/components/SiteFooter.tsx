import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { MayFlowerLogo } from "@/components/MayFlowerLogo";
import { SocialLinks } from "@/components/SocialLinks";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gold/30 bg-paper py-14 md:mt-28">
      <Container>
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <MayFlowerLogo size={36} className="text-umber" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/70">{t("tagline")}</p>
            <p className="mt-2 text-xs text-ink/50">{t("districts")}</p>
            <SocialLinks
              className="mt-5"
              labelInstagram={t("instagram")}
              labelFacebook={t("facebook")}
            />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{t("explore")}</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-ink/75 hover:text-umber">
                  {tNav("shop")}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-ink/75 hover:text-umber">
                  {tNav("collections")}
                </Link>
              </li>
              <li>
                <Link href="/find-your-flowers" className="text-ink/75 hover:text-umber">
                  {tNav("concierge")}
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-ink/75 hover:text-umber">
                  {tNav("journal")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{t("service")}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink/75">
              <li>{t("deliveryNote")}</li>
              <li>{t("hours")}</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-gold/20 pt-6 text-xs text-ink/50">
          {t("copyright", { year })}
        </p>
      </Container>
    </footer>
  );
}
