"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { calculateCompleteness } from "@/lib/utils";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function updateProfile(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });
    if (!profile) return { success: false, error: "Profile not found." };

    const heightRaw = formData.get("height") as string;
    const weightRaw = formData.get("weight") as string;
    const yearsRaw = formData.get("yearsOfExperience") as string;
    const hasPassportRaw = formData.get("hasPassport") as string;

    const updatedData = {
      avatarUrl: (formData.get("avatarUrl") as string) || undefined,
      city: (formData.get("city") as string) || undefined,
      state: (formData.get("state") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      height: heightRaw ? parseFloat(heightRaw) : undefined,
      weight: weightRaw ? parseFloat(weightRaw) : undefined,
      primaryPosition: (formData.get("primaryPosition") as string) || undefined,
      secondaryPosition: (formData.get("secondaryPosition") as string) || undefined,
      dominantFoot:
        (formData.get("dominantFoot") as "LEFT" | "RIGHT" | "BOTH") || undefined,
      currentClub: (formData.get("currentClub") as string) || undefined,
      yearsOfExperience: yearsRaw ? parseInt(yearsRaw) : undefined,
      hasPassport: hasPassportRaw === "true" ? true : hasPassportRaw === "false" ? false : undefined,
      lastPhysicalUpdate: new Date(),
    };

    // Merge with existing to recalculate completeness
    const merged = {
      avatarUrl: updatedData.avatarUrl ?? profile.avatarUrl,
      city: updatedData.city ?? profile.city,
      state: updatedData.state ?? profile.state,
      country: updatedData.country ?? profile.country,
      height: updatedData.height ?? profile.height,
      weight: updatedData.weight ?? profile.weight,
      primaryPosition: updatedData.primaryPosition ?? profile.primaryPosition,
      secondaryPosition: updatedData.secondaryPosition ?? profile.secondaryPosition,
      dominantFoot: updatedData.dominantFoot ?? profile.dominantFoot,
      currentClub: updatedData.currentClub ?? profile.currentClub,
      yearsOfExperience: updatedData.yearsOfExperience ?? profile.yearsOfExperience,
      hasPassport: updatedData.hasPassport ?? profile.hasPassport,
    };

    const profileCompleteness = calculateCompleteness(merged);

    await prisma.profile.update({
      where: { id: profile.id },
      data: { ...updatedData, profileCompleteness },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Update profile error:", err);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}
