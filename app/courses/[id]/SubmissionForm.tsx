"use client";

import { useActionState } from "react";
import { submitCourse, type ActionResult } from "@/app/actions/courses";
import { Button } from "@/app/components/ui/Button";
import { FormInput, FormSelect } from "@/app/components/ui/FormInput";

const initialState: ActionResult = { success: false };

const LEG_OPTIONS = [
  { value: "RIGHT", label: "Right foot" },
  { value: "LEFT", label: "Left foot" },
  { value: "BOTH", label: "Both feet" },
];

interface SubmissionFormProps {
  courseId: string;
}

export function SubmissionForm({ courseId }: SubmissionFormProps) {
  const [state, formAction, isPending] = useActionState(submitCourse, initialState);

  if (state?.success) {
    return (
      <div className="card p-8 text-center space-y-3">
        <p className="text-5xl">🎉</p>
        <h3 className="text-xl font-black text-white">Submission Received!</h3>
        <p className="text-slate-400 text-sm">
          Your video is now{" "}
          <span className="badge badge-yellow text-xs">⏳ Pending Review</span>
          <br />
          Once approved, it will appear in your Dashboard highlights.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-5">
      <div>
        <h3 className="text-lg font-black text-white mb-1">Submit Your Attempt</h3>
        <p className="text-slate-400 text-sm">
          Upload your video to YouTube/Vimeo and paste the link below.
          An admin will review and approve it for your highlights reel.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="courseId" value={courseId} />

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm font-semibold">⚠️ {state.error}</p>
          </div>
        )}

        <FormInput
          label="Video URL"
          name="videoUrl"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          required
          hint="YouTube, Vimeo, or any direct video link"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kick Speed (km/h)"
            name="kickSpeed"
            type="number"
            step="0.1"
            min="0"
            max="200"
            placeholder="e.g. 85.5"
            hint="Optional — measured by radar gun/app"
          />
          <FormSelect
            label="Leg Used"
            name="legUsed"
            options={LEG_OPTIONS}
            placeholder="Select..."
          />
        </div>

        <Button type="submit" variant="neon" fullWidth loading={isPending} size="lg">
          Submit for Review
        </Button>
      </form>
    </div>
  );
}
