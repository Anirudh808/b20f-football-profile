import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProFile — Build Your Football Legacy",
  description:
    "Build your global football profile, level up your skills through micro-courses, and get discovered by scouts. For players aged 6–18.",
};

const STATS = [
  { value: "500+", label: "Active Players" },
  { value: "50+", label: "Skill Courses" },
  { value: "25+", label: "Countries" },
  { value: "98%", label: "Player Satisfaction" },
];

const FEATURES = [
  {
    icon: "🏆",
    title: "Gamified Profile",
    desc: "Build a dynamic football profile that grows as you train. Track goals, assists, kick speed, and more.",
    accent: "neon",
  },
  {
    icon: "📹",
    title: "Micro-Courses",
    desc: "Follow expert-led video courses on dribbling, shooting, passing, and fitness. Submit your own clips for review.",
    accent: "electric",
  },
  {
    icon: "🌍",
    title: "Get Scouted",
    desc: "Your approved highlights become your global showcase. Scouts and academies can discover your talent.",
    accent: "yellow",
  },
];

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"];
const CATEGORIES = ["U8", "U10", "U12", "U14", "U16", "U18", "Senior"];

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Pitch line background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(57,255,20,0.5) 80px, rgba(57,255,20,0.5) 82px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(57,255,20,0.5) 80px, rgba(57,255,20,0.5) 82px)
            `,
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-pitch-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pitch-700/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
          {/* Category badges */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <span key={cat} className="badge badge-neon text-xs">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            Build Your{" "}
            <span className="gradient-text">Global Football</span>
            <br />
            Profile & Get{" "}
            <span className="text-electric-400">Scouted</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Level up your skills through expert micro-courses, showcase your best
            moments, and let your talent speak for itself — no matter where you play.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="btn-neon px-8 py-4 text-base rounded-xl inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              ⚽ Create My Profile — Free
            </Link>
            <Link
              href="/courses"
              className="btn-outline px-8 py-4 text-base rounded-xl inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Browse Courses
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Position tags */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            <span className="text-xs text-slate-500">For positions:</span>
            {POSITIONS.map((pos) => (
              <span key={pos} className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                {pos}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-y border-white/5 bg-slate-800/40">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black gradient-text">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Everything You Need to{" "}
            <span className="gradient-text">Level Up</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A complete platform designed for serious young players who want to grow
            their game and get noticed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-8 group hover:-translate-y-1 transition-transform duration-200">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 ${
                  f.accent === "neon"
                    ? "bg-neon-500/10"
                    : f.accent === "electric"
                    ? "bg-electric-500/10"
                    : "bg-yellow-500/10"
                }`}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-slate-800/30 border-y border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              How <span className="text-neon-400">ProFile</span> Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Profile", desc: "Sign up with your details. Your age category and position are set automatically." },
              { step: "02", title: "Complete Micro-Courses", desc: "Watch expert coaching videos and submit your own skill clips for expert review." },
              { step: "03", title: "Build Your Showcase", desc: "Approved clips populate your highlights reel — your live portfolio for scouts." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pitch-500/20 border border-pitch-400/30 flex items-center justify-center font-black text-neon-400 text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="card p-10 bg-gradient-to-br from-pitch-800 to-slate-800 border-pitch-600/30">
          <p className="text-5xl mb-4">⚽</p>
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-slate-400 mb-8">
            Join hundreds of young players building their global football identity.
            It&apos;s free to get started.
          </p>
          <Link
            href="/auth/register"
            className="btn-neon px-10 py-4 text-base rounded-xl inline-flex items-center gap-2"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} ProFile Football. Built for the next generation of players.</p>
      </footer>
    </div>
  );
}
