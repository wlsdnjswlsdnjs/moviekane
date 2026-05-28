import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "시민 케인 보다가 잠든 사람들",
    template: "%s | 시민 케인 보다가 잠든 사람들",
  },
  description:
    "익숙한 재미에서 출발해 조금씩 다음 영화로 넘어가는 스테이지형 영화 로드맵.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <SiteHeader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
