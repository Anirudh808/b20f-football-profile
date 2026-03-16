"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { ActionResult } from "./auth";
import { Prisma } from "../generated/prisma";

export async function approveSubmission(
  submissionId: string,
  kickSpeed: number | null
): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized." };
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: { include: { profile: { include: { stat: true } } } },
      },
    });

    if (!submission) return { success: false, error: "Submission not found." };

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Approve submission
      await tx.submission.update({
        where: { id: submissionId },
        data: { status: "APPROVED" },
      });

      const stat = submission.user.profile?.stat;
      if (stat) {
        const updates: { topKickSpeed?: number; coursesCompleted: number } = {
          coursesCompleted: stat.coursesCompleted + 1,
        };

        // Update kick speed only if it's a new record
        if (kickSpeed !== null && kickSpeed > stat.topKickSpeed) {
          updates.topKickSpeed = kickSpeed;
        }

        await tx.stat.update({
          where: { id: stat.id },
          data: updates,
        });
      }
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Approve submission error:", err);
    return { success: false, error: "Failed to approve submission." };
  }
}

export async function rejectSubmission(
  submissionId: string,
  feedback: string
): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "REJECTED", adminFeedback: feedback },
    });

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (err) {
    console.error("Reject submission error:", err);
    return { success: false, error: "Failed to reject submission." };
  }
}
