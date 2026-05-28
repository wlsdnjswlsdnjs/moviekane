"use client";

import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
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

type MovieSubwayMapProps = {
  lines: Line[];
  stations: Station[];
  edges: Edge[];
  transferNotes: TransferNote[];
  completedStationIds?: string[];
  unavailableStationIds?: string[];
};

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
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
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
  const completedStationIdSet = useMemo(
    () => new Set(completedStationIds),
    [completedStationIds],
  );
  const unavailableStationIdSet = useMemo(
    () => new Set(unavailableStationIds),
    [unavailableStationIds],
  );

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

  function selectStation(station: Station, preferredLineId?: LineId) {
    setSelectedStationId(station.id);
    const nextLineId =
      preferredLineId && station.lines.includes(preferredLineId)
        ? preferredLineId
        : undefined;

    setSelectedLineId((current) =>
      nextLineId ??
      (current && station.lines.includes(current) ? current : station.lines[0]),
    );
  }

  function selectStationById(stationId: string, preferredLineId?: LineId) {
    const station = stationById.get(stationId);

    if (station) {
      selectStation(station, preferredLineId);
    }
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
    const ratio = scale / transform.scale;

    setCustomTransform({
      scale,
      x: cursorX - (cursorX - transform.x) * ratio,
      y: cursorY - (cursorY - transform.y) * ratio,
    });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;

    zoomAt(
      event.clientX,
      event.clientY,
      transform.scale * delta,
      event.currentTarget,
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (target.closest("[data-station-button]")) {
      return;
    }

    if (target.closest("[data-line-focus]")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
      moved: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (Math.hypot(deltaX, deltaY) > 4) {
      drag.moved = true;
    }

    setCustomTransform((current) => ({
      ...(current ?? defaultTransform),
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    }));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;

    if (drag?.pointerId === event.pointerId) {
      if (!drag.moved && focusedLineId) {
        setFocusedLineId(null);
      }

      dragState.current = null;
    }
  }

  function nudgeZoom(delta: number) {
    setCustomTransform((current) => ({
      ...(current ?? defaultTransform),
      scale: clamp((current ?? defaultTransform).scale + delta, MIN_SCALE, MAX_SCALE),
    }));
  }

  return (
    <section
      id="map"
      className="flex min-h-[calc(100svh-88px)] flex-col overflow-visible bg-canvas sm:relative sm:block sm:h-[calc(100vh-72px)] sm:min-h-0 sm:overflow-hidden"
    >
      <div
        className="relative h-[52svh] min-h-[400px] max-h-[480px] cursor-grab overflow-hidden border-b border-line touch-none active:cursor-grabbing sm:absolute sm:inset-0 sm:h-auto sm:min-h-0 sm:max-h-none sm:border-b-0"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="absolute left-0 top-0"
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

      <aside
        id="station-info"
        aria-label="영화역 정보"
        className="relative z-20 max-h-none overflow-visible border-t border-line bg-canvas/97 p-5 pb-[max(20px,env(safe-area-inset-bottom))] backdrop-blur sm:absolute sm:bottom-0 sm:left-auto sm:right-0 sm:top-0 sm:max-h-none sm:w-[min(100%,420px)] sm:overflow-auto sm:overscroll-contain sm:border-l sm:border-t-0 sm:p-7"
      >
        {selectedStation ? (
          <div className="grid gap-5">
            <header className="-mx-5 grid gap-3 border-b border-line bg-canvas/97 px-5 pb-5 backdrop-blur sm:sticky sm:top-0 sm:z-10 sm:-mx-7 sm:px-7">
              <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                <span
                  className="rounded-[3px] px-2 py-1 text-canvas"
                  style={{
                    backgroundColor: currentLine?.color ?? "var(--foreground)",
                  }}
                >
                  {currentLine?.shortName ?? "노선"} · {stationRoleLabel(selectedStation)}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="h-1.5 w-24 rounded-full"
                style={{ backgroundColor: currentLine?.color ?? "var(--foreground)" }}
              />
              <div className="grid gap-2">
                <h2 className="break-keep text-2xl font-black leading-tight sm:text-4xl">
                  {selectedStation.titleKo}
                </h2>
                <p className="text-sm leading-6 text-muted">
                  {stationMeta(selectedStation)}
                </p>
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
                      setSelectedLineId(currentLineId);
                      setSelectedStationId(previousStation.id);
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
                      setSelectedLineId(currentLineId);
                      setSelectedStationId(nextStation.id);
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
                        setSelectedLineId(line.id);
                        setSelectedStationId(line.startStationId);
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
              <h2 className="break-keep text-2xl font-black leading-tight sm:text-3xl">
                영화가 어려웠던 게 아니라,
                <br />
                첫 역이 멀었을지도.
              </h2>
              <ol className="grid gap-3 text-sm leading-6">
                <li className="grid grid-cols-[1.75rem_1fr] gap-3">
                  <span className="font-black text-muted">1</span>
                  <p>
                    <span className="font-black text-foreground">
                      출발역을 고릅니다.
                    </span>
                    <br />
                    <span className="text-muted">
                      아래 첫차 후보나 지도 위 영화역을 눌러보세요.
                    </span>
                  </p>
                </li>
                <li className="grid grid-cols-[1.75rem_1fr] gap-3">
                  <span className="font-black text-muted">2</span>
                  <p>
                    <span className="font-black text-foreground">
                      다음역을 확인합니다.
                    </span>
                    <br />
                    <span className="text-muted">
                      왜 이어지는지, 어디로 가는지 짧게 보여드립니다.
                    </span>
                  </p>
                </li>
                <li className="grid grid-cols-[1.75rem_1fr] gap-3">
                  <span className="font-black text-muted">3</span>
                  <p>
                    <span className="font-black text-foreground">
                      별로면 갈아탑니다.
                    </span>
                    <br />
                    <span className="text-muted">
                      환승역이나 노선 선을 눌러 다른 방향으로 가세요.
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
                        selectStationById(suggestion.stationId, suggestion.lineId)
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
