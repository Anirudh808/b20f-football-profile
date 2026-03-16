"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { setSessionCookie, clearSession } from "@/lib/auth";
import { calculateCompleteness } from "@/lib/utils";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function registerUser(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const dobString = formData.get("dob") as string;
    const parentName = formData.get("parentName") as string;
    const parentEmail = formData.get("parentEmail") as string;
    const parentPhone = (formData.get("parentPhone") as string) || undefined;
    const parentalConsent = formData.get("parentalConsent") === "on";

    // Validation
    if (!name || !email || !password || !dobString || !parentName || !parentEmail) {
      return { success: false, error: "All required fields must be filled." };
    }
    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters." };
    }
    if (!parentalConsent) {
      return { success: false, error: "Parental consent is required for registration." };
    }

    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) {
      return { success: false, error: "Invalid date of birth." };
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create User, Profile, and Stat in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          dob,
          parentName,
          parentEmail,
          parentPhone,
          parentalConsent,
        },
      });

      const profile = await tx.profile.create({
        data: { userId: newUser.id, profileCompleteness: 0 },
      });

      await tx.stat.create({
        data: { profileId: profile.id },
      });

      return newUser;
    });

    await setSessionCookie({ userId: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error("Registration error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

export async function loginUser(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    await setSessionCookie({ userId: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

export async function logoutUser(): Promise<void> {
  await clearSession();
  redirect("/");
}
