import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

type Props = {
  className?: string;
  /** Hiện chữ “nau.fleur” cạnh logo */
  showWordmark?: boolean;
  /** Kích thước logo (px) */
  size?: number;
};

export function MayFlowerLogo({ className = "", showWordmark = true, size = 36 }: Props) {
  const mark = (
    <span
      className="logo-mark-hover relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-gold/40 bg-paper"
      style={{ width: size, height: size }}
    >
      <Image
        src={BRAND.logoSrc}
        alt={BRAND.legalName}
        fill
        className="object-contain p-0.5"
        sizes={`${size}px`}
        priority={size >= 34}
      />
    </span>
  );

  if (!showWordmark) return <span className={className}>{mark}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      <span className="font-display text-xl leading-none tracking-tight text-umber">{BRAND.name}</span>
    </span>
  );
}

export function MayFlowerLogoLink(props: Omit<Props, "className"> & { className?: string }) {
  const { className, ...rest } = props;
  return (
    <Link href="/" className={`hover:opacity-90 ${className ?? ""}`}>
      <MayFlowerLogo {...rest} />
    </Link>
  );
}
