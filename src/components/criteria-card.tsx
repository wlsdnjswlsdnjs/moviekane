type CriteriaCardProps = {
  index: number;
  title: string;
  body: string;
};

export function CriteriaCard({ index, title, body }: CriteriaCardProps) {
  return (
    <li className="grid min-h-36 content-between rounded-lg border border-line bg-canvas p-5 sm:p-6">
      <span className="font-mono text-sm leading-none text-soft">
        {String(index).padStart(2, "0")}
      </span>
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
