import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { EditProfileForm } from "./EditProfileForm";

export const metadata: Metadata = { title: "Edit Profile" };

export default async function EditProfilePage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title="Edit Your Profile"
        subtitle="Keep your profile up-to-date to improve visibility to scouts"
        actions={
          <Link href="/dashboard" className="btn-outline text-sm px-4 py-2 rounded-xl">
            ← Back to Dashboard
          </Link>
        }
      />
      <EditProfileForm profile={user.profile} />
    </div>
  );
}
