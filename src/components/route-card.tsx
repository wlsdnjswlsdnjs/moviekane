import Link from "next/link";
import type { MovieRoute } from "@/data/routes";
import { StillBlock } from "./still-block";

type RouteCardProps = {
  route: MovieRoute;
  compact?: boolean;
};

const routeStyles = {
  starter: {
    tone: "lavender",
    tint: "bg-tint-lavender",
    text: "text-brand-purple-800",
    bar: "bg-primary",
  },
  classic: {
    tone: "yellow",
    tint: "bg-tint-yellow",
    text: "text-brand-brown",
    bar: "bg-brand-yellow",
  },
  bong: {
    tone: "mint",
    tint: "bg-tint-mint",
    text: "text-brand-teal",
    bar: "bg-brand-teal",
  },
  genre: {
    tone: "peach",
    tint: "bg-tint-peach",
    text: "text-brand-orange",
    bar: "bg-brand-orange",
  },
} as const;

export function RouteCard({ route, compact = false }: RouteCardProps) {
  const lastFilm = route.films[route.films.length - 1];
  const style =
    routeStyles[route.routeTheme as keyof typeof routeStyles] ??
    routeStyles.starter;

  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-canvas soft-shadow transition hover:-translate-y-0.5">
      <div className={`h-1.5 ${style.bar}`} />
      <div className="grid gap-5 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-3">
          <p
            className={`w-fit rounded-md px-2 py-1 text-xs font-semibold ${style.tint} ${style.text}`}
          >
            {route.category}
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-foreground">
            {route.title}
          </h2>
        </div>
        <StillBlock
          className="h-14 w-20 shrink-0"
          label={route.routeTheme}
          tone={style.tone}
        />
      </div>
      <p className="text-sm leading-6 text-muted sm:text-base">
        {compact ? route.shortDescription : route.description}
      </p>
      <dl className="grid grid-cols-3 gap-2 rounded-lg bg-surface-soft p-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-soft">총 영화</dt>
          <dd className="mt-1 font-semibold">{route.totalStages}편</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-soft">난이도</dt>
          <dd className="mt-1 font-semibold">{route.difficultyLabel}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-soft">도착</dt>
          <dd className="mt-1 truncate font-semibold">{lastFilm.title}</dd>
        </div>
      </dl>
      <Link
        href={`/routes/${route.slug}`}
        className="inline-flex h-10 items-center justify-center rounded-md border border-line-strong bg-canvas px-4 text-sm font-medium text-foreground transition group-hover:border-primary group-hover:text-primary"
      >
        루트 보기
      </Link>
      </div>
    </article>
  );
}
