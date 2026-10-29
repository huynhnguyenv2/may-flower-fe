import Link from "next/link";

type Props = {
  className?: string;
  /** Hiện chữ “May Flower” cạnh biểu tượng */
  showWordmark?: boolean;
  /** Kích thước biểu tượng (px) */
  size?: number;
};

/** Logo vector — cánh hoa + sóng biển gợi Đà Nẵng */
export function MayFlowerLogo({ className = "", showWordmark = true, size = 36 }: Props) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-mark-hover shrink-0"
      aria-hidden={showWordmark}
      role={showWordmark ? undefined : "img"}
    >
      {!showWordmark ? <title>May Flower</title> : null}
      <circle cx="24" cy="24" r="23" className="fill-gold/25 stroke-gold/50" strokeWidth="1" />
      <path
        d="M24 8c2.5 6 2.5 10 0 16 2.5-4 6-6 10-6-6 2-10 6-10 10 0-4-4-8-10-10 4 0 7.5 2 10 6-2.5-6-2.5-10 0-16Z"
        className="fill-umber"
      />
      <path
        d="M6 34c8 2 14 2 18 0 4 2 10 2 18 0-6 4-14 6-18 6s-12-2-18-6Z"
        className="fill-gold/80"
      />
      <circle cx="24" cy="22" r="3.5" className="fill-paper" />
    </svg>
  );

  if (!showWordmark) return <span className={className}>{mark}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      <span className="font-display text-xl leading-none tracking-tight text-umber">
        May Flower
      </span>
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
