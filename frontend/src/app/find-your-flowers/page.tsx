import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConciergeWizard } from "@/components/ConciergeWizard";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("concierge");
  return {
    title: t("title"),
    description: t("description"),
  };
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
