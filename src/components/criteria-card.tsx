type CriteriaCardProps = {
  index: number;
  title: string;
  body: string;
  accentColor?: string;
};

export function CriteriaCard({
  index,
  title,
  body,
  accentColor = "var(--foreground)",
}: CriteriaCardProps) {
  return (
    <li
      className="grid min-h-36 content-between rounded-lg border border-line bg-canvas p-5 sm:p-6"
      style={{ borderTopColor: accentColor, borderTopWidth: 6 }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-sm leading-none text-soft">
          {String(index).padStart(2, "0")}
        </span>
        <span
          aria-hidden="true"
          className="h-1.5 w-14 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      <div className="grid gap-3 pt-8">
        <h3 className="break-keep text-xl font-medium leading-tight">
          {title}
        </h3>
        <p className="break-keep text-[0.9375rem] leading-7 text-muted">
          {body}
        </p>
      </div>
    </li>
  );
}
