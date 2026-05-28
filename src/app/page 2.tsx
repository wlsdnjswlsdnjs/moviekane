import Link from "next/link";
import { RouteCard } from "@/components/route-card";
import { StillBlock } from "@/components/still-block";
import { routes } from "@/data/routes";

export default function Home() {
  return (
    <main className="grain">
      <section className="mx-auto grid min-h-[calc(100vh-56px)] w-full max-w-6xl content-between px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <p className="text-sm font-semibold">영화 입문 지도</p>
          <p className="hidden text-sm text-muted sm:block">
            익숙한 재미에서 조금씩 다음 영화로
          </p>
        </div>

        <div className="py-12 sm:py-16 lg:py-20">
          <h1 className="max-w-5xl text-[56px] font-semibold leading-[1.05] text-foreground sm:text-[76px] md:text-[96px] lg:text-[112px]">
            좋은 영화도
            <br />
            <StillBlock className="mx-2 h-12 w-20 sm:h-16 sm:w-28 md:h-20 md:w-36" />
            너무 일찍 만나면
            <br />
            그냥 숙제가
            <StillBlock className="mx-2 h-12 w-16 sm:h-16 sm:w-24 md:h-20 md:w-28" />
            <br />될 때가 있습니다
          </h1>

          <div className="mt-10 grid gap-6 border-t border-line pt-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div className="grid gap-5">
              <p className="max-w-xl text-2xl font-medium leading-9 text-foreground">
                익숙한 재미에서 출발해,
                <br />
                조금씩 다음 영화로 넘어가는
                <br />
                스테이지형 영화 로드맵.
              </p>
              <p className="max-w-lg text-base leading-7 text-muted">
                어려운 영화를 못 보는 게 아닙니다. 아직 맞는 입구를 못
                찾았을 뿐입니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link
                href="/routes/starter"
                className="inline-flex h-11 items-center justify-center rounded-md border border-foreground bg-foreground px-5 text-sm font-medium text-background transition hover:bg-transparent hover:text-foreground"
              >
                첫 루트 시작하기
              </Link>
              <Link
                href="/routes"
                className="inline-flex h-11 items-center justify-center rounded-md border border-line-strong px-5 text-sm font-medium text-foreground transition hover:border-foreground hover:bg-surface"
              >
                루트 둘러보기
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-line pt-5 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <StillBlock
              key={index}
              className={`h-16 ${index % 2 === 0 ? "sm:h-24" : "sm:h-16"}`}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 sm:px-6 lg:px-8">
          <div className="grid gap-3 md:grid-cols-[0.8fr_1fr] md:items-end">
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              처음부터 어려운 영화에 던져질 필요는 없습니다.
            </h2>
            <p className="text-base leading-7 text-muted">
              네 개의 루트는 영화의 우열이 아니라 진입감의 차이를 기준으로
              놓았습니다. 이 영화가 괜찮았다면, 다음 영화도 덜 낯설 수
              있도록요.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase text-soft">About the map</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              우리는 “더 위대한 영화”보다 “덜 막막한 입구”를 먼저 봅니다.
            </h2>
          </div>
          <Link
            href="/about"
            className="inline-flex h-11 items-center justify-center rounded-md border border-line-strong px-5 text-sm font-medium transition hover:border-foreground hover:bg-surface"
          >
            배치 기준 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
