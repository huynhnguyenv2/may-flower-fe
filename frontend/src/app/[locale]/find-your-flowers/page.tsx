import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConciergeWizard } from "@/components/ConciergeWizard";
import { Reveal } from "@/components/motion/Reveal";
import type { Locale } from "@/i18n/config";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "concierge" });
  return pageSeo({
    title: t("title"),
    description: t("description"),
    pathname: "/find-your-flowers",
    locale: locale as Locale,
  });
}

export default async function FindYourFlowersPage() {
  const t = await getTranslations("concierge");

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-3xl text-ink mb-2">{t("title")}</h1>
        <p className="mb-8 max-w-lg text-ink/70">{t("description")}</p>
      </Reveal>
      <ConciergeWizard />
    </div>
  );
}
