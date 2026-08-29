/** Printer's crop marks at the corners of a printed area. */
export function CropMarks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <span className="crop" style={{ top: 10, left: 10 }} />
      <span className="crop" style={{ top: 10, right: 10 }} />
      <span className="crop" style={{ bottom: 10, left: 10 }} />
      <span className="crop" style={{ bottom: 10, right: 10 }} />
    </div>
  );
}

/** The tear-off line between two parts of the form. */
export function Perforation() {
  return <div aria-hidden className="perf" />;
}

/** LABEL ....................... VALUE */
export function LeaderRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-end w-full">
      <span className="lbl shrink-0" style={{ color: "var(--fg-3)" }}>
        {label}
      </span>
      <span className="leader" />
      <span
        className="mono text-[12px] shrink-0"
        style={{ color: tone ?? "var(--fg)" }}
      >
        {value}
      </span>
    </div>
  );
}
