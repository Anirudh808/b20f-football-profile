interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  skillFocus: string;
  thumbnailUrl?: string | null;
}

const SKILL_COLORS: Record<string, string> = {
  Dribbling: "badge-electric",
  Shooting: "badge-red",
  Passing: "badge-neon",
  Defending: "badge-yellow",
  Heading: "badge-gray",
  Fitness: "badge-yellow",
  Goalkeeping: "badge-electric",
};

const SKILL_ICONS: Record<string, string> = {
  Dribbling: "⚡",
  Shooting: "🎯",
  Passing: "🔄",
  Defending: "🛡️",
  Heading: "📐",
  Fitness: "💪",
  Goalkeeping: "🧤",
};

export function CourseCard({
  id,
  title,
  description,
  skillFocus,
  thumbnailUrl,
}: CourseCardProps) {
  const badgeClass = SKILL_COLORS[skillFocus] || "badge-gray";
  const skillIcon = SKILL_ICONS[skillFocus] || "⚽";

  return (
    <a
      href={`/courses/${id}`}
      className="card block overflow-hidden group hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-slate-700 overflow-hidden">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pitch-800 to-slate-800">
            <span className="text-5xl opacity-60">{skillIcon}</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className={`badge ${badgeClass}`}>
            {skillIcon} {skillFocus}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-white mb-1 group-hover:text-neon-400 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2">{description}</p>
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-pitch-300 group-hover:text-neon-400 transition-colors">
          Start Course
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );
}
