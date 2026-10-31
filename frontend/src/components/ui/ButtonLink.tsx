import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-umber text-white hover:bg-umber/90 shadow-sm hover:shadow-md active:scale-[0.98]",
  secondary:
    "border border-umber/35 bg-white/80 text-umber hover:bg-white backdrop-blur-sm",
  ghost: "text-umber hover:bg-umber/5",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  href: ComponentProps<typeof Link>["href"];
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition duration-200 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
