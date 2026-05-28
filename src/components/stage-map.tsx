"use client";

import { useMemo, useSyncExternalStore } from "react";
import { WombatMascot } from "@/components/wombat-mascot";
import { getRouteStyle } from "@/data/route-styles";
import type { Film, MovieRoute } from "@/data/routes";

type WatchedMap = Record<string, boolean>;

type StageMapProps = {
  route: MovieRoute;
};

const EMPTY_WATCHED: WatchedMap = {};
const STORAGE_EVENT = "moviekane-storage";
const watchedCache = new Map<string, { raw: string | null; value: WatchedMap }>();
const stagePositions = [0, 1, 2, 1, 0, 1, 2, 1];
const stageColumnClasses = [
  "md:col-start-1 md:justify-self-start",
  "md:col-start-2 md:justify-self-center",
  "md:col-start-3 md:justify-self-end",
];

function storageKey(slug: string) {
  return `moviekane:v1:${slug}`;
}

function readWatched(slug: string): WatchedMap {
  if (typeof window === "undefined") {
    return EMPTY_WATCHED;
  }

  const key = storageKey(slug);
  const raw = window.localStorage.getItem(key);
  const cached = watchedCache.get(key);

  if (cached?.raw === raw) {
    return cached.value;
  }

  try {
    const value = raw ? (JSON.parse(raw) as WatchedMap) : EMPTY_WATCHED;
    watchedCache.set(key, { raw, value });
    return value;
  } catch {
    watchedCache.set(key, { raw, value: EMPTY_WATCHED });
    return EMPTY_WATCHED;
  }
}

function writeWatched(slug: string, watched: WatchedMap) {
  const key = storageKey(slug);
  const raw = JSON.stringify(watched);

  watchedCache.set(key, { raw, value: watched });
  window.localStorage.setItem(key, raw);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function subscribeToWatched(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function difficultyLabel(value: Film["difficulty"]) {
  return ["", "가벼움", "편안함", "조금 낯섦", "천천히", "맥락 많음"][
    value
  ];
}

function LadderArrow({
  from,
  to,
  label,
  index,
}: {
  from: number;
  to: number;
  label: string;
  index: number;
}) {
  const mid = (from + to) / 2;

  return (
    <div className="relative h-16 md:h-24">
      <svg
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible text-foreground"
      >
        <defs>
          <marker
            id={`arrow-${index}`}
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M0,0 L8,4 L0,8" fill="none" stroke="currentColor" strokeWidth="2" />
          </marker>
        </defs>
        <path
          d={`M ${from} 7 C ${mid} 23 ${mid} 58 ${to} 73`}
          fill="none"
          markerEnd={`url(#arrow-${index})`}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${from + 1.2} 9 C ${mid - 2} 25 ${mid + 2} 56 ${to - 1.5} 70`}
          fill="none"
          opacity="0.35"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="absolute left-1/2 top-1/2 max-w-[260px] -translate-x-1/2 -translate-y-1/2 rotate-[-1deg] rounded-full bg-white/82 px-3 py-1 text-center text-xs font-semibold leading-5 text-foreground">
        {label}
      </p>
    </div>
  );
}

function MovieTicket({
  film,
  done,
  unlocked,
  accent,
  tintClass,
  textClass,
  onToggle,
}: {
  film: Film;
  done: boolean;
  unlocked: boolean;
  accent: string;
  tintClass: string;
  textClass: string;
  onToggle: () => void;
}) {
  return (
    <article
      className={`ladder-ticket rough-card-soft w-full max-w-[290px] bg-white p-4 transition ${
        unlocked ? "" : "opacity-45"
      }`}
    >
      <div className="mb-4 h-2 rounded-full" style={{ backgroundColor: accent }} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-muted">
            STAGE {film.stage}
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-tight">{film.title}</h2>
          <p className="mt-1 text-xs font-medium leading-5 text-muted">
            {film.year} · {film.director}
          </p>
        </div>
        <button
          type="button"
          disabled={!unlocked}
          onClick={onToggle}
          className={`rough-button shrink-0 px-3 py-1.5 text-xs font-bold transition ${
            done ? "bg-foreground text-white" : "bg-white text-foreground"
          } disabled:cursor-not-allowed disabled:bg-surface disabled:text-soft`}
          aria-pressed={done}
        >
          {done ? "봤다" : "봤어요"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${tintClass} ${textClass}`}>
          {difficultyLabel(film.difficulty)}
        </span>
        <span className="rounded-full bg-tint-sky px-2 py-1 text-[11px] font-bold text-brand-navy-mid">
          {film.pace}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm font-medium leading-6 text-muted">
        {unlocked
          ? film.reason
          : "앞 칸을 지나오면 이 칸이 조금 더 재밌게 열립니다."}
      </p>
    </article>
  );
}

export function StageMap({ route }: StageMapProps) {
  const style = getRouteStyle(route.routeTheme);

  const watched = useSyncExternalStore(
    subscribeToWatched,
    () => readWatched(route.slug),
    () => EMPTY_WATCHED,
  );

  const watchedCount = useMemo(
    () => route.films.filter((film) => watched[film.id]).length,
    [route.films, watched],
  );

  function isUnlocked(index: number) {
    return (
      index === 0 || route.films.slice(0, index).every((film) => watched[film.id])
    );
  }

  function toggleFilm(film: Film, checked: boolean) {
    const next = { ...watched };

    if (checked) {
      next[film.id] = true;
      writeWatched(route.slug, next);
      return;
    }

    for (const item of route.films) {
      if (item.stage >= film.stage) {
        delete next[item.id];
      }
    }

    writeWatched(route.slug, next);
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="rough-button bg-white px-4 py-2 text-sm font-bold">
          {watchedCount} / {route.totalStages} 감상
        </p>
        <div className="h-3 w-48 overflow-hidden rounded-full border-2 border-foreground bg-white">
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: style.accent,
              width: `${(watchedCount / route.totalStages) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="relative rounded-[32px] bg-white/42 p-4 sm:p-6">
        <WombatMascot
          mood="watching"
          className="pointer-events-none absolute bottom-2 right-2 hidden w-28 opacity-80 lg:block"
        />
        <ol className="relative z-10 grid gap-1">
          {route.films.map((film, index) => {
            const unlocked = isUnlocked(index);
            const done = Boolean(watched[film.id]);
            const position = stagePositions[index] ?? 1;
            const nextPosition = stagePositions[index + 1] ?? 1;
            const from = [17, 50, 83][position];
            const to = [17, 50, 83][nextPosition];

            return (
              <li key={film.id}>
                <div className="grid md:grid-cols-3">
                  <div className={stageColumnClasses[position]}>
                    <MovieTicket
                      film={film}
                      done={done}
                      unlocked={unlocked}
                      accent={style.accent}
                      tintClass={style.tintClass}
                      textClass={style.textClass}
                      onToggle={() => toggleFilm(film, !done)}
                    />
                  </div>
                </div>
                {index < route.films.length - 1 ? (
                  <LadderArrow
                    from={from}
                    to={to}
                    index={index}
                    label={film.connectionToNext}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
