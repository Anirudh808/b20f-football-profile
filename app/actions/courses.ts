"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function submitCourse(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const courseId = formData.get("courseId") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const kickSpeedRaw = formData.get("kickSpeed") as string;
    const legUsed = formData.get("legUsed") as "LEFT" | "RIGHT" | "BOTH" | null;

    if (!courseId || !videoUrl) {
      return { success: false, error: "Video URL is required." };
    }

    // Basic URL validation
    try {
      new URL(videoUrl);
    } catch {
      return { success: false, error: "Please enter a valid video URL." };
    }

    const kickSpeed = kickSpeedRaw ? parseFloat(kickSpeedRaw) : undefined;

    await prisma.submission.create({
      data: {
        userId: session.userId,
        courseId,
        videoUrl,
        kickSpeed,
        legUsed: legUsed || undefined,
        status: "PENDING",
      },
    });

    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Submit course error:", err);
    return { success: false, error: "Failed to submit. Please try again." };
  }
}
