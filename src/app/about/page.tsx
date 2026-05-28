import type { Metadata } from "next";
import { CriteriaCard } from "@/components/criteria-card";
import { movieTitleGuidelines } from "@/data/movie-map";

export const metadata: Metadata = {
  title: "소개",
  description:
    "어려운 영화 앞에서 잠든 사람을 위한 영화 입문 노선도 소개.",
};

const standards = [
  {
    title: "첫차 감각",
    body: "처음 타도 바로 튕겨 나가지 않는가",
  },
  {
    title: "재미의 입구",
    body: "영화가 숙제보다 먼저 재미로 들어오는가",
  },
  {
    title: "다음역 연결",
    body: "앞뒤 영화가 감상 난도와 재미의 방향에서 너무 멀리 뛰지 않는가",
  },
  {
    title: "감상 밀도",
    body: "복잡함이 갑자기 몰려와 출발감을 끊지 않는가",
  },
  {
    title: "노선 성격",
    body: "이 영화가 어느 감각을 열어주는가",
  },
  {
    title: "환승성",
    body: "두 노선 모두에서 앞뒤 역이 자연스럽고, 환승 때문에 노선이 억지로 꺾이지 않는가",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-88px)] bg-background sm:min-h-[calc(100vh-72px)]">
      <section className="mk-container py-16 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-5xl gap-16 sm:gap-24 lg:gap-32">
          <header className="grid gap-12">
            <div className="grid gap-7">
              <p className="mk-eyebrow">소개</p>
              <h1 className="mk-display max-w-4xl break-keep text-4xl leading-[1.12] sm:text-6xl lg:text-7xl">
                <span className="block">영화가 어려웠던 게 아니라,</span>
                <span className="block">첫 역이 멀었을지도.</span>
              </h1>
            </div>

            <div className="grid max-w-2xl gap-5 break-keep text-[1.0625rem] leading-8 text-foreground sm:text-lg sm:leading-9">
              <p>
                시민 케인 앞에서 졸았다고 영화랑 안 맞는 건 아닙니다.
              </p>
              <p>
                그냥 너무 먼 역에서 탔을 수도 있어요. 이 사이트는 그런
                사람을 위한 영화 입문 노선도입니다.
              </p>
            </div>
          </header>

          <section className="grid max-w-3xl gap-4 border-y border-line py-10 text-2xl font-medium leading-relaxed sm:text-3xl">
            <p>영화는 역입니다.</p>
            <p>
              노선은 감상 감각이 옮겨가는
              <br className="sm:hidden" /> 길입니다.
            </p>
            <p>
              환승역은 다른 재미로 갈아타는
              <br className="sm:hidden" /> 지점입니다.
            </p>
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="grid content-start gap-4 border-t border-line pt-6">
              <h2 className="text-sm font-black text-muted">이 사이트가 하는 일</h2>
              <div className="grid gap-3 break-keep text-xl font-medium leading-relaxed">
                <p>덜 막막한 출발역을 제안합니다.</p>
                <p>재미에서 감상 감각으로 천천히 이어줍니다.</p>
                <p>갈아탈 수 있는 지점을 보여줍니다.</p>
              </div>
            </div>

            <div className="grid content-start gap-4 border-t border-line pt-6">
              <h2 className="text-sm font-black text-muted">하지 않는 일</h2>
              <div className="grid gap-3 break-keep text-xl font-medium leading-relaxed">
                <p>영화의 우열을 매기지 않습니다.</p>
                <p>하나의 순서를 강요하지 않습니다.</p>
                <p>끝까지 보라고 재촉하지 않습니다.</p>
              </div>
            </div>
          </section>

          <section className="grid gap-7" aria-labelledby="about-standards">
            <h2 id="about-standards" className="mk-eyebrow">
              역을 고르는 기준
            </h2>

            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {standards.map((item, index) => (
                <CriteriaCard
                  key={item.title}
                  index={index + 1}
                  title={item.title}
                  body={item.body}
                />
              ))}
            </ol>
          </section>

          <section className="grid gap-7" aria-labelledby="about-title-standards">
            <h2 id="about-title-standards" className="mk-eyebrow">
              영화 제목 작성 기준
            </h2>

            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {movieTitleGuidelines.map((item, index) => (
                <CriteriaCard
                  key={item.title}
                  index={index + 1}
                  title={item.title}
                  body={item.body}
                />
              ))}
            </ol>
          </section>

          <section className="grid max-w-3xl gap-3 break-keep pt-2 text-2xl font-medium leading-relaxed sm:text-3xl">
            <p>그러니까,</p>
            <p>어려운 영화 앞에서 졸았던 사람도 괜찮습니다.</p>
            <p className="text-muted">다른 역에서 다시 타면 됩니다.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
