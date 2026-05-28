type StillBlockProps = {
  className?: string;
  label?: string;
  tone?:
    | "gray"
    | "navy"
    | "peach"
    | "rose"
    | "mint"
    | "sky"
    | "lavender"
    | "yellow";
};

export function StillBlock({
  className = "",
  label,
  tone = "gray",
}: StillBlockProps) {
  return (
    <span
      aria-hidden={!label}
      className={`film-still still-tone-${tone} relative inline-flex overflow-hidden rounded-lg align-middle shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] ${className}`}
    >
      {label ? (
        <span className="relative z-10 m-auto rounded bg-white/75 px-1.5 py-0.5 font-mono text-[10px] uppercase text-foreground/80">
          {label}
        </span>
      ) : null}
    </span>
  );
}
