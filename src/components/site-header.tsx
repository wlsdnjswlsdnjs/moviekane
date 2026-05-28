import Link from "next/link";

const navItems = [
  { href: "/", label: "노선도" },
  { href: "/about", label: "소개" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/92 backdrop-blur">
      <div className="relative mx-auto flex h-[88px] w-full max-w-[1440px] flex-col items-center justify-center gap-2 px-4 sm:h-[72px] sm:flex-row sm:gap-0 sm:px-8">
        <Link
          href="/"
          className="mk-focus max-w-full whitespace-nowrap text-center text-base font-bold text-foreground sm:absolute sm:left-8 sm:max-w-[42vw] sm:truncate sm:text-left sm:text-lg"
        >
          시민 케인 보다가 잠든 사람들
        </Link>

        <nav
          aria-label="주요 메뉴"
          className="flex w-full items-center justify-center gap-7 sm:w-auto sm:gap-8"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mk-focus whitespace-nowrap text-sm font-bold text-foreground sm:text-base"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
