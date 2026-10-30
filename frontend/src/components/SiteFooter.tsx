import { getTranslations } from "next-intl/server";
import { MayFlowerLogo } from "@/components/MayFlowerLogo";
import { SocialLinks } from "@/components/SocialLinks";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-gold/30 bg-paper py-12">
      <div className="mx-auto max-w-6xl px-4 text-sm text-ink/60">
        <MayFlowerLogo size={32} className="text-umber" />
        <p className="mt-2">{t("tagline")}</p>
        <p className="mt-1 text-xs">{t("districts")}</p>
        <SocialLinks
          className="mt-4"
          labelInstagram={t("instagram")}
          labelFacebook={t("facebook")}
        />
        <p className="mt-6">{t("copyright", { year })}</p>
      </div>
    </footer>
  );
}
