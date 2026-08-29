export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--rule)", background: "var(--ground-2)" }}
    >
      <div className="wrap py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-[9px]">
          <span className="disp text-[20px]">Cero</span>
          <span
            className="block w-[18px] h-2 rounded-[1px]"
            style={{ background: "var(--fg)" }}
          />
          <span className="lbl text-[10px] ml-2" style={{ color: "var(--fg-3)" }}>
            Private dollars on Aleo
          </span>
        </div>

        <div className="flex items-center gap-7">
          {/* TODO: real destinations */}
          <a className="lbl text-[10px]" style={{ color: "var(--fg-2)" }} href="#">
            Docs
          </a>
          <a className="lbl text-[10px]" style={{ color: "var(--fg-2)" }} href="#">
            X
          </a>
          <a className="lbl text-[10px]" style={{ color: "var(--fg-2)" }} href="#">
            [CONTACT EMAIL]
          </a>
        </div>
      </div>
    </footer>
  );
}
