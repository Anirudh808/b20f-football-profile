import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CourseCard } from "@/app/components/ui/CourseCard";
import { PageHeader } from "@/app/components/ui/PageHeader";

export const metadata: Metadata = { title: "Courses — Skill Training" };

const SKILL_FILTER = [
  "All", "Dribbling", "Shooting", "Passing", "Defending", "Heading", "Fitness", "Goalkeeping",
];

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title="Skill Courses"
        accentWord="Skill"
        subtitle="Master every aspect of the beautiful game with expert-led micro-courses"
      />

      {/* Skill filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SKILL_FILTER.map((skill) => (
          <Link
            key={skill}
            href={skill === "All" ? "/courses" : `/courses?skill=${skill}`}
            className="badge badge-gray hover:badge-neon transition-all cursor-pointer text-xs"
          >
            {skill}
          </Link>
        ))}
      </div>

      {courses.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-6xl mb-4">📚</p>
          <h3 className="text-xl font-black text-white mb-2">No courses yet</h3>
          <p className="text-slate-400 text-sm">
            Courses are being added soon. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course: any) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              skillFocus={course.skillFocus}
              thumbnailUrl={course.thumbnailUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
