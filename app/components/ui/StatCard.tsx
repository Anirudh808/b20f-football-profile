interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  accentColor?: "neon" | "electric" | "yellow" | "red";
  trend?: "up" | "down" | "neutral";
}

const accentClasses = {
  neon: {
    icon: "bg-neon-500/10 text-neon-400",
    border: "border-neon-500/20",
    glow: "hover:border-neon-500/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]",
  },
  electric: {
    icon: "bg-electric-500/10 text-electric-400",
    border: "border-electric-500/20",
    glow: "hover:border-electric-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]",
  },
  yellow: {
    icon: "bg-yellow-500/10 text-yellow-400",
    border: "border-yellow-500/20",
    glow: "hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
  },
  red: {
    icon: "bg-red-500/10 text-red-400",
    border: "border-red-500/20",
    glow: "hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  },
};

export function StatCard({
  label,
  value,
  unit,
  icon,
  accentColor = "neon",
  trend,
}: StatCardProps) {
  const accent = accentClasses[accentColor];

  return (
    <div
      className={`card p-5 flex items-center gap-4 border transition-all duration-300 ${accent.border} ${accent.glow}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${accent.icon}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-2xl font-black text-white">
            {value === 0 || value === "—" ? (
              <span className="text-slate-500">—</span>
            ) : (
              value
            )}
          </p>
          {unit && value !== "—" && (
            <span className="text-sm font-semibold text-slate-400">{unit}</span>
          )}
        </div>
      </div>
      {trend && (
        <div
          className={`text-xs font-bold ${
            trend === "up"
              ? "text-neon-400"
              : trend === "down"
              ? "text-red-400"
              : "text-slate-400"
          }`}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
        </div>
      )}
    </div>
  );
}
