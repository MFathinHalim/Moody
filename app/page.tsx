// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-[#fffdfa] via-[#fdf7f9] to-[#f6faff] overflow-x-hidden">
      {/* ✨ Soft overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(255,182,193,0.2),_transparent_50%),_radial-gradient(circle_at_bottom_left,_rgba(173,216,230,0.25),_transparent_60%)]"></div>

      {/* 🌸 Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center text-center px-6 py-32 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-blue-400 drop-shadow-sm"
        >
          Moody
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-5 text-lg md:text-xl text-gray-600 leading-relaxed"
        >
          Sebuah tempat tenang untuk menulis perasaanmu, melihat perubahan
          mood-mu, dan mengenal dirimu lebih dalam 💭
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold shadow-lg hover:shadow-pink-200 transition-all hover:scale-105"
          >
            ✨ Mulai Sekarang
          </Link>
          <a
            href="#story"
            className="px-8 py-3 rounded-full border border-pink-300 text-pink-500 hover:bg-pink-50 transition-all"
          >
            🌷 Lihat Cerita
          </a>
        </motion.div>
      </section>

      {/* 🌿 Story Section */}
      <section
        id="story"
        className="relative z-10 py-20 px-6 w-full flex flex-col items-center text-center bg-white/70 backdrop-blur-md shadow-inner"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Cerita di Balik Mood
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Kadang hari terasa berat, kadang penuh tawa 🌈 — menulis membantu kita
          memahami semuanya. Dengan{" "}
          <span className="font-semibold text-pink-500">Moody</span>, kamu bisa
          memantau emosimu tanpa tekanan, hanya dengan menulis beberapa kalimat
          kecil setiap hari.
        </p>
      </section>

      {/* 📔 Preview Section */}
      <section className="relative z-10 py-20 px-6 max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 bg-white/80 rounded-3xl shadow-lg p-6 backdrop-blur-md border border-pink-100"
        >
          <h3 className="text-2xl font-bold text-pink-500 mb-4">
            📖 Catatan Harian
          </h3>
          <p className="text-gray-600 mb-6">
            Tulis tentang harimu, ekspresikan apa yang kamu rasakan. Setiap
            catatan membentuk mozaik perasaanmu ✨
          </p>
          <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 text-left shadow-inner">
            <p className="text-sm text-gray-500">9 November 2025</p>
            <p className="mt-2 text-gray-700">
              Hari ini aku ngerasa lebih tenang dari biasanya ☁️
            </p>
            <p className="mt-3 text-3xl">🙂</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 bg-white/80 rounded-3xl shadow-lg p-6 backdrop-blur-md border border-blue-100"
        >
          <h3 className="text-2xl font-bold text-blue-500 mb-4">
            📊 Grafik Mood
          </h3>
          <p className="text-gray-600 mb-6">
            Lihat grafik mood-mu berkembang setiap hari. Warna, emosi, dan
            cerita jadi satu perjalanan 🌤️
          </p>
          <div className="h-40 w-full bg-gradient-to-r from-pink-100 via-blue-100 to-green-100 rounded-xl shadow-inner flex items-center justify-center text-gray-500 italic">
            (Mood chart preview)
          </div>
        </motion.div>
      </section>

      {/* 💌 Footer */}
      <footer className="relative z-10 mt-10 mb-6 text-gray-500 text-sm text-center">
        <p>
          Made with 💖 & pastel dreams by{" "}
          <span className="text-pink-500 font-semibold">Fathin</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          © {new Date().getFullYear()} Moody. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
