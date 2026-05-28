"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import type { Edge, Line, LineId, Station, TransferNote } from "@/data/movie-map";

type Transform = {
  x: number;
  y: number;
  scale: number;
};

type PointerPosition = {
  clientX: number;
  clientY: number;
};

type PinchState = {
  startDistance: number;
  startMidpointX: number;
  startMidpointY: number;
  origin: Transform;
  moved: boolean;
};

type MovieSubwayMapProps = {
  lines: Line[];
  stations: Station[];
  edges: Edge[];
  transferNotes: TransferNote[];
  completedStationIds?: string[];
  unavailableStationIds?: string[];
};

type TmdbProviderGroup = "flatrate" | "rent" | "buy" | "ads" | "free";

type TmdbProvider = {
  id: number;
  name: string;
  logoUrl: string | null;
};

type TmdbStationData = {
  movie: {
    tmdbId: number;
    title: string;
    originalTitle: string;
    overview: string | null;
    releaseDate: string | null;
    runtimeMinutes: number | null;
    posterUrl: string | null;
    tmdbUrl: string;
    genres: string[];
  };
  watch: {
    region: "KR";
    link: string | null;
    providers: Record<TmdbProviderGroup, TmdbProvider[]>;
  };
  attribution: {
    metadata: "TMDb";
    availability: "JustWatch via TMDb";
  };
};

type TmdbPanelState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: TmdbStationData }
  | { status: "missing-config"; message: string }
  | { status: "error"; message: string };

type TmdbRequestState = TmdbPanelState & {
  stationId: string | null;
};

type StartFinderStep = "question" | "result";

type StartFinderOption = {
  id: LineId;
  label: string;
  description: string;
  targetLineId: LineId;
  resultLines: [string, string];
};

type StationVoteValue = "fit" | "too_early" | "too_late" | "other_line";

type StationVoteRecord = {
  vote: StationVoteValue;
  votedAt: string;
};

type StationVotes = Record<string, StationVoteRecord>;

const MAP_WIDTH = 1680;
const MAP_HEIGHT = 1360;
const MIN_SCALE = 0.18;
const MAX_SCALE = 3.2;
const MOBILE_MAP_HEIGHT_RATIO = 0.52;
const MOBILE_MAP_MIN_HEIGHT = 400;
const MOBILE_MAP_MAX_HEIGHT = 480;
const MOBILE_MAP_PADDING = 12;
const MOBILE_MAP_BOUNDS_PADDING_X = 86;
const MOBILE_MAP_BOUNDS_PADDING_Y = 118;
const COMPACT_DESKTOP_TRANSFORM: Transform = { x: 26, y: -36, scale: 0.48 };
const DESKTOP_TRANSFORM: Transform = { x: 8, y: 28, scale: 0.58 };
const WIDE_DESKTOP_TRANSFORM: Transform = { x: 48, y: 28, scale: 0.64 };
const DESKTOP_PANEL_WIDTH = 420;
const CAMERA_FOCUS_DURATION_MS = 520;
const STATION_VOTES_STORAGE_KEY = "movie-subway-station-votes";
const FEEDBACK_ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? "";

type StartSuggestion = {
  stationId: string;
  title: string;
  description: string;
  lineId?: LineId;
};

const startSuggestions: StartSuggestion[] = [
  {
    stationId: "back-to-the-future",
    title: "백 투 더 퓨처",
    description: "일단 웃으면서 출발",
  },
  {
    stationId: "jaws",
    title: "죠스",
    description: "지금 봐도 잡아끄는 고전",
  },
  {
    stationId: "little-miss-sunshine",
    title: "리틀 미스 선샤인",
    description: "인물 따라가는 드라마",
    lineId: "drama",
  },
  {
    stationId: "the-bourne-identity",
    title: "본 아이덴티티",
    description: "바로 쫓기면서 출발",
  },
];

const startFinderOptions: StartFinderOption[] = [
  {
    id: "momentum",
    label: "일단 재밌어야 함",
    description: "생각하기 전에 빨려들고 싶은 날",
    targetLineId: "momentum",
    resultLines: [
      "일단 재밌어야 하는 사람은 여기서 타세요.",
      "생각하기 전에 이미 쫓기고 있습니다.",
    ],
  },
  {
    id: "intro",
    label: "가볍게 보고 싶음",
    description: "웃으면서 출발하고 싶은 날",
    targetLineId: "intro",
    resultLines: [
      "가볍게 타고 싶다면 여기서 출발하세요.",
      "영화가 만든 규칙을 따라가는 재미가 가장 편하게 열립니다.",
    ],
  },
  {
    id: "classic",
    label: "고전에 입문하고 싶음",
    description: "시민 케인 직행은 아직 무섭지만",
    targetLineId: "classic",
    resultLines: [
      "고전도 처음엔 바로 물리는 쪽부터.",
      "시민 케인 직행은 잠시 접어둡니다.",
    ],
  },
  {
    id: "drama",
    label: "보고 나서 좀 남는 게 좋음",
    description: "집 가는 길에 생각나는 영화가 좋은 날",
    targetLineId: "drama",
    resultLines: [
      "인물 따라가다 보면 마음이 열리는 쪽입니다.",
      "조용히 남는 영화가 좋다면 여기서 타세요.",
    ],
  },
];

const lineFocusCopy: Record<
  LineId,
  {
    title: string;
    description: string;
    start: string;
    transfer: string;
    terminal?: string;
  }
> = {
  intro: {
    title: "영화 좀 좋아해볼까선",
    description:
      "대중적 재미에서 출발해, 영화의 구조와 스타일을 조금씩 의식하게 되는 노선.",
    start: "백 투 더 퓨처",
    transfer: "트루먼 쇼, 위플래쉬",
    terminal: "이터널 선샤인",
  },
  classic: {
    title: "지금 봐도 재밌는 고전선",
    description:
      "오래됐지만 지금 봐도 바로 재미가 잡히는 영화들로 고전 문법에 익숙해지는 노선.",
    start: "죠스",
    transfer: "없음",
    terminal: "시민 케인",
  },
  drama: {
    title: "인물 따라가는 드라마선",
    description:
      "인물의 감정과 관계를 따라가며 영화의 깊이로 들어가는 노선.",
    start: "리틀 미스 선샤인",
    transfer: "트루먼 쇼",
    terminal: "하나 그리고 둘",
  },
  momentum: {
    title: "일단 재밌어야선",
    description:
      "현대 액션, 스릴러, 압박감으로 영화의 추진력을 체감하는 노선.",
    start: "본 아이덴티티",
    transfer: "위플래쉬",
    terminal: "존 윅 4",
  },
};

const stationTypeLabel: Record<Station["stationType"], string> = {
  start: "출발역",
  normal: "일반역",
  transfer: "환승역",
  terminal: "종착역",
};

const watchProviderGroups: Array<{ key: TmdbProviderGroup; label: string }> = [
  { key: "flatrate", label: "스트리밍" },
  { key: "rent", label: "대여" },
  { key: "buy", label: "구매" },
  { key: "free", label: "무료" },
  { key: "ads", label: "광고" },
];

const stationVoteOptions: Array<{
  vote: StationVoteValue;
  label: string;
  description: string;
}> = [
  {
    vote: "fit",
    label: "좋아요",
    description: "이 노선과 순서가 잘 맞아요.",
  },
  {
    vote: "other_line",
    label: "싫어요",
    description: "노선이나 순서가 좀 어색해요.",
  },
];

function isStationVoteValue(value: unknown): value is StationVoteValue {
  return (
    value === "fit" ||
    value === "too_early" ||
    value === "too_late" ||
    value === "other_line"
  );
}

function readStationVotes(): StationVotes {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STATION_VOTES_STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.entries(parsed as Record<string, Partial<StationVoteRecord>>).reduce(
      (votes, [stationId, record]) => {
        if (
          record &&
          typeof record === "object" &&
          isStationVoteValue(record.vote) &&
          typeof record.votedAt === "string"
        ) {
          votes[stationId] = {
            vote: record.vote,
            votedAt: record.votedAt,
          };
        }

        return votes;
      },
      {} as StationVotes,
    );
  } catch {
    return {};
  }
}

function writeStationVotes(votes: StationVotes) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STATION_VOTES_STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // Voting should never block browsing the map.
  }
}

function postStationVoteFeedback({
  station,
  vote,
  createdAt,
}: {
  station: Station;
  vote: StationVoteValue;
  createdAt: string;
}) {
  if (!FEEDBACK_ENDPOINT) {
    return;
  }

  void fetch(FEEDBACK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "station_vote",
      stationId: station.id,
      stationTitle: station.titleKo,
      lineIds: station.lines,
      vote,
      createdAt,
    }),
  }).catch(() => {
    // Local feedback has already been saved.
  });
}

function stationRoleLabel(station: Station) {
  return station.stationKind === "empty"
    ? "빈 역"
    : stationTypeLabel[station.stationType];
}

function stationMapLabel(station: Station) {
  return station.labelKo ?? station.titleKo;
}

function stationMeta(station: Station) {
  if (station.stationKind === "empty") {
    return "영화 선정 예정";
  }

  return station.titleEn;
}

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours <= 0) {
    return `${minutes}분`;
  }

  if (restMinutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${restMinutes}분`;
}

function StationInfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[92px_1fr] border-b border-line last:border-b-0">
      <dt className="bg-surface px-3 py-3 text-xs font-black text-muted">
        {label}
      </dt>
      <dd className="px-3 py-3 text-sm font-semibold leading-6 text-foreground">
        {children}
      </dd>
    </div>
  );
}

function ProviderChip({ provider }: { provider: TmdbProvider }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-2 rounded-[3px] border border-line bg-canvas px-2 py-1 text-xs font-black text-foreground">
      {provider.logoUrl ? (
        <Image
          src={provider.logoUrl}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 rounded-[3px] object-contain"
        />
      ) : (
        <span className="grid h-5 w-5 place-items-center rounded-[3px] bg-surface text-[10px]">
          {provider.name.slice(0, 1)}
        </span>
      )}
      <span>{provider.name}</span>
    </span>
  );
}

function TmdbPosterFrame({
  state,
  title,
}: {
  state: TmdbPanelState;
  title: string;
}) {
  const frameClassName =
    "ml-auto aspect-[2/3] w-[104px] overflow-hidden rounded-[3px] border border-line bg-surface sm:w-[128px]";

  if (state.status === "loading") {
    return <div className={frameClassName} aria-label="포스터 불러오는 중" />;
  }

  if (state.status !== "ready") {
    return null;
  }

  return (
    <div className={frameClassName}>
      {state.data.movie.posterUrl ? (
        <Image
          src={state.data.movie.posterUrl}
          alt={`${title} 포스터`}
          width={256}
          height={384}
          className="h-full w-full object-cover"
          priority={false}
        />
      ) : (
        <div className="grid h-full place-items-center px-3 text-center text-xs font-black text-muted">
          포스터 없음
        </div>
      )}
    </div>
  );
}

function TmdbAvailabilityPanel({ state }: { state: TmdbPanelState }) {
  if (state.status === "idle") {
    return null;
  }

  if (state.status === "loading") {
    return (
      <section className="grid gap-3 border-t border-line pt-5">
        <h3 className="text-xs font-black text-muted">감상 가능 서비스</h3>
        <div className="grid gap-2">
          <div className="h-4 w-32 rounded-full bg-surface" />
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-24 rounded-[3px] bg-surface" />
            <div className="h-8 w-28 rounded-[3px] bg-surface" />
          </div>
        </div>
      </section>
    );
  }

  if (state.status === "missing-config") {
    return (
      <section className="grid gap-2 border-t border-line pt-5">
        <h3 className="text-xs font-black text-muted">감상 가능 서비스</h3>
        <p className="text-sm font-semibold leading-6 text-muted">
          서버 환경변수에 TMDB_READ_ACCESS_TOKEN 또는 TMDB_API_KEY가 필요합니다.
        </p>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="grid gap-2 border-t border-line pt-5">
        <h3 className="text-xs font-black text-muted">감상 가능 서비스</h3>
        <p className="text-sm font-semibold leading-6 text-muted">{state.message}</p>
      </section>
    );
  }

  const providerSections = watchProviderGroups
    .map((group) => ({
      ...group,
      providers: state.data.watch.providers[group.key],
    }))
    .filter((group) => group.providers.length > 0);

  return (
    <section className="grid gap-4 border-t border-line pt-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-black text-muted">감상 가능 서비스</h3>
        <a
          href={state.data.movie.tmdbUrl}
          target="_blank"
          rel="noreferrer"
          className="mk-focus text-xs font-black text-foreground underline decoration-line underline-offset-4"
        >
          TMDb
        </a>
      </div>

      <div className="grid gap-3">
        {providerSections.length > 0 ? (
          providerSections.map((group) => (
            <div key={group.key} className="grid gap-2">
              <p className="text-[11px] font-black text-muted">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.providers.map((provider) => (
                  <ProviderChip key={provider.id} provider={provider} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm font-semibold leading-6 text-muted">
            감상 가능 정보가 아직 없습니다.
          </p>
        )}
      </div>

      <p className="text-[11px] font-semibold leading-5 text-muted">
        Metadata by {state.data.attribution.metadata}. Availability by{" "}
        {state.data.attribution.availability}.
      </p>
    </section>
  );
}

function RecommendationPosterFrame({
  state,
  title,
}: {
  state: TmdbPanelState;
  title: string;
}) {
  const frameClassName =
    "aspect-[2/3] w-28 overflow-hidden rounded-[3px] border border-line bg-surface shadow-[0_8px_18px_rgba(24,29,38,0.08)]";

  if (state.status === "ready" && state.data.movie.posterUrl) {
    return (
      <div className={frameClassName}>
        <Image
          src={state.data.movie.posterUrl}
          alt={`${title} 포스터`}
          width={256}
          height={384}
          className="h-full w-full object-cover"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`${frameClassName} grid place-items-center px-3 text-center text-xs font-black text-muted`}
      aria-label={
        state.status === "loading" ? "포스터 불러오는 중" : "포스터 준비 중"
      }
    >
      {state.status === "loading" ? "불러오는 중" : "포스터 없음"}
    </div>
  );
}

function StartStationFinderModal({
  open,
  step,
  options,
  lineById,
  selectedOption,
  station,
  line,
  previousStation,
  nextStation,
  tmdbState,
  onClose,
  onChoose,
  onBackToQuestion,
  onViewMap,
}: {
  open: boolean;
  step: StartFinderStep;
  options: StartFinderOption[];
  lineById: Map<string, Line>;
  selectedOption: StartFinderOption | null;
  station: Station | null;
  line: Line | null;
  previousStation: Station | null;
  nextStation: Station | null;
  tmdbState: TmdbPanelState;
  onClose: () => void;
  onChoose: (option: StartFinderOption) => void;
  onBackToQuestion: () => void;
  onViewMap: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/28 px-4 py-6 backdrop-blur-[2px]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-finder-title"
        className="relative w-full max-w-[440px] rounded-[6px] border border-line bg-canvas p-5 shadow-[0_22px_60px_rgba(24,29,38,0.22)] sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="mk-focus absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-[3px] border border-line bg-canvas text-sm font-black text-muted transition hover:bg-surface hover:text-foreground"
          aria-label="팝업 닫기"
        >
          ×
        </button>

        {step === "question" ? (
          <div className="grid gap-5">
            <h2
              id="start-finder-title"
              className="break-keep pr-8 text-2xl font-black leading-tight text-foreground"
            >
              오늘은 어떤 영화가 끌리나요?
            </h2>
            <div className="grid gap-2">
              {options.map((option) => {
                const optionLine = lineById.get(option.targetLineId);
                const lineColor = optionLine?.color ?? "var(--foreground)";

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChoose(option)}
                    className="mk-focus grid min-h-16 grid-cols-[64px_1fr] items-center gap-3 rounded-[3px] border border-line bg-canvas px-3 py-3 text-left transition hover:border-line-strong hover:bg-surface"
                  >
                    <span className="relative h-8" aria-hidden="true">
                      <span
                        className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full"
                        style={{ backgroundColor: lineColor }}
                      />
                      <span
                        className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-canvas shadow-[0_0_0_3px_var(--canvas)]"
                        style={{ borderColor: lineColor }}
                      />
                    </span>
                    <span className="grid min-w-0 gap-0.5">
                      <span
                        className="text-sm font-black"
                        style={{ color: lineColor }}
                      >
                        {option.label}
                      </span>
                      <span className="text-xs font-semibold leading-5 text-muted">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === "result" ? (
          selectedOption && station && line ? (
            <div className="grid gap-5">
              <div className="grid grid-cols-[1fr_auto] items-start gap-4 pr-8">
                <div className="grid min-w-0 gap-2">
                  <p className="text-xs font-black text-muted">오늘의 출발역은</p>
                  <h2
                    id="start-finder-title"
                    className="break-keep text-3xl font-black leading-tight text-foreground [overflow-wrap:anywhere]"
                  >
                    {stationMapLabel(station)}
                  </h2>
                  <p className="text-sm font-semibold leading-6 text-muted">
                    {selectedOption.resultLines[0]}
                    <br />
                    {selectedOption.resultLines[1]}
                  </p>
                </div>
                <RecommendationPosterFrame
                  state={tmdbState}
                  title={station.titleKo}
                />
              </div>

              <div className="grid gap-2">
                <div
                  className="h-1 rounded-full"
                  style={{ backgroundColor: line.color }}
                />
                <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
                  <div className="grid min-h-16 content-center gap-1 rounded-[3px] border border-line bg-surface px-2 py-2 text-left">
                    <span className="text-[10px] font-black text-muted">이전역</span>
                    <span className="break-words text-xs font-black text-foreground [overflow-wrap:anywhere]">
                      {previousStation ? stationMapLabel(previousStation) : "출발역"}
                    </span>
                  </div>
                  <div
                    className="grid min-h-16 min-w-24 place-items-center rounded-[3px] border-2 bg-canvas px-2 py-2 text-center"
                    style={{ borderColor: line.color }}
                  >
                    <span className="text-[10px] font-black text-muted">현재역</span>
                    <span className="break-words text-sm font-black text-foreground [overflow-wrap:anywhere]">
                      {stationMapLabel(station)}
                    </span>
                  </div>
                  <div className="grid min-h-16 content-center gap-1 rounded-[3px] border border-line bg-surface px-2 py-2 text-right">
                    <span className="text-[10px] font-black text-muted">다음역</span>
                    <span className="break-words text-xs font-black text-foreground [overflow-wrap:anywhere]">
                      {nextStation ? stationMapLabel(nextStation) : "종착역"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-line pt-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-black text-muted">탑승 노선</span>
                  <span className="font-black text-foreground">{line.name}</span>
                </div>
                <button
                  type="button"
                  onClick={onViewMap}
                  aria-label={`${station.titleKo} 노선도에서 보기`}
                  className="mk-focus inline-flex min-h-11 items-center justify-center rounded-[3px] bg-foreground px-4 text-sm font-black text-canvas transition hover:bg-primary"
                >
                  지도에서 보기
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 pr-8">
              <h2
                id="start-finder-title"
                className="text-2xl font-black text-foreground"
              >
                역 정보를 찾지 못했습니다.
              </h2>
              <button
                type="button"
                onClick={onBackToQuestion}
                className="mk-focus min-h-11 rounded-[3px] border border-line bg-canvas px-4 text-sm font-black text-foreground transition hover:bg-surface"
              >
                다시 고르기
              </button>
            </div>
          )
        ) : null}
      </section>
    </div>
  );
}

function StationPlacementVote({
  station,
  voteRecord,
  onVote,
}: {
  station: Station;
  voteRecord?: StationVoteRecord;
  onVote: (station: Station, vote: StationVoteValue) => void;
}) {
  return (
    <section className="grid gap-3 border-t border-line pt-5">
      <h3 className="text-xs font-black text-muted">이 역 배치 어때요?</h3>
      <div className="grid grid-cols-2 gap-2">
        {stationVoteOptions.map((option) => {
          const isActive = voteRecord?.vote === option.vote;

          return (
            <button
              key={option.vote}
              type="button"
              aria-pressed={isActive}
              aria-label={`${option.label}: ${option.description}`}
              onClick={() => onVote(station, option.vote)}
              className={`mk-focus min-h-10 rounded-[3px] border px-3 text-sm font-black transition ${
                isActive
                  ? "border-foreground bg-foreground text-canvas"
                  : "border-line bg-canvas text-foreground hover:bg-surface"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {voteRecord ? (
        <p className="text-xs font-semibold leading-5 text-muted">
          의견 접수됨. 영화 지하철은 계속 공사 중입니다.
        </p>
      ) : null}
    </section>
  );
}

function subscribeToViewport(callback: () => void) {
  window.addEventListener("resize", callback);

  return () => window.removeEventListener("resize", callback);
}

function getViewportWidth() {
  return window.innerWidth;
}

function getViewportHeight() {
  return window.innerHeight;
}

function getMobileMapHeight(viewportHeight: number) {
  return clamp(
    viewportHeight * MOBILE_MAP_HEIGHT_RATIO,
    MOBILE_MAP_MIN_HEIGHT,
    MOBILE_MAP_MAX_HEIGHT,
  );
}

function fitStationsToViewport(
  stations: Station[],
  viewportWidth: number,
  viewportHeight: number,
) {
  const minX = Math.min(...stations.map((station) => station.x));
  const maxX = Math.max(...stations.map((station) => station.x));
  const minY = Math.min(...stations.map((station) => station.y));
  const maxY = Math.max(...stations.map((station) => station.y));
  const left = Math.max(0, minX - MOBILE_MAP_BOUNDS_PADDING_X);
  const right = Math.min(MAP_WIDTH, maxX + MOBILE_MAP_BOUNDS_PADDING_X);
  const top = Math.max(0, minY - MOBILE_MAP_BOUNDS_PADDING_Y);
  const bottom = Math.min(MAP_HEIGHT, maxY + MOBILE_MAP_BOUNDS_PADDING_Y);
  const width = right - left;
  const height = bottom - top;
  const fitWidth = Math.max(viewportWidth - MOBILE_MAP_PADDING * 2, 1);
  const fitHeight = Math.max(viewportHeight - MOBILE_MAP_PADDING * 2, 1);
  const scale = clamp(
    Math.min(fitWidth / width, fitHeight / height),
    MIN_SCALE,
    MAX_SCALE,
  );

  return {
    x: (viewportWidth - width * scale) / 2 - left * scale,
    y: (viewportHeight - height * scale) / 2 - top * scale,
    scale,
  };
}

function getDefaultTransform(
  viewportWidth: number,
  viewportHeight: number,
  stations: Station[],
) {
  if (viewportWidth < 640) {
    return fitStationsToViewport(
      stations,
      viewportWidth,
      getMobileMapHeight(viewportHeight),
    );
  }

  if (viewportWidth < 1500) {
    return COMPACT_DESKTOP_TRANSFORM;
  }

  if (viewportWidth < 1800) {
    return DESKTOP_TRANSFORM;
  }

  return WIDE_DESKTOP_TRANSFORM;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function distanceBetween(a: PointerPosition, b: PointerPosition) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function midpointBetween(a: PointerPosition, b: PointerPosition) {
  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  };
}

function linePoints(line: Line, stationById: Map<string, Station>) {
  if (line.pathPoints?.length) {
    return line.pathPoints.map((point) => `${point.x},${point.y}`).join(" ");
  }

  return line.stationIds
    .map((stationId) => stationById.get(stationId))
    .filter((station): station is Station => Boolean(station))
    .map((station) => `${station.x},${station.y}`)
    .join(" ");
}

function makeStationFill(station: Station, lineById: Map<string, Line>) {
  const colors = station.lines
    .map((lineId) => lineById.get(lineId)?.color)
    .filter((color): color is string => Boolean(color));

  if (colors.length < 2) {
    return colors[0] ?? "var(--foreground)";
  }

  const step = 360 / colors.length;

  return `conic-gradient(${colors
    .map((color, index) => `${color} ${index * step}deg ${(index + 1) * step}deg`)
    .join(", ")})`;
}

function transferGuideText(
  station: Station,
  lineById: Map<string, Line>,
  currentLineId: LineId | null,
) {
  if (station.lines.length < 2) {
    return null;
  }

  const currentLine = currentLineId ? lineById.get(currentLineId) : undefined;
  const nextLine = station.lines
    .filter((lineId) => lineId !== currentLineId)
    .map((lineId) => lineById.get(lineId))
    .find((line): line is Line => Boolean(line));

  if (currentLine && nextLine) {
    return `이 역에서는 ${currentLine.shortName}에서 ${nextLine.shortName}으로 갈아탈 수 있습니다.`;
  }

  const names = station.lines
    .map((lineId) => lineById.get(lineId)?.shortName)
    .filter((name): name is string => Boolean(name));

  return `이 역에서는 ${names.join(" · ")} 사이를 갈아탈 수 있습니다.`;
}

function StationButton({
  station,
  active,
  completed,
  unavailable,
  dimmed,
  lineById,
  onSelect,
}: {
  station: Station;
  active: boolean;
  completed: boolean;
  unavailable: boolean;
  dimmed: boolean;
  lineById: Map<string, Line>;
  onSelect: () => void;
}) {
  const primaryLine = lineById.get(station.lines[0]);
  const nodeColor = primaryLine?.color ?? "var(--foreground)";
  const labelOffset = station.labelOffset ?? { x: 38, y: 0 };
  const isTransfer = station.stationType === "transfer" || station.lines.length > 1;
  const isStart = station.stationType === "start";
  const isTerminal = station.stationType === "terminal";
  const isUnavailable = unavailable || station.stationKind === "empty";
  const markerSize = active
    ? isTransfer
      ? 50
      : 44
    : isTransfer
      ? 44
      : isStart || isTerminal
        ? 38
        : 32;
  const hitSize = Math.max(markerSize + 56, 88);
  const anchorOffset = hitSize / 2;
  const labelX = anchorOffset + labelOffset.x;
  const labelY = anchorOffset + labelOffset.y;
  const roleBadge = isTransfer ? "환승" : isStart ? "출발" : isTerminal ? "종착" : null;
  const isProminentLabel = active || isTransfer || isTerminal;
  const badgeOffsetY =
    labelOffset.y < 0 && Math.abs(labelOffset.x) < 12
      ? markerSize / 2 + 15
      : -markerSize / 2 - 15;
  const labelTransform =
    Math.abs(labelOffset.x) < 8
      ? "translate(-50%, -50%)"
      : labelOffset.x < 0
        ? "translate(-100%, -50%)"
        : "translate(0, -50%)";
  const activeShadow = `0 0 0 6px var(--canvas), 0 0 0 13px ${nodeColor}40, 0 10px 22px rgba(24,29,38,0.16)`;
  const baseShadow = isTransfer
    ? "0 0 0 5px var(--canvas), 0 2px 8px rgba(24,29,38,0.16)"
    : "0 0 0 5px var(--canvas)";

  return (
    <button
      type="button"
      data-station-button
      aria-pressed={active}
      aria-disabled={isUnavailable}
      aria-label={`${station.titleKo} 역 정보 보기`}
      onClick={isUnavailable ? undefined : onSelect}
      className="mk-focus absolute overflow-visible"
      style={{
        left: station.x,
        top: station.y,
        width: hitSize,
        height: hitSize,
        transform: "translate(-50%, -50%)",
        opacity: isUnavailable ? 0.42 : dimmed ? 0.32 : 1,
      }}
    >
      <span
        className="absolute left-1/2 top-1/2 grid place-items-center rounded-full"
        style={{
          width: markerSize,
          height: markerSize,
          transform: "translate(-50%, -50%)",
          background: isTransfer ? makeStationFill(station, lineById) : "var(--canvas)",
          border: isTransfer
            ? "3px solid var(--canvas)"
            : `${isTerminal ? 6 : isStart ? 5 : 4}px solid ${nodeColor}`,
          boxShadow: active ? activeShadow : baseShadow,
        }}
      >
        {isTransfer ? (
          <>
            <span
              aria-hidden="true"
              className="absolute rounded-full bg-canvas"
              style={{
                inset: 7,
                boxShadow: `inset 0 0 0 3px ${nodeColor}22`,
              }}
            />
            <span
              aria-hidden="true"
              className="relative grid place-items-center rounded-full text-[11px] font-black text-canvas"
              style={{
                width: 16,
                height: 16,
                background: completed || active ? nodeColor : "var(--canvas)",
                color: "var(--canvas)",
                boxShadow: `0 0 0 3px ${completed || active ? nodeColor : "var(--canvas)"}`,
              }}
            >
              {completed ? "✓" : null}
            </span>
          </>
        ) : (
          <span
            aria-hidden="true"
            className="grid place-items-center rounded-full text-[11px] font-black text-canvas"
            style={{
              width: completed ? 17 : active ? 14 : isStart ? 10 : 0,
              height: completed ? 17 : active ? 14 : isStart ? 10 : 0,
              background: completed || active || isStart ? nodeColor : "transparent",
            }}
          >
            {completed ? "✓" : null}
          </span>
        )}
      </span>

      {roleBadge ? (
        <span
          className="absolute z-20 rounded-[3px] bg-canvas px-1.5 py-0.5 text-[10.5px] font-black leading-none shadow-[0_0_0_2px_var(--canvas)]"
          style={{
            left: anchorOffset,
            top: anchorOffset + badgeOffsetY,
            transform: "translate(-50%, -50%)",
            color: nodeColor,
            border: `1px solid ${nodeColor}`,
          }}
        >
          {roleBadge}
        </span>
      ) : null}

      <span
        className={`absolute z-10 w-max max-w-44 break-keep rounded-[3px] bg-canvas/96 px-1.5 py-0.5 leading-[1.25] text-foreground shadow-[0_0_0_2px_var(--canvas),0_2px_8px_rgba(24,29,38,0.06)] backdrop-blur ${
          active
            ? "text-[16px] font-black"
            : isProminentLabel
              ? "text-[15px] font-bold"
              : "text-[13.5px] font-semibold"
        }`}
        style={{
          left: labelX,
          top: labelY,
          transform: labelTransform,
          color: active ? nodeColor : "var(--foreground)",
        }}
      >
        {stationMapLabel(station)}
      </span>
    </button>
  );
}

export function MovieSubwayMap({
  lines,
  stations,
  edges,
  transferNotes,
  completedStationIds = [],
  unavailableStationIds = [],
}: MovieSubwayMapProps) {
  const stationById = useMemo(
    () => new Map(stations.map((station) => [station.id, station])),
    [stations],
  );
  const lineById = useMemo(
    () => new Map(lines.map((line) => [line.id, line])),
    [lines],
  );
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<LineId | null>(null);
  const [focusedLineId, setFocusedLineId] = useState<LineId | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<LineId | null>(null);
  const [tmdbState, setTmdbState] = useState<TmdbRequestState>({
    status: "idle",
    stationId: null,
  });
  const [stationVotes, setStationVotes] = useState<StationVotes>({});
  const [startFinderOpen, setStartFinderOpen] = useState(true);
  const [startFinderStep, setStartFinderStep] =
    useState<StartFinderStep>("question");
  const [selectedStartFinderOptionId, setSelectedStartFinderOptionId] =
    useState<LineId | null>(null);
  const [startFinderTmdbState, setStartFinderTmdbState] =
    useState<TmdbRequestState>({
      status: "idle",
      stationId: null,
    });
  const viewportWidth = useSyncExternalStore(
    subscribeToViewport,
    getViewportWidth,
    () => 1440,
  );
  const viewportHeight = useSyncExternalStore(
    subscribeToViewport,
    getViewportHeight,
    () => 900,
  );
  const defaultTransform = getDefaultTransform(
    viewportWidth,
    viewportHeight,
    stations,
  );
  const [customTransform, setCustomTransform] = useState<Transform | null>(null);
  const transform = customTransform ?? defaultTransform;
  const transformRef = useRef(transform);
  const mapViewportRef = useRef<HTMLDivElement | null>(null);
  const cameraAnimationTimeoutRef = useRef<number | null>(null);
  const [cameraTransitioning, setCameraTransitioning] = useState(false);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const activePointers = useRef<Map<number, PointerPosition>>(new Map());
  const pinchState = useRef<PinchState | null>(null);
  const suppressNextClick = useRef(false);
  const selectedStartFinderOption = selectedStartFinderOptionId
    ? startFinderOptions.find((option) => option.id === selectedStartFinderOptionId) ??
      null
    : null;
  const startFinderLine = selectedStartFinderOption
    ? lineById.get(selectedStartFinderOption.targetLineId) ?? null
    : null;
  const startFinderStationId =
    startFinderLine?.stationIds[0] ?? startFinderLine?.startStationId ?? null;
  const startFinderStation = startFinderStationId
    ? stationById.get(startFinderStationId) ?? null
    : null;
  const startFinderStationIndex =
    startFinderLine && startFinderStation
      ? startFinderLine.stationIds.indexOf(startFinderStation.id)
      : -1;
  const startFinderPreviousStation =
    startFinderLine && startFinderStationIndex > 0
      ? stationById.get(startFinderLine.stationIds[startFinderStationIndex - 1]) ?? null
      : null;
  const startFinderNextStation =
    startFinderLine &&
    startFinderStationIndex >= 0 &&
    startFinderStationIndex < startFinderLine.stationIds.length - 1
      ? stationById.get(startFinderLine.stationIds[startFinderStationIndex + 1]) ??
        null
      : null;
  const activeStartFinderTmdbState: TmdbPanelState =
    !startFinderStation
      ? { status: "idle" }
      : startFinderTmdbState.stationId === startFinderStation.id
        ? startFinderTmdbState
        : { status: "loading" };
  const selectedStation = selectedStationId
    ? stationById.get(selectedStationId) ?? null
    : null;
  const currentLineId =
    selectedStation && selectedLineId && selectedStation.lines.includes(selectedLineId)
      ? selectedLineId
      : selectedStation?.lines[0] ?? null;
  const currentLine = currentLineId ? lineById.get(currentLineId) : undefined;
  const focusedLine = focusedLineId ? lineById.get(focusedLineId) : undefined;
  const focusedLinePanel = focusedLineId ? lineFocusCopy[focusedLineId] : null;
  const inboundEdge = selectedStation
    ? edges.find(
        (edge) => edge.to === selectedStation.id && edge.lineId === currentLineId,
      )
    : undefined;
  const previousStation = inboundEdge
    ? stationById.get(inboundEdge.from) ?? null
    : null;
  const currentLineNextEdge =
    selectedStation && currentLineId
      ? edges.find(
          (edge) => edge.from === selectedStation.id && edge.lineId === currentLineId,
        )
      : undefined;
  const nextStation = currentLineNextEdge
    ? stationById.get(currentLineNextEdge.to) ?? null
    : null;
  const terminalStation = currentLine?.terminalStationId
    ? stationById.get(currentLine.terminalStationId) ?? null
    : null;
  const stationTransfers = selectedStation
    ? transferNotes.filter((note) => note.stationId === selectedStation.id)
    : [];
  const selectedTmdbStationId =
    selectedStation?.stationKind === "movie" ? selectedStation.id : null;
  const activeTmdbState: TmdbPanelState = !selectedTmdbStationId
    ? { status: "idle" }
    : tmdbState.stationId === selectedTmdbStationId
      ? tmdbState
      : { status: "loading" };
  const completedStationIdSet = useMemo(
    () => new Set(completedStationIds),
    [completedStationIds],
  );
  const unavailableStationIdSet = useMemo(
    () => new Set(unavailableStationIds),
    [unavailableStationIds],
  );

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    return () => {
      if (cameraAnimationTimeoutRef.current) {
        window.clearTimeout(cameraAnimationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setStationVotes(readStationVotes());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!selectedTmdbStationId) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/tmdb/station/${encodeURIComponent(selectedTmdbStationId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();

        if (!response.ok) {
          setTmdbState({
            status:
              payload.status === "missing_config" ? "missing-config" : "error",
            stationId: selectedTmdbStationId,
            message: payload.message ?? "TMDb 정보를 불러오지 못했습니다.",
          });
          return;
        }

        setTmdbState({
          status: "ready",
          stationId: selectedTmdbStationId,
          data: payload as TmdbStationData,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setTmdbState({
          status: "error",
          stationId: selectedTmdbStationId,
          message: "TMDb 정보를 불러오지 못했습니다.",
        });
      });

    return () => controller.abort();
  }, [selectedTmdbStationId]);

  useEffect(() => {
    if (
      !startFinderOpen ||
      startFinderStep !== "result" ||
      !startFinderStationId
    ) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/tmdb/station/${encodeURIComponent(startFinderStationId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();

        if (!response.ok) {
          setStartFinderTmdbState({
            status:
              payload.status === "missing_config" ? "missing-config" : "error",
            stationId: startFinderStationId,
            message: payload.message ?? "TMDb 정보를 불러오지 못했습니다.",
          });
          return;
        }

        setStartFinderTmdbState({
          status: "ready",
          stationId: startFinderStationId,
          data: payload as TmdbStationData,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setStartFinderTmdbState({
          status: "error",
          stationId: startFinderStationId,
          message: "TMDb 정보를 불러오지 못했습니다.",
        });
      });

    return () => controller.abort();
  }, [startFinderOpen, startFinderStep, startFinderStationId]);

  function lineIsInFocus(lineId: LineId) {
    return !focusedLineId || focusedLineId === lineId;
  }

  function stationIsInFocus(station: Station) {
    return (
      !focusedLineId ||
      station.lines.includes(focusedLineId) ||
      station.id === selectedStation?.id
    );
  }

  function toggleLineFocus(lineId: LineId) {
    setFocusedLineId((current) => (current === lineId ? null : lineId));
  }

  function mapViewportMetrics() {
    const rect = mapViewportRef.current?.getBoundingClientRect();
    const width = rect?.width ?? viewportWidth;
    const height =
      rect?.height ??
      (viewportWidth < 640
        ? getMobileMapHeight(viewportHeight)
        : Math.max(viewportHeight - 72, 1));
    const coveredPanelWidth =
      viewportWidth >= 640 ? Math.min(DESKTOP_PANEL_WIDTH, width) : 0;
    const visibleWidth = Math.max(width - coveredPanelWidth, 1);

    return {
      centerX: visibleWidth / 2,
      centerY: height / 2,
    };
  }

  function focusedStationScale() {
    if (viewportWidth < 640) {
      return 0.82;
    }

    if (viewportWidth < 1200) {
      return 0.96;
    }

    return 1.08;
  }

  function stationFocusedTransform(station: Station, scale?: number): Transform {
    const nextScale = clamp(scale ?? focusedStationScale(), MIN_SCALE, MAX_SCALE);
    const { centerX, centerY } = mapViewportMetrics();

    return {
      x: centerX - station.x * nextScale,
      y: centerY - station.y * nextScale,
      scale: nextScale,
    };
  }

  function animateMapTransform(nextTransform: Transform) {
    if (cameraAnimationTimeoutRef.current) {
      window.clearTimeout(cameraAnimationTimeoutRef.current);
    }

    setCameraTransitioning(true);
    setMapTransform(nextTransform);
    cameraAnimationTimeoutRef.current = window.setTimeout(() => {
      setCameraTransitioning(false);
      cameraAnimationTimeoutRef.current = null;
    }, CAMERA_FOCUS_DURATION_MS);
  }

  function stopCameraTransition() {
    if (cameraAnimationTimeoutRef.current) {
      window.clearTimeout(cameraAnimationTimeoutRef.current);
      cameraAnimationTimeoutRef.current = null;
    }

    setCameraTransitioning(false);
  }

  function focusStationOnMap(station: Station, scale?: number) {
    animateMapTransform(stationFocusedTransform(station, scale));
  }

  function selectStation(
    station: Station,
    preferredLineId?: LineId,
    options?: { focusMap?: boolean; scale?: number },
  ) {
    setSelectedStationId(station.id);
    const nextLineId =
      preferredLineId && station.lines.includes(preferredLineId)
        ? preferredLineId
        : undefined;

    setSelectedLineId((current) =>
      nextLineId ??
      (current && station.lines.includes(current) ? current : station.lines[0]),
    );

    if (options?.focusMap) {
      focusStationOnMap(station, options.scale);
    }
  }

  function selectStationById(
    stationId: string,
    preferredLineId?: LineId,
    options?: { focusMap?: boolean; scale?: number },
  ) {
    const station = stationById.get(stationId);

    if (station) {
      selectStation(station, preferredLineId, options);
    }
  }

  function openStartFinder() {
    setSelectedStartFinderOptionId(null);
    setStartFinderStep("question");
    setStartFinderOpen(true);
  }

  function chooseStartFinderOption(option: StartFinderOption) {
    const line = lineById.get(option.targetLineId);
    const stationId = line?.stationIds[0] ?? line?.startStationId ?? null;

    if (stationId) {
      setStartFinderTmdbState({
        status: "loading",
        stationId,
      });
    }

    setSelectedStartFinderOptionId(option.id);
    setStartFinderStep("result");
  }

  function viewStartFinderStationOnMap() {
    if (!startFinderStation || !startFinderLine) {
      return;
    }

    selectStation(startFinderStation, startFinderLine.id, {
      focusMap: true,
      scale: focusedStationScale(),
    });
    setFocusedLineId(startFinderLine.id);
    setStartFinderOpen(false);
  }

  function handleStationVote(station: Station, vote: StationVoteValue) {
    const votedAt = new Date().toISOString();
    const nextVotes = {
      ...stationVotes,
      [station.id]: {
        vote,
        votedAt,
      },
    };

    setStationVotes(nextVotes);
    writeStationVotes(nextVotes);
    postStationVoteFeedback({
      station,
      vote,
      createdAt: votedAt,
    });
  }

  function setMapTransform(nextTransform: Transform) {
    transformRef.current = nextTransform;
    setCustomTransform(nextTransform);
  }

  function pointerPair() {
    const pointers = Array.from(activePointers.current.values());

    if (pointers.length < 2) {
      return null;
    }

    return [pointers[0], pointers[1]] as const;
  }

  function startPinch(element: HTMLElement) {
    const pair = pointerPair();

    if (!pair) {
      return;
    }

    const [firstPointer, secondPointer] = pair;
    const rect = element.getBoundingClientRect();
    const midpoint = midpointBetween(firstPointer, secondPointer);
    const startDistance = distanceBetween(firstPointer, secondPointer);

    if (startDistance <= 0) {
      return;
    }

    dragState.current = null;
    pinchState.current = {
      startDistance,
      startMidpointX: midpoint.clientX - rect.left,
      startMidpointY: midpoint.clientY - rect.top,
      origin: transformRef.current,
      moved: false,
    };
  }

  function updatePinch(element: HTMLElement) {
    const pair = pointerPair();
    const pinch = pinchState.current;

    if (!pair || !pinch) {
      return;
    }

    const [firstPointer, secondPointer] = pair;
    const rect = element.getBoundingClientRect();
    const midpoint = midpointBetween(firstPointer, secondPointer);
    const currentMidpointX = midpoint.clientX - rect.left;
    const currentMidpointY = midpoint.clientY - rect.top;
    const currentDistance = distanceBetween(firstPointer, secondPointer);
    const scale = clamp(
      pinch.origin.scale * (currentDistance / pinch.startDistance),
      MIN_SCALE,
      MAX_SCALE,
    );
    const ratio = scale / pinch.origin.scale;

    if (
      Math.abs(currentDistance - pinch.startDistance) > 3 ||
      Math.hypot(
        currentMidpointX - pinch.startMidpointX,
        currentMidpointY - pinch.startMidpointY,
      ) > 4
    ) {
      pinch.moved = true;
    }

    setMapTransform({
      scale,
      x: currentMidpointX - (pinch.startMidpointX - pinch.origin.x) * ratio,
      y: currentMidpointY - (pinch.startMidpointY - pinch.origin.y) * ratio,
    });
  }

  function temporarilySuppressClick() {
    suppressNextClick.current = true;
    window.setTimeout(() => {
      suppressNextClick.current = false;
    }, 900);
  }

  function zoomAt(
    clientX: number,
    clientY: number,
    nextScale: number,
    element: HTMLElement,
  ) {
    const rect = element.getBoundingClientRect();
    const cursorX = clientX - rect.left;
    const cursorY = clientY - rect.top;
    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const origin = transformRef.current;
    const ratio = scale / origin.scale;

    setMapTransform({
      scale,
      x: cursorX - (cursorX - origin.x) * ratio,
      y: cursorY - (cursorY - origin.y) * ratio,
    });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    stopCameraTransition();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;

    zoomAt(
      event.clientX,
      event.clientY,
      transformRef.current.scale * delta,
      event.currentTarget,
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    stopCameraTransition();
    const target = event.target as HTMLElement;
    const isMapControlTarget = Boolean(
      target.closest("[data-station-button]") || target.closest("[data-line-focus]"),
    );

    if (isMapControlTarget && event.pointerType !== "touch") {
      return;
    }

    activePointers.current.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    });

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers may reject capture for interrupted touch sequences.
    }

    if (activePointers.current.size >= 2) {
      event.preventDefault();
      startPinch(event.currentTarget);
      return;
    }

    if (isMapControlTarget) {
      return;
    }

    const origin = transformRef.current;

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: origin.x,
      originY: origin.y,
      moved: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (activePointers.current.has(event.pointerId)) {
      activePointers.current.set(event.pointerId, {
        clientX: event.clientX,
        clientY: event.clientY,
      });
    }

    if (activePointers.current.size >= 2) {
      event.preventDefault();

      if (!pinchState.current) {
        startPinch(event.currentTarget);
      }

      updatePinch(event.currentTarget);
      return;
    }

    const drag = dragState.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (Math.hypot(deltaX, deltaY) > 4) {
      drag.moved = true;
    }

    setMapTransform({
      ...transformRef.current,
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    activePointers.current.delete(event.pointerId);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be gone after browser-level cancellation.
    }

    if (pinchState.current && activePointers.current.size < 2) {
      if (pinchState.current.moved) {
        temporarilySuppressClick();
      }

      pinchState.current = null;

      const remainingPointer = Array.from(activePointers.current.entries())[0];

      if (remainingPointer) {
        const [pointerId, pointer] = remainingPointer;
        const origin = transformRef.current;

        dragState.current = {
          pointerId,
          startX: pointer.clientX,
          startY: pointer.clientY,
          originX: origin.x,
          originY: origin.y,
          moved: true,
        };
      }

      return;
    }

    const drag = dragState.current;

    if (drag?.pointerId === event.pointerId) {
      if (!drag.moved && focusedLineId) {
        setFocusedLineId(null);
      }

      dragState.current = null;
    }
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppressNextClick.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressNextClick.current = false;
  }

  function nudgeZoom(delta: number) {
    const current = transformRef.current;

    stopCameraTransition();
    setMapTransform({
      ...current,
      scale: clamp(current.scale + delta, MIN_SCALE, MAX_SCALE),
    });
  }

  return (
    <section
      id="map"
      className="flex min-h-[calc(100svh-88px)] flex-col overflow-visible bg-canvas sm:relative sm:block sm:h-[calc(100vh-72px)] sm:min-h-0 sm:overflow-hidden"
    >
      <StartStationFinderModal
        open={startFinderOpen}
        step={startFinderStep}
        options={startFinderOptions}
        lineById={lineById}
        selectedOption={selectedStartFinderOption}
        station={startFinderStation}
        line={startFinderLine}
        previousStation={startFinderPreviousStation}
        nextStation={startFinderNextStation}
        tmdbState={activeStartFinderTmdbState}
        onClose={() => setStartFinderOpen(false)}
        onChoose={chooseStartFinderOption}
        onBackToQuestion={() => setStartFinderStep("question")}
        onViewMap={viewStartFinderStationOnMap}
      />

      <div
        ref={mapViewportRef}
        className="relative h-[52svh] min-h-[400px] max-h-[480px] cursor-grab overflow-hidden border-b border-line touch-none active:cursor-grabbing sm:absolute sm:inset-0 sm:h-auto sm:min-h-0 sm:max-h-none sm:border-b-0"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
      >
        <div
          className={`absolute left-0 top-0 ${
            cameraTransitioning ? "transition-transform duration-500 ease-out" : ""
          }`}
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            aria-hidden="true"
          >
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="var(--canvas)" />
            {lines.map((line) => {
              const isInFocus = lineIsInFocus(line.id);

              return (
                <polyline
                  key={`${line.id}-outer-casing`}
                  points={linePoints(line, stationById)}
                  fill="none"
                  stroke="rgba(24,29,38,0.16)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="28"
                  opacity={isInFocus ? 1 : 0.2}
                />
              );
            })}
            {lines.map((line) => {
              const isInFocus = lineIsInFocus(line.id);

              return (
                <polyline
                  key={`${line.id}-inner-casing`}
                  points={linePoints(line, stationById)}
                  fill="none"
                  stroke="var(--canvas)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="22"
                  opacity={isInFocus ? 1 : 0.28}
                />
              );
            })}
            {lines.map((line) => {
              const isInFocus = lineIsInFocus(line.id);
              const isHovered = hoveredLineId === line.id;
              const isEmphasized =
                currentLineId === line.id || focusedLineId === line.id || isHovered;

              return (
                <polyline
                  key={line.id}
                  points={linePoints(line, stationById)}
                  fill="none"
                  stroke={line.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isEmphasized ? "17" : "14"}
                  opacity={isInFocus ? (isEmphasized ? 1 : 0.92) : isHovered ? 0.45 : 0.2}
                />
              );
            })}
            {lines.map((line) => (
              <polyline
                key={`${line.id}-focus-hit-area`}
                data-line-focus="true"
                points={linePoints(line, stationById)}
                fill="none"
                stroke="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="44"
                className="cursor-pointer"
                pointerEvents="stroke"
                onMouseEnter={() => setHoveredLineId(line.id)}
                onMouseLeave={() => setHoveredLineId(null)}
                onClick={() => toggleLineFocus(line.id)}
              />
            ))}
          </svg>

          {lines.map((line) => {
            const startStation = stationById.get(line.startStationId);
            const terminalStation = stationById.get(line.terminalStationId);
            const terminalLabelFacesLeft =
              Boolean(terminalStation && terminalStation.x > MAP_WIDTH - 220);
            const isInFocus = lineIsInFocus(line.id) || hoveredLineId === line.id;

            if (!startStation || !terminalStation) {
              return null;
            }

            return (
              <div key={`${line.id}-label`} style={{ opacity: isInFocus ? 1 : 0.28 }}>
                <div
                  className="absolute rounded-[3px] bg-canvas/96 px-2 py-1 text-[12.5px] font-black shadow-[0_0_0_2px_var(--canvas)]"
                  style={{
                    color: line.color,
                    left: startStation.x - 20,
                    top: startStation.y - 72,
                  }}
                >
                  {line.shortName}
                </div>
                <div
                  className="absolute rounded-[3px] bg-canvas/96 px-2 py-1 text-[11.5px] font-semibold text-muted shadow-[0_0_0_2px_var(--canvas)]"
                  style={{
                    left: terminalStation.x + (terminalLabelFacesLeft ? -90 : 20),
                    top: terminalStation.y - 12,
                    transform: terminalLabelFacesLeft
                      ? "translate(-100%, 0)"
                      : undefined,
                  }}
                >
                  {stationMapLabel(terminalStation)} 방면
                </div>
              </div>
            );
          })}

          {stations.map((station) => (
            <StationButton
              key={station.id}
              station={station}
              active={station.id === selectedStation?.id}
              completed={completedStationIdSet.has(station.id)}
              unavailable={unavailableStationIdSet.has(station.id)}
              dimmed={!stationIsInFocus(station)}
              lineById={lineById}
              onSelect={() => selectStation(station)}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-auto absolute left-3 top-3 flex overflow-hidden rounded-md border border-line bg-canvas/94 shadow-[0_3px_10px_rgba(24,29,38,0.08)] backdrop-blur sm:left-5 sm:top-5">
        <button
          type="button"
          onClick={() => nudgeZoom(0.12)}
          className="mk-focus grid h-8 w-8 place-items-center border-r border-line text-base font-black text-foreground transition hover:bg-surface"
          aria-label="지도 확대"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => nudgeZoom(-0.12)}
          className="mk-focus grid h-8 w-8 place-items-center text-base font-black text-foreground transition hover:bg-surface"
          aria-label="지도 축소"
        >
          -
        </button>
      </div>

      {!startFinderOpen ? (
        <button
          type="button"
          onClick={openStartFinder}
          className="mk-focus pointer-events-auto absolute left-3 top-14 z-20 min-h-9 rounded-md border border-line bg-canvas/94 px-3 text-xs font-black text-foreground shadow-[0_3px_10px_rgba(24,29,38,0.08)] backdrop-blur transition hover:bg-surface sm:left-5 sm:top-16"
        >
          내 출발역 찾기
        </button>
      ) : null}

      <aside
        id="station-info"
        aria-label="영화역 정보"
        className="relative z-20 max-h-none overflow-visible border-t border-line bg-canvas/97 p-5 pb-[max(20px,env(safe-area-inset-bottom))] backdrop-blur sm:absolute sm:bottom-0 sm:left-auto sm:right-0 sm:top-0 sm:max-h-none sm:w-[min(100%,420px)] sm:overflow-auto sm:overscroll-contain sm:border-l sm:border-t-0 sm:p-7"
      >
        {selectedStation ? (
          <div className="grid gap-5">
            <header className="-mx-5 grid gap-3 border-b border-line bg-canvas/97 px-5 pb-5 backdrop-blur sm:sticky sm:top-0 sm:z-10 sm:-mx-7 sm:px-7">
              <div
                className={
                  selectedStation.stationKind === "movie"
                    ? "grid grid-cols-[minmax(0,1fr)_104px] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_128px]"
                    : "grid gap-3"
                }
              >
                <div className="grid min-w-0 gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                    <span
                      className="rounded-[3px] px-2 py-1 text-canvas"
                      style={{
                        backgroundColor: currentLine?.color ?? "var(--foreground)",
                      }}
                    >
                      {currentLine?.shortName ?? "노선"} ·{" "}
                      {stationRoleLabel(selectedStation)}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-24 rounded-full"
                    style={{ backgroundColor: currentLine?.color ?? "var(--foreground)" }}
                  />
                  <div className="grid gap-2">
                    <h2 className="break-keep text-2xl font-black leading-tight text-foreground [overflow-wrap:anywhere] sm:text-3xl">
                      {selectedStation.titleKo}
                    </h2>
                    <p className="text-sm leading-6 text-muted">
                      {stationMeta(selectedStation)}
                    </p>
                  </div>
                </div>
                {selectedStation.stationKind === "movie" ? (
                  <TmdbPosterFrame
                    state={activeTmdbState}
                    title={selectedStation.titleKo}
                  />
                ) : null}
              </div>
            </header>

            <section className="grid gap-3">
              <div
                className="h-1 rounded-full"
                style={{ backgroundColor: currentLine?.color ?? "var(--foreground)" }}
              />
              <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
                <button
                  type="button"
                  disabled={!previousStation || !currentLineId}
                  onClick={() => {
                    if (previousStation && currentLineId) {
                      selectStation(previousStation, currentLineId, {
                        focusMap: true,
                        scale: Math.max(transformRef.current.scale, focusedStationScale()),
                      });
                    }
                  }}
                  className="mk-focus grid min-h-20 content-center gap-1 rounded-[3px] border border-line bg-surface px-3 py-3 text-left transition enabled:hover:bg-canvas disabled:opacity-45"
                >
                  <span className="text-[11px] font-black text-muted">이전역</span>
                  <span className="break-words text-sm font-black text-foreground [overflow-wrap:anywhere]">
                    {previousStation ? stationMapLabel(previousStation) : "출발역"}
                  </span>
                </button>

                <div className="grid min-w-24 place-items-center rounded-[3px] border-2 bg-canvas px-3 py-3 text-center shadow-[0_0_0_3px_var(--canvas)]"
                  style={{ borderColor: currentLine?.color ?? "var(--foreground)" }}
                >
                  <span className="text-[11px] font-black text-muted">현재역</span>
                  <span className="break-words text-base font-black text-foreground [overflow-wrap:anywhere]">
                    {stationMapLabel(selectedStation)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!nextStation || !currentLineId}
                  onClick={() => {
                    if (nextStation && currentLineId) {
                      selectStation(nextStation, currentLineId, {
                        focusMap: true,
                        scale: Math.max(transformRef.current.scale, focusedStationScale()),
                      });
                    }
                  }}
                  className="mk-focus grid min-h-20 content-center gap-1 rounded-[3px] border border-line bg-surface px-3 py-3 text-right transition enabled:hover:bg-canvas disabled:opacity-45"
                >
                  <span className="text-[11px] font-black text-muted">다음역</span>
                  <span className="break-words text-sm font-black text-foreground [overflow-wrap:anywhere]">
                    {nextStation ? stationMapLabel(nextStation) : "종착역"}
                  </span>
                </button>
              </div>
            </section>

            <section className="grid gap-3 border-t border-line pt-5">
              <h3 className="text-xs font-black text-muted">역 정보</h3>
              <dl className="overflow-hidden rounded-[3px] border border-line">
                <StationInfoRow label="노선">
                  {currentLine?.name ?? "연결 노선"}
                </StationInfoRow>
                <StationInfoRow label="방면">
                  {terminalStation ? `${stationMapLabel(terminalStation)} 방면` : "종착"}
                </StationInfoRow>
                <StationInfoRow label="소요시간">
                  {formatRuntime(selectedStation.runtimeMinutes)}
                </StationInfoRow>
                <StationInfoRow label="역 특징">
                  {selectedStation.skill}
                </StationInfoRow>
                <StationInfoRow label="다음 안내">
                  {currentLineNextEdge?.reason ?? "이 노선의 종착역입니다."}
                </StationInfoRow>
              </dl>
            </section>

            {selectedStation.lines.length > 1 ? (
              <section className="grid gap-3 border-t border-line pt-5 text-muted">
                <h3 className="text-sm font-bold text-muted">환승 안내</h3>
                <p className="text-sm leading-6 text-muted">
                  {transferGuideText(selectedStation, lineById, currentLineId)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.lines.map((lineId) => {
                    const line = lineById.get(lineId);
                    const isActive = currentLineId === lineId;

                    if (!line) {
                      return null;
                    }

                    return (
                      <button
                        key={line.id}
                        type="button"
                        onClick={() => setSelectedLineId(line.id)}
                        className="mk-focus rounded-[3px] border px-2.5 py-1.5 text-xs font-black transition hover:bg-surface"
                        style={{
                          borderColor: line.color,
                          backgroundColor: isActive ? line.color : "var(--canvas)",
                          color: isActive ? "var(--canvas)" : line.color,
                        }}
                      >
                        {line.shortName}
                      </button>
                    );
                  })}
                </div>
                {stationTransfers.map((note) => (
                  <p key={note.stationId} className="text-sm leading-6 text-muted">
                    {note.reason}
                  </p>
                ))}
              </section>
            ) : null}

            <section className="grid gap-3 border-t border-line pt-5 text-muted">
              <h3 className="text-sm font-bold text-muted">역내 시설</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[3px] border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section id="lines" className="grid gap-3 border-t border-line pt-5">
              <h3 className="text-xs font-black text-muted">노선 바로가기</h3>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {lines.map((line) => {
                  const isActive = currentLineId === line.id;

                  return (
                    <button
                      key={line.id}
                      type="button"
                      onClick={() => {
                        selectStationById(line.startStationId, line.id, {
                          focusMap: true,
                          scale: focusedStationScale(),
                        });
                      }}
                      className={`mk-focus grid gap-1.5 text-left text-xs font-bold transition ${
                        isActive ? "text-foreground" : "text-muted hover:text-foreground"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-12 rounded-full"
                        style={{ backgroundColor: line.color }}
                      />
                      <span>{line.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <TmdbAvailabilityPanel state={activeTmdbState} />

            {selectedStation.stationKind === "movie" ? (
              <StationPlacementVote
                station={selectedStation}
                voteRecord={stationVotes[selectedStation.id]}
                onVote={handleStationVote}
              />
            ) : null}
          </div>
        ) : focusedLine && focusedLinePanel ? (
          <div className="grid gap-6">
            <header className="grid gap-3 border-b border-line pb-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                <span
                  className="rounded-[3px] px-2 py-1 text-canvas"
                  style={{ backgroundColor: focusedLine.color }}
                >
                  {focusedLine.shortName}
                </span>
                <span className="text-muted">집중 보기</span>
              </div>
              <h2 className="break-keep text-2xl font-black leading-tight sm:text-3xl">
                {focusedLinePanel.title}
              </h2>
              <p className="text-sm leading-7 text-muted">
                {focusedLinePanel.description}
              </p>
            </header>

            <section className="grid gap-3">
              <h3 className="text-xs font-black text-muted">노선 안내</h3>
              <dl className="grid gap-2 text-sm">
                <div
                  className="grid gap-1 border-l-4 bg-surface px-3 py-3"
                  style={{ borderColor: focusedLine.color }}
                >
                  <dt className="text-xs font-black text-muted">출발역</dt>
                  <dd className="font-black text-foreground">{focusedLinePanel.start}</dd>
                </div>
                <div
                  className="grid gap-1 border-l-4 bg-surface px-3 py-3"
                  style={{ borderColor: focusedLine.color }}
                >
                  <dt className="text-xs font-black text-muted">환승역</dt>
                  <dd className="font-black text-foreground">
                    {focusedLinePanel.transfer}
                  </dd>
                </div>
                {focusedLinePanel.terminal ? (
                  <div
                    className="grid gap-1 border-l-4 bg-surface px-3 py-3"
                    style={{ borderColor: focusedLine.color }}
                  >
                    <dt className="text-xs font-black text-muted">종착역</dt>
                    <dd className="font-black text-foreground">
                      {focusedLinePanel.terminal}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          </div>
        ) : (
          <div className="grid gap-6">
            <header className="grid gap-5 border-b border-line pb-5">
              <div className="grid gap-3">
                <h2 className="break-keep text-2xl font-black leading-tight sm:text-3xl">
                  넷플릭스에서 30분 고르다 지친 사람들을 위한 지도
                </h2>
                <p className="break-keep text-sm font-semibold leading-6 text-muted">
                  오늘 볼 영화 하나 고르고, 마음에 들면 다음역으로 가세요.
                </p>
              </div>
              <ol className="grid gap-3 text-sm leading-6">
                <li className="grid grid-cols-[1.75rem_1fr] gap-3">
                  <span className="font-black text-muted">1</span>
                  <p>
                    <span className="font-black text-foreground">
                      지금 끌리는 첫 역을 고르세요.
                    </span>
                    <br />
                    <span className="text-muted">
                      웃고 싶은지, 몰입하고 싶은지, 고전을 깨고 싶은지만 정하면 됩니다.
                    </span>
                  </p>
                </li>
                <li className="grid grid-cols-[1.75rem_1fr] gap-3">
                  <span className="font-black text-muted">2</span>
                  <p>
                    <span className="font-black text-foreground">
                      다음역처럼 한 편씩 이어 보세요.
                    </span>
                    <br />
                    <span className="text-muted">
                      비슷한 재미에서 조금씩 다른 감상으로 넘어가게 설계했습니다.
                    </span>
                  </p>
                </li>
                <li className="grid grid-cols-[1.75rem_1fr] gap-3">
                  <span className="font-black text-muted">3</span>
                  <p>
                    <span className="font-black text-foreground">
                      안 맞으면 바로 환승하세요.
                    </span>
                    <br />
                    <span className="text-muted">
                      재미없으면 실패가 아니라 다른 노선으로 갈아타면 됩니다.
                    </span>
                  </p>
                </li>
              </ol>
            </header>

            <section className="grid gap-3">
              <h3 className="text-xs font-black text-muted">첫차는 이쪽</h3>
              <div className="grid border-y border-line">
                {startSuggestions.map((suggestion) => {
                  const station = stationById.get(suggestion.stationId);
                  const line = station
                    ? lineById.get(suggestion.lineId ?? station.lines[0])
                    : undefined;

                  return (
                    <button
                      key={suggestion.stationId}
                      type="button"
                      onClick={() =>
                        selectStationById(suggestion.stationId, suggestion.lineId, {
                          focusMap: true,
                          scale: focusedStationScale(),
                        })
                      }
                      className="mk-focus grid min-h-14 grid-cols-[72px_1fr] items-center gap-3 border-b border-line py-2.5 text-left transition last:border-b-0 hover:bg-surface sm:min-h-0"
                    >
                      <span className="relative h-8" aria-hidden="true">
                        <span
                          className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full"
                          style={{
                            backgroundColor: line?.color ?? "var(--foreground)",
                          }}
                        />
                        <span
                          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-canvas shadow-[0_0_0_3px_var(--canvas)]"
                          style={{
                            borderColor: line?.color ?? "var(--foreground)",
                          }}
                        />
                      </span>
                      <span className="grid gap-0.5">
                        <span className="text-sm font-black text-foreground">
                          {suggestion.title}
                        </span>
                        <span className="text-xs leading-5 text-muted">
                          {suggestion.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </aside>
    </section>
  );
}
