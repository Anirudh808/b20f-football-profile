import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateAgeInfo } from "@/lib/utils";
import { StatusBadge } from "@/app/components/ui/Badge";
import { ReviewActions } from "./ReviewActions";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Admin — Review Submission" };

function getEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      return `https://player.vimeo.com/video/${parsed.pathname.slice(1)}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/dashboard");

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: { include: { profile: true } },
      course: true,
    },
  });

  if (!submission) notFound();

  const { age, category } = calculateAgeInfo(submission.user.dob);
  const embedUrl = getEmbedUrl(submission.videoUrl);
  const isEmbed = embedUrl !== submission.videoUrl || embedUrl.includes("embed");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/admin/reviews" className="hover:text-neon-400 transition-colors">
          ← Admin Reviews
        </Link>
        <span>/</span>
        <span className="text-slate-300">Submission #{id.slice(-6).toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: Video + course info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status banner */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-white">Review Submission</h1>
            <StatusBadge status={submission.status} />
          </div>

          {/* Video player */}
          <div className="card overflow-hidden">
            <div className="aspect-video bg-slate-900">
              {isEmbed ? (
                <iframe
                  src={embedUrl}
                  title="Player submission video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video src={submission.videoUrl} controls className="w-full h-full" />
              )}
            </div>
            <div className="p-4 flex items-center gap-3">
              <a
                href={submission.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-electric-400 hover:underline"
              >
                🔗 Open original video
              </a>
            </div>
          </div>

          {/* Metrics */}
          <div className="card p-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
              Submission Metrics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/40 rounded-xl">
                <p className="text-2xl font-black text-electric-400">
                  {submission.kickSpeed ? `${submission.kickSpeed}` : "—"}
                </p>
                <p className="text-xs text-slate-400 mt-1">Kick Speed (km/h)</p>
              </div>
              <div className="text-center p-4 bg-slate-700/40 rounded-xl">
                <p className="text-2xl font-black text-neon-400">
                  {submission.legUsed ?? "—"}
                </p>
                <p className="text-xs text-slate-400 mt-1">Leg Used</p>
              </div>
              <div className="text-center p-4 bg-slate-700/40 rounded-xl">
                <p className="text-lg font-black text-white">
                  {new Date(submission.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-slate-400 mt-1">Submitted</p>
              </div>
            </div>
          </div>

          {/* Course info */}
          <div className="card p-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
              Course
            </h3>
            <p className="text-white font-bold">{submission.course.title}</p>
            <p className="text-slate-400 text-sm mt-1">{submission.course.skillFocus}</p>
          </div>
        </div>

        {/* RIGHT: Player info + actions */}
        <div className="lg:col-span-1 space-y-5">
          {/* Player info */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Player</h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pitch-600 flex items-center justify-center font-black text-white text-lg">
                {submission.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white">{submission.user.name}</p>
                <p className="text-xs text-slate-400">{submission.user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-700/40 rounded-xl">
                <p className="text-xs text-slate-400">Age</p>
                <p className="font-bold text-white">{age}</p>
              </div>
              <div className="p-3 bg-slate-700/40 rounded-xl">
                <p className="text-xs text-slate-400">Category</p>
                <p className="font-bold text-neon-400">{category}</p>
              </div>
              {submission.user.profile?.primaryPosition && (
                <div className="p-3 bg-slate-700/40 rounded-xl col-span-2">
                  <p className="text-xs text-slate-400">Position</p>
                  <p className="font-bold text-white">
                    {submission.user.profile.primaryPosition}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Review actions — only for PENDING */}
          {submission.status === "PENDING" ? (
            <ReviewActions
              submissionId={submission.id}
              kickSpeed={submission.kickSpeed}
            />
          ) : (
            <div className="card p-6 text-center">
              <StatusBadge status={submission.status} />
              {submission.adminFeedback && (
                <div className="mt-3 p-3 bg-slate-700/40 rounded-xl text-left">
                  <p className="text-xs text-slate-400 mb-1">Admin feedback:</p>
                  <p className="text-sm text-slate-200">{submission.adminFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
