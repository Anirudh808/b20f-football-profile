import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Badge } from "@/app/components/ui/Badge";
import { SubmissionForm } from "./SubmissionForm";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  return { title: course ? `${course.title} — Courses` : "Course Not Found" };
}

function getEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
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
    return null;
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  // Check if user already has a pending/approved submission
  let existingSubmission = null;
  if (session) {
    existingSubmission = await prisma.submission.findFirst({
      where: {
        courseId: id,
        userId: session.userId,
        status: { in: ["PENDING", "APPROVED"] },
      },
    });
  }

  const embedUrl = getEmbedUrl(course.videoInstructionUrl);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/courses" className="hover:text-neon-400 transition-colors">Courses</Link>
        <span>/</span>
        <span className="text-slate-300">{course.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: Course info + video */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <Badge variant="electric" className="mb-3">
              {course.skillFocus}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">
              {course.title}
            </h1>
            <p className="text-slate-400 leading-relaxed">{course.description}</p>
          </div>

          {/* Instruction video */}
          {embedUrl ? (
            <div className="card overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  title={`${course.title} - Instruction Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
                  🎬 Instruction Video
                </p>
              </div>
            </div>
          ) : (
            <div className="card p-10 text-center">
              <p className="text-4xl mb-2">🎬</p>
              <p className="text-slate-400 text-sm">Instruction video coming soon.</p>
            </div>
          )}

          {/* Tips */}
          <div className="card p-6">
            <h3 className="text-base font-black text-white mb-3">📋 How to Submit</h3>
            <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
              <li>Watch the instruction video carefully above.</li>
              <li>Practice the drill until you&apos;re comfortable.</li>
              <li>Record your attempt and upload to YouTube or Vimeo.</li>
              <li>Paste the link and your kick speed in the form.</li>
              <li>An admin will review and approve your submission.</li>
            </ol>
          </div>
        </div>

        {/* RIGHT: Submission form */}
        <div className="lg:col-span-1">
          {!session ? (
            <div className="card p-6 text-center space-y-4">
              <p className="text-3xl">🔒</p>
              <h3 className="font-bold text-white">Sign in to Submit</h3>
              <p className="text-sm text-slate-400">
                You need an account to submit your video for review.
              </p>
              <Link href="/auth/login" className="btn-neon px-5 py-2.5 text-sm rounded-xl inline-block">
                Sign In
              </Link>
            </div>
          ) : existingSubmission ? (
            <div className="card p-6 text-center space-y-3">
              <p className="text-3xl">✅</p>
              <h3 className="font-bold text-white">Already Submitted</h3>
              <p className="text-sm text-slate-400">
                Your submission is{" "}
                <span className={`font-bold ${
                  existingSubmission.status === "APPROVED" ? "text-neon-400" : "text-yellow-400"
                }`}>
                  {existingSubmission.status.toLowerCase()}
                </span>.
              </p>
              <Link href="/dashboard" className="btn-outline text-sm px-4 py-2 rounded-xl inline-block">
                View Dashboard
              </Link>
            </div>
          ) : (
            <SubmissionForm courseId={course.id} />
          )}
        </div>
      </div>
    </div>
  );
}
