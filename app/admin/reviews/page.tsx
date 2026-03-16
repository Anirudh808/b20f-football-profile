import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/app/components/ui/Badge";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { calculateAgeInfo } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Pending Reviews" };

export default async function AdminReviewsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/dashboard");

  const submissions = await prisma.submission.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      course: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title="Pending Reviews"
        accentWord="Reviews"
        subtitle={`${submissions.length} submission${submissions.length !== 1 ? "s" : ""} awaiting review`}
      />

      {submissions.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">🎉</p>
          <h3 className="text-xl font-black text-white mb-2">All caught up!</h3>
          <p className="text-slate-400">No pending submissions to review.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/5 bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Player
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Course
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Kick Speed
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.map((sub: any) => {
                  const { age, category } = calculateAgeInfo(sub.user.dob);
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-white">{sub.user.name}</p>
                          <p className="text-xs text-slate-400">
                            Age {age} · {category}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-200">
                            {sub.course.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {sub.course.skillFocus}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-electric-400">
                          {sub.kickSpeed ? `${sub.kickSpeed} km/h` : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/reviews/${sub.id}`}
                          className="btn-primary text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5"
                        >
                          Review
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
