interface VideoCardProps {
  videoUrl: string;
  title?: string;
  subtitle?: string;
  courseName?: string;
  kickSpeed?: number | null;
  createdAt?: Date | string;
}

function getEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // YouTube
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.slice(1);
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
    // Return as-is for direct video files
    return url;
  } catch {
    return url;
  }
}

export function VideoCard({
  videoUrl,
  title,
  subtitle,
  courseName,
  kickSpeed,
  createdAt,
}: VideoCardProps) {
  const embedUrl = getEmbedUrl(videoUrl);
  const isEmbed = embedUrl.includes("embed") || embedUrl.includes("player.vimeo");

  return (
    <div className="card overflow-hidden group">
      {/* Video */}
      <div className="relative aspect-video bg-slate-900">
        {isEmbed ? (
          <iframe
            src={embedUrl}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        {courseName && (
          <p className="text-xs font-semibold text-pitch-300 uppercase tracking-widest">
            ⚽ {courseName}
          </p>
        )}
        {title && (
          <h3 className="text-sm font-bold text-white">{title}</h3>
        )}
        {subtitle && (
          <p className="text-xs text-slate-400">{subtitle}</p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {kickSpeed && (
            <span className="badge badge-neon text-xs">
              💨 {kickSpeed} km/h
            </span>
          )}
          {createdAt && (
            <span className="text-xs text-slate-500">
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
