import "./globals.css";

/** Root shell; `<html>` lives in `[locale]/layout.tsx` for per-locale `lang` and SEO. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
