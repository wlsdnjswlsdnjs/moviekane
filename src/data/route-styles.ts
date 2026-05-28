export const routeStyles = {
  starter: {
    mark: "01",
    hint: "처음 재미 붙이는 길",
    accent: "#5645d4",
    accentClass: "bg-primary",
    tintClass: "bg-tint-lavender",
    textClass: "text-brand-purple-800",
    gradient: "from-[#e6e0f5] via-[#d6b6f6] to-[#fafaf9]",
    sticker: "START",
  },
  classic: {
    mark: "02",
    hint: "고전, 덜 졸린 쪽부터",
    accent: "#f5d75e",
    accentClass: "bg-brand-yellow",
    tintClass: "bg-tint-yellow",
    textClass: "text-brand-brown",
    gradient: "from-[#fef7d6] via-[#f9e79f] to-[#fafaf9]",
    sticker: "CLASSIC",
  },
  bong: {
    mark: "03",
    hint: "기생충 이후의 불안",
    accent: "#2a9d99",
    accentClass: "bg-brand-teal",
    tintClass: "bg-tint-mint",
    textClass: "text-brand-teal",
    gradient: "from-[#d9f3e1] via-[#b7e6de] to-[#fafaf9]",
    sticker: "BONG",
  },
  genre: {
    mark: "04",
    hint: "재미로 체력 올리기",
    accent: "#dd5b00",
    accentClass: "bg-brand-orange",
    tintClass: "bg-tint-peach",
    textClass: "text-brand-orange",
    gradient: "from-[#ffe8d4] via-[#ffc49b] to-[#fafaf9]",
    sticker: "GENRE",
  },
} as const;

export type RouteTheme = keyof typeof routeStyles;

export function getRouteStyle(theme: string) {
  return routeStyles[theme as RouteTheme] ?? routeStyles.starter;
}
