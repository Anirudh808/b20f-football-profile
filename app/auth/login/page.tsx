"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type ActionResult } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { FormInput } from "@/app/components/ui/FormInput";

const initialState: ActionResult = { success: false };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-electric-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-neon-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-[0_0_30px_rgba(57,255,20,0.4)]">
            ⚽
          </div>
          <h1 className="text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to your football profile</p>
        </div>

        <div className="card p-8">
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <p className="text-red-400 text-sm font-semibold">{state.error}</p>
              </div>
            )}

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
              placeholder="Your password"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="neon"
              fullWidth
              loading={isPending}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            New player?{" "}
            <Link href="/auth/register" className="text-neon-400 font-bold hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
