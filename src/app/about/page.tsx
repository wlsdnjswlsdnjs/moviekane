import type { Metadata } from "next";
import Link from "next/link";
import { CriteriaCard } from "@/components/criteria-card";
import { lines, stations } from "@/data/movie-map";

export const metadata: Metadata = {
  title: "소개",
  description:
    "어려운 영화 앞에서 잠든 사람을 위한 영화 입문 노선도 소개.",
};

const stationById = new Map(stations.map((station) => [station.id, station]));

const routeCards = lines.map((line) => {
  const routeStations = line.stationIds
    .map((stationId) => stationById.get(stationId))
    .filter((station): station is NonNullable<typeof station> => Boolean(station));
  const transferStations = routeStations.filter((station) => station.lines.length > 1);

  return {
    ...line,
    routeStations,
    startTitle: stationById.get(line.startStationId)?.titleKo ?? "출발역",
    terminalTitle: stationById.get(line.terminalStationId)?.titleKo ?? "종착역",
    transferTitles: transferStations.map((station) => station.titleKo),
  };
});

const trumanStation = stationById.get("truman-show");
const trumanIntroLine = lines.find((line) => line.id === "intro") ?? lines[0];
const trumanDramaLine = lines.find((line) => line.id === "drama");
const trumanStationIndex = trumanIntroLine.stationIds.indexOf("truman-show");
const trumanPreviousStation =
  stationById.get(trumanIntroLine.stationIds[trumanStationIndex - 1]) ?? null;
const trumanNextStation =
  stationById.get(trumanIntroLine.stationIds[trumanStationIndex + 1]) ?? null;

const conceptCards = [
  {
    title: "영화는 역",
    body: "한 편을 고르면, 그 영화가 다음 영화의 위치가 됩니다.",
  },
  {
    title: "노선은 감상 방향",
    body: "비슷한 재미에서 조금 다른 감각으로 천천히 이동합니다.",
  },
  {
    title: "환승은 취향 이동",
    body: "한 노선이 식으면 다른 노선으로 갈아탑니다.",
  },
];

const standards = [
  {
    title: "첫 역은 가깝게",
    body: "바로 볼 마음이 드는 영화에서 시작합니다.",
  },
  {
    title: "다음 역은 자연스럽게",
    body: "난도보다 감상 감각이 이어지는지 봅니다.",
  },
  {
    title: "환승은 정확하게",
    body: "두 노선에서 모두 설명되는 영화만 둡니다.",
  },
  {
    title: "역명은 찾기 쉽게",
    body: "실제로 검색하고 말하는 제목을 씁니다.",
  },
];

const tickerItems = [
  "CANON IS NOT THE POINT",
  "START WHERE IT HITS",
  "TRANSFER WHEN IT DIES",
  "NO GUILT TRIP",
  "ONE MOVIE AT A TIME",
];

function TrumanStationPanel() {
  const stationTitle = trumanStation?.titleKo ?? "트루먼 쇼";
  const stationMeta = trumanStation?.titleEn ?? "The Truman Show";

  return (
    <aside className="border border-line bg-canvas">
      <header className="grid gap-4 border-b border-line p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
          <span
            className="rounded-[3px] px-2 py-1 text-canvas"
            style={{ backgroundColor: trumanIntroLine.color }}
          >
            {trumanIntroLine.shortName} · 환승역
          </span>
          {trumanDramaLine ? (
            <span
              className="rounded-[3px] border px-2 py-1"
              style={{
                borderColor: trumanDramaLine.color,
                color: trumanDramaLine.color,
              }}
            >
              {trumanDramaLine.shortName} 환승
            </span>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className="h-1.5 w-24 rounded-full"
          style={{ backgroundColor: trumanIntroLine.color }}
        />
        <div className="grid gap-2">
          <p className="text-xs font-black text-muted">대표 예시</p>
          <h2 className="break-keep text-3xl font-black leading-tight text-foreground">
            {stationTitle}
          </h2>
          <p className="text-sm leading-6 text-muted">{stationMeta}</p>
        </div>
      </header>

      <section className="grid gap-3 p-5 sm:p-6">
        <div
          className="h-1 rounded-full"
          style={{ backgroundColor: trumanIntroLine.color }}
        />
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
          <div className="grid min-h-20 content-center gap-1 rounded-[3px] border border-line bg-surface px-3 py-3 text-left">
            <span className="text-[11px] font-black text-muted">이전역</span>
            <span className="break-keep text-sm font-black text-foreground">
              {trumanPreviousStation?.titleKo ?? "이전역"}
            </span>
          </div>

          <div
            className="grid min-w-24 place-items-center rounded-[3px] border-2 bg-canvas px-3 py-3 text-center shadow-[0_0_0_3px_var(--canvas)]"
            style={{ borderColor: trumanIntroLine.color }}
          >
            <span className="text-[11px] font-black text-muted">현재역</span>
            <span className="break-keep text-base font-black text-foreground">
              {stationTitle}
            </span>
          </div>

          <div className="grid min-h-20 content-center gap-1 rounded-[3px] border border-line bg-surface px-3 py-3 text-right">
            <span className="text-[11px] font-black text-muted">다음역</span>
            <span className="break-keep text-sm font-black text-foreground">
              {trumanNextStation?.titleKo ?? "다음역"}
            </span>
          </div>
        </div>
      </section>

      <dl className="border-t border-line">
        <div className="grid grid-cols-[92px_1fr] border-b border-line">
          <dt className="bg-surface px-3 py-3 text-xs font-black text-muted">
            노선
          </dt>
          <dd className="px-3 py-3 text-sm font-semibold leading-6 text-foreground">
            {trumanIntroLine.name}
          </dd>
        </div>
        <div className="grid grid-cols-[92px_1fr]">
          <dt className="bg-surface px-3 py-3 text-xs font-black text-muted">
            환승
          </dt>
          <dd className="px-3 py-3 text-sm font-semibold leading-6 text-foreground">
            {trumanDramaLine?.name ?? "드라마선"}
          </dd>
        </div>
      </dl>
    </aside>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-88px)] bg-canvas sm:min-h-[calc(100vh-72px)]">
      <section className="border-b border-line bg-canvas">
        <div className="mk-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-16 lg:py-24">
          <header className="grid max-w-5xl gap-8">
            <p className="text-sm font-medium leading-[1.35] text-muted">
              소개 / Movie Subway
            </p>
            <div className="grid gap-6">
              <h1 className="mk-display max-w-5xl break-keep text-5xl leading-[1.05] text-foreground sm:text-7xl lg:text-8xl">
                영화를
                <br />
                한 역씩 갈아타는 지도.
              </h1>
              <div className="grid max-w-2xl gap-4 break-keep text-lg leading-8 text-muted sm:text-xl sm:leading-9">
                <p>
                  한 편을 보고, 다음 편으로 갑니다. 노선은 취향이 이동하는
                  방향입니다.
                </p>
                <p className="text-foreground">
                  맞으면 계속 타고, 아니면 환승합니다.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/#map"
                className="mk-focus rounded-full bg-primary px-5 py-3 text-sm font-medium text-canvas transition hover:bg-primary-pressed"
              >
                노선도 보기
              </Link>
              <a
                href="#about-routes"
                className="mk-focus rounded-full border border-line bg-canvas px-5 py-3 text-sm font-medium text-foreground transition hover:bg-surface"
              >
                노선 읽기
              </a>
            </div>
          </header>

          <TrumanStationPanel />
        </div>
      </section>

      <section className="border-b border-line bg-surface-dark text-canvas">
        <div className="mk-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <h2 className="max-w-2xl break-keep text-4xl font-medium leading-tight sm:text-6xl">
            컨셉은 단순합니다.
            <br />
            영화 + 지하철.
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {conceptCards.map((card, index) => (
              <article
                key={card.title}
                className="grid content-start gap-5 border-t border-canvas/22 pt-5"
              >
                <span className="font-mono text-sm text-canvas/48">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="grid gap-3">
                  <h3 className="break-keep text-2xl font-medium leading-tight">
                    {card.title}
                  </h3>
                  <p className="break-keep text-sm leading-7 text-canvas/68">
                    {card.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about-routes"
        className="border-b border-line bg-canvas"
        aria-labelledby="about-routes-title"
      >
        <div className="mk-container grid gap-9 py-14 sm:py-20">
          <div className="grid gap-4 sm:grid-cols-[0.78fr_1fr] sm:items-end">
            <h2
              id="about-routes-title"
              className="break-keep text-4xl font-medium leading-tight sm:text-6xl"
            >
              지금 열려 있는
              <br />
              네 개의 노선.
            </h2>
            <p className="max-w-2xl break-keep text-base leading-8 text-muted sm:text-lg">
              각 노선은 실제 영화역 10개로 이어집니다. 첫차에서 출발해 종착까지,
              중간의 환승역에서 다른 감상 방향으로 갈아탑니다.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-4">
            {routeCards.map((route) => (
              <article
                key={route.id}
                className="grid min-h-[24rem] content-between rounded-lg border border-line bg-canvas p-5"
              >
                <div className="grid gap-5">
                  <span
                    aria-hidden="true"
                    className="h-2 w-24 rounded-full"
                    style={{ backgroundColor: route.color }}
                  />
                  <div className="grid gap-3">
                    <p className="text-xs font-black text-muted">
                      {route.shortName} · {route.routeStations.length}개 역
                    </p>
                    <h3 className="break-keep text-3xl font-medium leading-tight">
                      {route.name}
                    </h3>
                    <p className="break-keep text-sm leading-7 text-muted">
                      {route.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 pt-10">
                  <dl className="grid border-y border-line text-sm">
                    <div className="grid grid-cols-[72px_1fr] border-b border-line py-3">
                      <dt className="text-xs font-black text-muted">첫차</dt>
                      <dd className="break-keep font-semibold text-foreground">
                        {route.startTitle}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[72px_1fr] border-b border-line py-3">
                      <dt className="text-xs font-black text-muted">종착</dt>
                      <dd className="break-keep font-semibold text-foreground">
                        {route.terminalTitle}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[72px_1fr] py-3">
                      <dt className="text-xs font-black text-muted">환승</dt>
                      <dd className="break-keep font-semibold text-foreground">
                        {route.transferTitles.length > 0
                          ? route.transferTitles.join(" · ")
                          : "없음"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-line bg-signature-coral py-8 text-canvas">
        <div className="mk-ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mx-5 whitespace-nowrap text-3xl font-medium uppercase leading-none text-canvas sm:text-5xl"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mk-container grid gap-8 py-14 sm:py-20">
          <div className="grid gap-3">
            <p className="mk-eyebrow">작성 기준</p>
            <h2 className="break-keep text-4xl font-medium leading-tight sm:text-6xl">
              역은 쉽게,
              <br />
              연결은 정확하게.
            </h2>
          </div>

          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {standards.map((item, index) => (
              <CriteriaCard
                key={item.title}
                index={index + 1}
                title={item.title}
                body={item.body}
                accentColor={routeCards[index % routeCards.length].color}
              />
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-signature-forest text-canvas">
        <div className="mk-container grid gap-7 py-14 sm:grid-cols-[1fr_auto] sm:items-end sm:py-20">
          <div className="grid gap-4">
            <p className="text-sm font-medium text-canvas/62">다음 안내</p>
            <h2 className="max-w-4xl break-keep text-5xl font-medium leading-tight sm:text-7xl">
              다음 영화는
              <br />
              한 정거장 옆에.
            </h2>
          </div>
          <Link
            href="/#map"
            className="mk-focus w-max rounded-full bg-canvas px-5 py-3 text-sm font-medium text-foreground transition hover:bg-signature-cream"
          >
            노선도로 가기
          </Link>
        </div>
      </section>
    </main>
  );
}
