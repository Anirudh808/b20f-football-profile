"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveSubmission, rejectSubmission } from "@/app/actions/admin";
import { Button } from "@/app/components/ui/Button";
import { FormInput } from "@/app/components/ui/FormInput";

interface ReviewActionsProps {
  submissionId: string;
  kickSpeed: number | null;
}

export function ReviewActions({ submissionId, kickSpeed }: ReviewActionsProps) {
  const router = useRouter();
  const [isPendingApprove, startApprove] = useTransition();
  const [isPendingReject, startReject] = useTransition();
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = () => {
    setError(null);
    startApprove(async () => {
      const result = await approveSubmission(submissionId, kickSpeed);
      if (result.success) {
        router.push("/admin/reviews");
      } else {
        setError(result.error || "Failed to approve.");
      }
    });
  };

  const handleReject = () => {
    if (!rejectFeedback.trim()) {
      setError("Please provide feedback for the player.");
      return;
    }
    setError(null);
    startReject(async () => {
      const result = await rejectSubmission(submissionId, rejectFeedback);
      if (result.success) {
        router.push("/admin/reviews");
      } else {
        setError(result.error || "Failed to reject.");
      }
    });
  };

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-base font-black text-white">Review Decision</h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <p className="text-red-400 text-sm font-semibold">⚠️ {error}</p>
        </div>
      )}

      <Button
        variant="neon"
        fullWidth
        onClick={handleApprove}
        loading={isPendingApprove}
        disabled={isPendingReject}
      >
        ✅ Approve Submission
      </Button>

      {!showRejectForm ? (
        <Button
          variant="danger"
          fullWidth
          onClick={() => setShowRejectForm(true)}
          disabled={isPendingApprove}
        >
          ❌ Reject Submission
        </Button>
      ) : (
        <div className="space-y-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
          <FormInput
            label="Feedback for player"
            name="feedback"
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            placeholder="e.g. Good effort! The dribbling technique needs more practice..."
            hint="This will be visible to the player"
          />
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={handleReject}
              loading={isPendingReject}
              disabled={isPendingApprove}
            >
              Confirm Reject
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectForm(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
