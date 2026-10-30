import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SupportChatWidget } from "@/components/SupportChatWidget";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: {
      default: t("siteTitle"),
      template: `%s | ${BRAND.name}`,
    },
    description: t("siteDescription"),
    icons: {
      icon: [{ url: "/logo-mark.jpg", type: "image/jpeg" }],
      apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteHeader />
          <main className="animate-page-enter mx-auto min-h-[70vh] max-w-6xl px-4 py-8">
            {children}
          </main>
          <SiteFooter />
          <SupportChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
