import { Reveal } from "./Reveal";

interface Props {
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: Props) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const lineMargin = align === "center" ? "mx-auto" : "";

  return (
    <Reveal className={`mb-16 ${alignClass}`}>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[3px] text-gold-500">
        {label}
      </p>
      <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-normal text-cream-100 md:text-4xl">
        {title}
      </h2>
      <div className={`mt-4 h-px w-12 bg-gold-500/40 ${lineMargin}`} />
      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-txt-muted">
          {description}
        </p>
      )}
    </Reveal>
  );
}
