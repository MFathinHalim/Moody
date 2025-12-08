"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[url('/bg-pink-sky.jpg')] bg-cover bg-center">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-white/30 backdrop-blur-xl p-10 rounded-3xl border border-white/40 shadow-xl w-6xl mx-5">
        {/* Left */}
        <div className="text-center md:text-left max-w-sm">
          <h1 className="text-5xl font-bold text-gray-800">Moody</h1>
          <p className="text-xl text-gray-700 mt-2">Your Personal Emotions</p>

          <Link
            href="/dashboard"
            className="mt-6 inline-block bg-white text-gray-800 font-bold px-8 py-3 rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>

        {/* Right */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-white/50 max-w-xs">
          <img
            src="https://cdn.polyspeak.ai/speakmaster/poly-sdispatcher/images/2c99331e-a259-403f-a0cf-359f27257fbb.WEBP"
            alt="Anime character"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </main>
  );
}
