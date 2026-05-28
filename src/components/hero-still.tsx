type HeroStillVariant = "seats" | "window" | "flare" | "screen" | "grain";

type HeroStillProps = {
  variant?: HeroStillVariant;
  className?: string;
};

const variantClass: Record<HeroStillVariant, string> = {
  seats: "film-still-seats",
  window: "film-still-window",
  flare: "film-still-flare",
  screen: "film-still-screen",
  grain: "film-still-grain",
};

export function HeroStill({
  variant = "grain",
  className = "",
}: HeroStillProps) {
  return (
    <span
      aria-hidden="true"
      className={`film-still ${variantClass[variant]} inline-block shrink-0 ${className}`}
    />
  );
}
