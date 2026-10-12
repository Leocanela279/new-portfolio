import type { PlateMotif } from "@/data/projects";

/**
 * Engraved "plates" used as project previews until real screenshots are
 * supplied. Each is a line drawing in the site's palette, in the spirit of
 * a scientific illustration: a calendar with game dice, tenants in orbit,
 * a terminal with a vault dial, and a DigComp competency radar. All
 * geometry is computed here, so the drawings stay crisp at any size and add
 * no image weight.
 */

const VIEW_W = 800;
const VIEW_H = 560;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;

const INK = "var(--color-text)";
const ACCENT = "var(--color-accent)";
const PAPER = "var(--color-bg-alt)";

const motifNames: Record<PlateMotif, string> = {
  calendar: "Calendarium",
  orrery: "Tenants",
  terminal: "Vault",
  radar: "DigComp",
};

type ProjectPlateProps = {
  motif: PlateMotif;
  figure: string;
};

export function ProjectPlate({ motif, figure }: ProjectPlateProps) {
  return (
    <div className="relative size-full bg-parchment text-ink">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 size-full"
        fill="none"
        aria-hidden="true"
      >
        {motif === "calendar" && <Calendar />}
        {motif === "orrery" && <Orrery />}
        {motif === "terminal" && <Terminal />}
        {motif === "radar" && <Radar />}
      </svg>

      <Corners />
      <span className="type-label absolute bottom-4 left-5 text-stone sm:bottom-5 sm:left-6">
        Fig. {figure}
      </span>
      <span className="type-label absolute bottom-4 right-5 text-stone sm:bottom-5 sm:right-6">
        {motifNames[motif]}
      </span>
    </div>
  );
}

function Corners() {
  const base = "absolute size-3 border-ink/30";
  return (
    <span aria-hidden="true">
      <span className={`${base} left-3 top-3 border-l border-t`} />
      <span className={`${base} right-3 top-3 border-r border-t`} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} />
      <span className={`${base} bottom-3 right-3 border-b border-r`} />
    </span>
  );
}

/* Shared helpers ─────────────────────────────────────────── */

const hairline = { vectorEffect: "non-scaling-stroke" as const, strokeWidth: 1 };

function polar(r: number, deg: number, cx = CX, cy = CY) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function Ticks({ r, every, len, cx = CX, cy = CY, opacity = 0.35 }: { r: number; every: number; len: (deg: number) => number; cx?: number; cy?: number; opacity?: number }) {
  const ticks = [];
  for (let deg = 0; deg < 360; deg += every) {
    const a = polar(r, deg, cx, cy);
    const b = polar(r - len(deg), deg, cx, cy);
    ticks.push(<line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={INK} strokeOpacity={opacity} {...hairline} />);
  }
  return <g>{ticks}</g>;
}

function Label({ x, y, children, italic = false, anchor = "middle" }: { x: number; y: number; children: React.ReactNode; italic?: boolean; anchor?: "start" | "middle" | "end" }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={INK}
      fillOpacity={0.7}
      style={
        italic
          ? { fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 22 }
          : { fontFamily: "var(--font-manrope)", fontSize: 10, letterSpacing: "0.2em" }
      }
    >
      {children}
    </text>
  );
}

/* Tenants: bodies in orbit around one platform, routed to it. ─────── */

function Orrery() {
  const orbits = [78, 138, 196];
  const bodies = [
    { r: 78, deg: 208, size: 6, fill: INK, label: "i" },
    { r: 138, deg: 38, size: 5, fill: ACCENT, label: "ii" },
    { r: 138, deg: 252, size: 5, fill: PAPER, label: "iii" },
    { r: 196, deg: 122, size: 7, fill: PAPER, label: "iv" },
    { r: 196, deg: 334, size: 7, fill: ACCENT, label: "v" },
  ];

  return (
    <g>
      <line x1={CX - 330} y1={CY} x2={CX + 330} y2={CY} stroke={INK} strokeOpacity={0.14} {...hairline} />
      <line x1={CX} y1={CY - 260} x2={CX} y2={CY + 260} stroke={INK} strokeOpacity={0.14} {...hairline} />

      <ellipse cx={CX} cy={CY} rx={310} ry={86} transform={`rotate(-16 ${CX} ${CY})`} stroke={INK} strokeOpacity={0.22} {...hairline} />

      <circle cx={CX} cy={CY} r={236} stroke={INK} strokeOpacity={0.4} {...hairline} />
      <Ticks r={236} every={5} len={(d) => (d % 30 === 0 ? 14 : 6)} />

      {orbits.map((r, i) => (
        <circle key={r} cx={CX} cy={CY} r={r} stroke={INK} strokeOpacity={0.32} strokeDasharray={i === 1 ? "2 5" : undefined} {...hairline} />
      ))}

      {bodies.map((b) => {
        const p = polar(b.r, b.deg);
        const l = polar(b.r + 22, b.deg);
        return (
          <g key={b.label}>
            <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={ACCENT} strokeOpacity={0.8} strokeDasharray="3 4" {...hairline} />
            <circle cx={p.x} cy={p.y} r={b.size} fill={b.fill} stroke={INK} {...hairline} />
            <Label x={l.x} y={l.y + 7} italic>
              {b.label}
            </Label>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={34} fill={PAPER} stroke={INK} {...hairline} />
      <circle cx={CX} cy={CY} r={24} stroke={INK} strokeOpacity={0.35} {...hairline} />
      <circle cx={CX} cy={CY} r={4} fill={ACCENT} />
    </g>
  );
}

/* Calendarium: a month of club dates, and dice for the game library. ── */

function Calendar() {
  const cols = 7;
  const cell = { w: 54, h: 46 };
  const origin = { x: 112, y: 150 };
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const marked = new Set([6, 13, 20, 27]);
  const dotted = new Set([3, 17]);
  const firstWeekday = 2; // the month starts on a Wednesday

  return (
    <g>
      <Label x={origin.x} y={origin.y - 54} anchor="start">CALENDARIUM · MMXXVI</Label>
      {days.map((d, i) => (
        <Label key={i} x={origin.x + i * cell.w + cell.w / 2} y={origin.y - 16}>
          {d}
        </Label>
      ))}
      {Array.from({ length: 6 }, (_, row) => (
        <line key={`h${row}`} x1={origin.x} x2={origin.x + cols * cell.w} y1={origin.y + row * cell.h} y2={origin.y + row * cell.h} stroke={INK} strokeOpacity={0.28} {...hairline} />
      ))}
      {Array.from({ length: cols + 1 }, (_, col) => (
        <line key={`v${col}`} x1={origin.x + col * cell.w} x2={origin.x + col * cell.w} y1={origin.y} y2={origin.y + 5 * cell.h} stroke={INK} strokeOpacity={0.28} {...hairline} />
      ))}
      {Array.from({ length: 30 }, (_, i) => {
        const slot = i + firstWeekday;
        const x = origin.x + (slot % cols) * cell.w;
        const y = origin.y + Math.floor(slot / cols) * cell.h;
        if (slot >= 35) return null;
        const day = i + 1;
        return (
          <g key={day}>
            <text x={x + 7} y={y + 15} fill={INK} fillOpacity={0.6} style={{ fontFamily: "var(--font-manrope)", fontSize: 10 }}>
              {day}
            </text>
            {marked.has(day) && <circle cx={x + cell.w / 2} cy={y + cell.h / 2 + 4} r={13} stroke={ACCENT} vectorEffect="non-scaling-stroke" strokeWidth={1.5} />}
            {dotted.has(day) && <circle cx={x + cell.w / 2} cy={y + cell.h / 2 + 5} r={3.5} fill={INK} fillOpacity={0.75} />}
          </g>
        );
      })}

      <Die cx={600} cy={250} size={62} pips={[5, 3, 2]} />
      <Die cx={668} cy={352} size={42} pips={[1, 4, 6]} />
      <line x1={540} y1={430} x2={720} y2={430} stroke={INK} strokeOpacity={0.25} {...hairline} />
    </g>
  );
}

/** An isometric die: top, left and right faces with pips. */
function Die({ cx, cy, size, pips }: { cx: number; cy: number; size: number; pips: [number, number, number] }) {
  const s = size;
  const h = s * 0.5; // vertical half-diagonal of the top rhombus
  const top = `${cx},${cy - h} ${cx + s},${cy} ${cx},${cy + h} ${cx - s},${cy}`;
  const left = `${cx - s},${cy} ${cx},${cy + h} ${cx},${cy + h + s} ${cx - s},${cy + s}`;
  const right = `${cx + s},${cy} ${cx},${cy + h} ${cx},${cy + h + s} ${cx + s},${cy + s}`;
  const layouts: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [[0.25, 0.25], [0.75, 0.75]],
    3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
    6: [[0.25, 0.2], [0.25, 0.5], [0.25, 0.8], [0.75, 0.2], [0.75, 0.5], [0.75, 0.8]],
  };
  // Map unit-square coordinates (u, v) onto each face.
  const onTop = (u: number, v: number) => ({ x: cx - s + u * s + v * s, y: cy - u * h + v * h });
  const onLeft = (u: number, v: number) => ({ x: cx - s + u * s, y: cy + u * h + v * s });
  const onRight = (u: number, v: number) => ({ x: cx + u * s, y: cy + h - u * h + v * s });
  const faces = [onTop, onLeft, onRight];
  return (
    <g>
      <polygon points={top} fill={PAPER} stroke={INK} {...hairline} />
      <polygon points={left} fill="rgb(36 35 32 / 0.06)" stroke={INK} {...hairline} />
      <polygon points={right} fill="rgb(36 35 32 / 0.12)" stroke={INK} {...hairline} />
      {faces.map((face, f) =>
        layouts[pips[f]].map(([u, v], i) => {
          const p = face(u, v);
          return <circle key={`${f}-${i}`} cx={p.x} cy={p.y} r={s * 0.065} fill={f === 0 ? ACCENT : INK} fillOpacity={f === 0 ? 1 : 0.7} />;
        }),
      )}
    </g>
  );
}

/* Vault: a terminal session beside a combination dial. ──────────── */

function Terminal() {
  const win = { x: 96, y: 108, w: 400, h: 330 };
  const lines = [
    { prompt: true, width: 210 },
    { prompt: false, width: 150, masked: true },
    { prompt: true, width: 170 },
    { prompt: false, width: 240 },
    { prompt: false, width: 120 },
    { prompt: true, width: 90, cursor: true },
  ];
  const dial = { x: 610, y: 272, r: 112 };

  return (
    <g>
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill={PAPER} stroke={INK} {...hairline} />
      <line x1={win.x} x2={win.x + win.w} y1={win.y + 30} y2={win.y + 30} stroke={INK} strokeOpacity={0.35} {...hairline} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={win.x + 18 + i * 16} cy={win.y + 15} r={4.5} stroke={INK} strokeOpacity={0.5} {...hairline} />
      ))}
      {lines.map((line, i) => {
        const y = win.y + 66 + i * 40;
        const x = win.x + 26;
        return (
          <g key={i}>
            {line.prompt && (
              <text x={x} y={y + 5} fill={ACCENT} style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 16 }}>
                $
              </text>
            )}
            {line.masked ? (
              Array.from({ length: 12 }, (_, k) => <circle key={k} cx={x + 24 + k * 12} cy={y} r={3} fill={INK} fillOpacity={0.7} />)
            ) : (
              <line x1={x + (line.prompt ? 24 : 0)} x2={x + (line.prompt ? 24 : 0) + line.width} y1={y} y2={y} stroke={INK} strokeOpacity={0.4} vectorEffect="non-scaling-stroke" strokeWidth={6} strokeLinecap="round" />
            )}
            {line.cursor && <rect x={x + 24 + line.width + 10} y={y - 9} width={10} height={18} fill={ACCENT} />}
          </g>
        );
      })}

      <circle cx={dial.x} cy={dial.y} r={dial.r} fill={PAPER} stroke={INK} {...hairline} />
      <circle cx={dial.x} cy={dial.y} r={dial.r - 26} stroke={INK} strokeOpacity={0.3} {...hairline} />
      <Ticks r={dial.r} every={6} len={(d) => (d % 30 === 0 ? 14 : 6)} cx={dial.x} cy={dial.y} opacity={0.5} />
      {["0", "25", "50", "75"].map((n, i) => {
        const p = polar(dial.r - 40, -90 + i * 90, dial.x, dial.y);
        return (
          <Label key={n} x={p.x} y={p.y + 4}>
            {n}
          </Label>
        );
      })}
      {/* Keyhole */}
      <circle cx={dial.x} cy={dial.y - 10} r={14} fill={INK} fillOpacity={0.85} />
      <polygon points={`${dial.x - 8},${dial.y - 2} ${dial.x + 8},${dial.y - 2} ${dial.x + 13},${dial.y + 30} ${dial.x - 13},${dial.y + 30}`} fill={INK} fillOpacity={0.85} />
      <line x1={dial.x} y1={dial.y - dial.r - 18} x2={dial.x} y2={dial.y - dial.r + 4} stroke={ACCENT} vectorEffect="non-scaling-stroke" strokeWidth={2} />
    </g>
  );
}

/* DigComp: the five competence areas as a radar. ────────────────── */

const DIGCOMP_AREAS = ["Information", "Communication", "Content creation", "Safety", "Problem solving"];

function Radar() {
  const r = 178;
  const angle = (i: number) => -90 + (360 / DIGCOMP_AREAS.length) * i;
  const ring = (k: number) =>
    DIGCOMP_AREAS.map((_, i) => {
      const p = polar(r * k, angle(i));
      return `${p.x},${p.y}`;
    }).join(" ");
  const shape = (values: number[]) =>
    values
      .map((v, i) => {
        const p = polar(r * v, angle(i));
        return `${p.x},${p.y}`;
      })
      .join(" ");

  return (
    <g>
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={ring(k)} stroke={INK} strokeOpacity={k === 1 ? 0.45 : 0.18} {...hairline} />
      ))}
      {DIGCOMP_AREAS.map((area, i) => {
        const end = polar(r, angle(i));
        const label = polar(r + 30, angle(i));
        const anchor = Math.abs(label.x - CX) < 10 ? "middle" : label.x > CX ? "start" : "end";
        return (
          <g key={area}>
            <line x1={CX} y1={CY} x2={end.x} y2={end.y} stroke={INK} strokeOpacity={0.22} {...hairline} />
            <Label x={label.x} y={label.y + 4} anchor={anchor}>
              {area.toUpperCase()}
            </Label>
          </g>
        );
      })}
      <polygon points={shape([0.9, 0.9, 0.9, 0.9, 0.9])} stroke={INK} strokeOpacity={0.4} strokeDasharray="3 5" {...hairline} />
      <polygon points={shape([0.78, 0.62, 0.84, 0.52, 0.7])} fill="rgb(161 139 105 / 0.18)" stroke={ACCENT} vectorEffect="non-scaling-stroke" strokeWidth={1.5} />
      {[0.78, 0.62, 0.84, 0.52, 0.7].map((v, i) => {
        const p = polar(r * v, angle(i));
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill={PAPER} stroke={ACCENT} vectorEffect="non-scaling-stroke" strokeWidth={1.5} />;
      })}
      <circle cx={CX} cy={CY} r={3} fill={INK} />
    </g>
  );
}
