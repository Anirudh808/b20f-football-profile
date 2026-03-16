"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type ActionResult } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { FormInput } from "@/app/components/ui/FormInput";

const initialState: ActionResult = { success: false };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pitch-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-neon-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-[0_0_30px_rgba(57,255,20,0.4)]">
            ⚽
          </div>
          <h1 className="text-3xl font-black text-white">Create Your Profile</h1>
          <p className="text-slate-400 text-sm mt-2">
            Start your football journey — all ages welcome
          </p>
        </div>

        <div className="card p-8">
          <form action={formAction} className="space-y-5">
            {/* Error banner */}
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-400 text-lg">⚠️</span>
                <p className="text-red-400 text-sm font-semibold">{state.error}</p>
              </div>
            )}

            {/* Personal info */}
            <div className="space-y-1 mb-2">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Player Info
              </p>
            </div>

            <FormInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="e.g. Marcus Johnson"
              required
              autoComplete="name"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="player@email.com"
                required
                autoComplete="email"
              />
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                autoComplete="new-password"
                hint="Minimum 8 characters"
              />
            </div>

            <FormInput
              label="Date of Birth"
              name="dob"
              type="date"
              required
              hint="Used to calculate your age category (U8 to Senior)"
            />

            {/* Parent info */}
            <div className="pt-2 space-y-1">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Parent / Guardian Info
              </p>
              <p className="text-xs text-slate-500">Required for players under 18</p>
            </div>

            <FormInput
              label="Parent/Guardian Name"
              name="parentName"
              type="text"
              placeholder="e.g. Sarah Johnson"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Parent Email"
                name="parentEmail"
                type="email"
                placeholder="parent@email.com"
                required
              />
              <FormInput
                label="Parent Phone"
                name="parentPhone"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Parental consent */}
            <div className="flex items-start gap-3 p-4 bg-slate-700/40 rounded-xl border border-white/5">
              <input
                id="parentalConsent"
                name="parentalConsent"
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded accent-neon-500 cursor-pointer flex-shrink-0"
                required
              />
              <label htmlFor="parentalConsent" className="text-sm text-slate-300 cursor-pointer leading-relaxed">
                I (parent/guardian) consent to my child's registration and agree that
                submitted videos may be reviewed by platform administrators.{" "}
                <span className="text-red-400">*</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="neon"
              fullWidth
              loading={isPending}
              size="lg"
            >
              Create My Profile
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-neon-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
