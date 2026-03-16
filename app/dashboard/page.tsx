import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateAgeInfo } from "@/lib/utils";
import { StatCard } from "@/app/components/ui/StatCard";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { VideoCard } from "@/app/components/ui/VideoCard";
import { Badge } from "@/app/components/ui/Badge";
import { PageHeader } from "@/app/components/ui/PageHeader";

export const metadata: Metadata = { title: "Dashboard" };

const PROFILE_FIELDS: { key: string; label: string; href: string }[] = [
  { key: "primaryPosition", label: "Primary position", href: "/dashboard/edit" },
  { key: "dominantFoot", label: "Dominant foot", href: "/dashboard/edit" },
  { key: "height", label: "Height & weight", href: "/dashboard/edit" },
  { key: "city", label: "City / location", href: "/dashboard/edit" },
  { key: "currentClub", label: "Current club", href: "/dashboard/edit" },
  { key: "yearsOfExperience", label: "Years of experience", href: "/dashboard/edit" },
  { key: "avatarUrl", label: "Profile photo", href: "/dashboard/edit" },
  { key: "country", label: "Country", href: "/dashboard/edit" },
];

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: { include: { stat: true } },
      submissions: {
        where: { status: "APPROVED" },
        include: { course: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  if (!user) redirect("/auth/login");

  const { age, category } = calculateAgeInfo(user.dob);
  const profile = user.profile;
  const stat = profile?.stat;
  const approvedSubmissions = user.submissions;
  const completeness = profile?.profileCompleteness ?? 0;

  // Missing fields
  const missingFields = PROFILE_FIELDS.filter(
    (f) => !profile || !profile[f.key as keyof typeof profile]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}!`}
        subtitle="Here's your football profile overview"
        actions={
          <Link href="/courses" className="btn-neon px-4 py-2 text-sm rounded-xl">
            Browse Courses ⚽
          </Link>
        }
      />

      {/* TOP ROW: Profile Card + Completeness */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 flex flex-col items-center text-center gap-4 lg:col-span-1">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-pitch-600 border-2 border-pitch-400/30 flex items-center justify-center text-3xl font-black text-white">
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-500 rounded-full flex items-center justify-center text-xs">
              ⚽
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="neon">Age {age}</Badge>
            <Badge variant="electric">{category}</Badge>
            {profile?.primaryPosition && (
              <Badge variant="yellow">{profile.primaryPosition}</Badge>
            )}
          </div>

          {profile?.dominantFoot && (
            <p className="text-xs text-slate-400">
              {profile.dominantFoot === "LEFT" ? "🦶 Left foot" :
               profile.dominantFoot === "RIGHT" ? "🦶 Right foot" : "🦶 Both feet"}
            </p>
          )}

          {profile?.currentClub && (
            <p className="text-sm font-semibold text-slate-300">
              🏟️ {profile.currentClub}
            </p>
          )}

          <Link href="/dashboard/edit" className="btn-outline text-sm px-4 py-2 rounded-xl w-full">
            ✏️ Edit Profile
          </Link>
        </div>

        {/* Completeness Widget */}
        <div className="card p-6 lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-lg font-black text-white mb-1">Profile Completeness</h3>
            <p className="text-slate-400 text-sm">
              {completeness === 100
                ? "🎉 Your profile is complete! Scouts can find you."
                : `Complete your profile to increase your visibility to scouts.`}
            </p>
          </div>

          <ProgressBar
            value={completeness}
            label="Overall Progress"
            colorVariant={completeness === 100 ? "neon" : completeness > 60 ? "electric" : "yellow"}
          />

          {missingFields.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Missing Information
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {missingFields.map((field) => (
                  <Link
                    key={field.key}
                    href={field.href}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-700/40 border border-white/5 hover:border-neon-500/30 hover:bg-pitch-800/30 transition-all text-sm text-slate-300 font-semibold group"
                  >
                    <span className="w-4 h-4 rounded-full border border-slate-500 flex-shrink-0 group-hover:border-neon-400 transition-colors" />
                    {field.label}
                    <svg className="w-3.5 h-3.5 ml-auto text-slate-500 group-hover:text-neon-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div>
        <h3 className="text-lg font-black text-white mb-4">My Stats</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Top Kick Speed"
            value={stat?.topKickSpeed ?? 0}
            unit="km/h"
            icon="💨"
            accentColor="electric"
          />
          <StatCard
            label="Total Goals"
            value={stat?.totalGoals ?? 0}
            icon="⚽"
            accentColor="neon"
          />
          <StatCard
            label="Total Assists"
            value={stat?.totalAssists ?? 0}
            icon="🎯"
            accentColor="yellow"
          />
          <StatCard
            label="Courses Done"
            value={stat?.coursesCompleted ?? 0}
            icon="📚"
            accentColor="electric"
          />
        </div>
      </div>

      {/* APPROVED HIGHLIGHTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white">My Highlights</h3>
          {approvedSubmissions.length > 0 && (
            <Link href="/courses" className="text-sm text-neon-400 font-bold hover:underline">
              Submit more →
            </Link>
          )}
        </div>

        {approvedSubmissions.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3">🎬</p>
            <h4 className="text-base font-bold text-white mb-2">No highlights yet</h4>
            <p className="text-slate-400 text-sm mb-4">
              Complete a micro-course and submit a video to build your highlights reel.
            </p>
            <Link href="/courses" className="btn-neon px-5 py-2.5 text-sm rounded-xl inline-block">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {approvedSubmissions.map((sub) => (
              <VideoCard
                key={sub.id}
                videoUrl={sub.videoUrl}
                courseName={sub.course.title}
                kickSpeed={sub.kickSpeed}
                createdAt={sub.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
