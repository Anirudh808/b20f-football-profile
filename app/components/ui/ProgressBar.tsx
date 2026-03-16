interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  colorVariant?: "neon" | "electric" | "yellow";
  size?: "sm" | "md" | "lg";
}

const colorClasses = {
  neon: "bg-gradient-to-r from-pitch-500 to-neon-400",
  electric: "bg-gradient-to-r from-electric-500 to-electric-300",
  yellow: "bg-gradient-to-r from-yellow-500 to-yellow-400",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  colorVariant = "neon",
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-semibold text-slate-300">{label}</span>
          )}
          {showPercentage && (
            <span
              className={`text-sm font-black ${
                clamped === 100
                  ? "text-neon-400"
                  : clamped > 60
                  ? "text-electric-400"
                  : "text-yellow-400"
              }`}
            >
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-700/60 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-700 ease-out ${colorClasses[colorVariant]}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
