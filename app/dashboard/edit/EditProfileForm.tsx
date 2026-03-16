"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { updateProfile, type ActionResult } from "@/app/actions/profile";
import { Button } from "@/app/components/ui/Button";
import { FormInput, FormSelect } from "@/app/components/ui/FormInput";

const initialState: ActionResult = { success: false };

const POSITIONS = [
  "Goalkeeper", "Right Back", "Left Back", "Centre Back",
  "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder",
  "Right Winger", "Left Winger", "Second Striker", "Striker",
];

const FEET = [
  { value: "RIGHT", label: "Right foot" },
  { value: "LEFT", label: "Left foot" },
  { value: "BOTH", label: "Both feet" },
];

const PASSPORT = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

interface EditProfileFormProps {
  profile: {
    avatarUrl?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    height?: number | null;
    weight?: number | null;
    primaryPosition?: string | null;
    secondaryPosition?: string | null;
    dominantFoot?: string | null;
    currentClub?: string | null;
    yearsOfExperience?: number | null;
    hasPassport?: boolean | null;
  } | null;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm font-semibold">⚠️ {state.error}</p>
        </div>
      )}

      {/* Physical */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Physical Stats</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput
            label="Height (cm)"
            name="height"
            type="number"
            step="0.1"
            placeholder="e.g. 175.5"
            defaultValue={profile?.height ?? ""}
          />
          <FormInput
            label="Weight (kg)"
            name="weight"
            type="number"
            step="0.1"
            placeholder="e.g. 68.0"
            defaultValue={profile?.weight ?? ""}
          />
        </div>
        <FormInput
          label="Avatar / Photo URL"
          name="avatarUrl"
          type="url"
          placeholder="https://example.com/photo.jpg"
          defaultValue={profile?.avatarUrl ?? ""}
          hint="Link to your profile picture"
        />
      </div>

      {/* Playing info */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Playing Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormSelect
            label="Primary Position"
            name="primaryPosition"
            options={POSITIONS.map((p) => ({ value: p, label: p }))}
            placeholder="Select position"
            defaultValue={profile?.primaryPosition ?? ""}
          />
          <FormSelect
            label="Secondary Position"
            name="secondaryPosition"
            options={POSITIONS.map((p) => ({ value: p, label: p }))}
            placeholder="Select position"
            defaultValue={profile?.secondaryPosition ?? ""}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormSelect
            label="Dominant Foot"
            name="dominantFoot"
            options={FEET}
            placeholder="Select foot"
            defaultValue={profile?.dominantFoot ?? ""}
          />
          <FormInput
            label="Current Club"
            name="currentClub"
            type="text"
            placeholder="e.g. FC Barcelona Academy"
            defaultValue={profile?.currentClub ?? ""}
          />
        </div>
        <FormInput
          label="Years of Experience"
          name="yearsOfExperience"
          type="number"
          min="0"
          max="30"
          placeholder="e.g. 5"
          defaultValue={profile?.yearsOfExperience ?? ""}
        />
      </div>

      {/* Location */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Location & Travel</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <FormInput
            label="City"
            name="city"
            type="text"
            placeholder="e.g. London"
            defaultValue={profile?.city ?? ""}
          />
          <FormInput
            label="State / Region"
            name="state"
            type="text"
            placeholder="e.g. England"
            defaultValue={profile?.state ?? ""}
          />
          <FormInput
            label="Country"
            name="country"
            type="text"
            placeholder="e.g. United Kingdom"
            defaultValue={profile?.country ?? ""}
          />
        </div>
        <FormSelect
          label="Do you have a passport?"
          name="hasPassport"
          options={PASSPORT}
          placeholder="Select..."
          defaultValue={
            profile?.hasPassport === true
              ? "true"
              : profile?.hasPassport === false
              ? "false"
              : ""
          }
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="neon" loading={isPending} size="lg">
          Save Profile
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
