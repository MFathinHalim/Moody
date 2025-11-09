// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { submitJournal } from "@/app/action/submitJournal";
import { signOut } from "next-auth/react";

const moodEmojis = ["😞", "😐", "🙂", "😄", "😲", "😡"];

export default function DashboardClient({
  journals,
  user,
}: {
  journals: any[];
  user: any;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const latestJournal = journals[0] || null;

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Summary data
  const totalJournals = journals.length;
  const avgMood =
    totalJournals > 0
      ? (journals.reduce((acc, j) => acc + j.mood, 0) / totalJournals).toFixed(
          1,
        )
      : 0;
  const topMood =
    totalJournals > 0
      ? moodEmojis[
          Object.entries(
            journals.reduce((acc: any, j) => {
              acc[j.mood] = (acc[j.mood] || 0) + 1;
              return acc;
            }, {}),
          ).sort((a, b) => b[1] - a[1])[0][0]
        ]
      : "❓";

  // Streak counter
  const streak = (() => {
    if (journals.length === 0) return 0;
    const sorted = [...journals].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    let count = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].date);
      const curr = new Date(sorted[i].date);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) count++;
      else break;
    }
    return count;
  })();

  // Chart data (7 hari terakhir)
  const chartData = journals
    .slice(-7)
    .reverse()
    .map((j) => ({
      date: new Date(j.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      mood: j.mood,
      emoji: moodEmojis[j.mood] || "❓",
    }));

  // Mood frequency
  const moodFrequency = Object.entries(
    journals.reduce((acc: any, j) => {
      acc[j.mood] = (acc[j.mood] || 0) + 1;
      return acc;
    }, {}),
  ).map(([mood, count]) => ({ mood: moodEmojis[mood], count }));

  // Filter + sort journals
  const filteredJournals = useMemo(() => {
    let data = journals.filter(
      (j) =>
        j.text?.toLowerCase().includes(search.toLowerCase()) ||
        j.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
    );
    if (activeTag) data = data.filter((j) => j.tags?.includes(activeTag));
    if (sortBy === "latest")
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === "oldest")
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === "mood") data.sort((a, b) => b.mood - a.mood);
    return data;
  }, [journals, search, sortBy, activeTag]);

  return (
    <main className="h-screen flex flex-col bg-[url('https://t4.ftcdn.net/jpg/04/25/71/47/360_F_425714791_144GwzyrqZ2qibkWAG5cXkk2XknX2UOt.jpg')] bg-center bg-cover relative">
      {/* 🩷 Pink overlay */}
      <div className="absolute inset-0 bg-pink-200/20 backdrop-blur-[1px]" />

      {/* 🧭 Navbar */}
      <div className="relative z-10 flex justify-between items-center p-5 border-b border-pink-200 bg-white/70 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">My Mood Journal</h1>
          <p className="text-sm text-gray-600">
            {greeting}, {user?.name?.split(" ")[0] || "Friend"} 💕
          </p>
        </div>

        {/* User + dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 bg-white/40 px-2 py-1 rounded-full hover:bg-white/70 transition"
          >
            {user?.image ? (
              <img
                src={user.image}
                referrerPolicy="no-referrer"
                className="w-8 h-8 border rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <span className="text-md text-left hidden md:block font-medium text-gray-700">
                {user?.name || "User"}
              </span>
              <span className="text-sm text-left hidden md:block font-medium text-gray-700/60">
                {user?.email || "User"}
              </span>
            </div>
            <span className="text-gray-500">▼</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-md shadow-lg rounded-lg border border-pink-100 py-1">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 rounded-md transition"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-5">
        <div className="p-5 space-y-5">
          {/* 🌈 Overview Cards */}

          <div className="flex flex-wrap gap-5 w-full ">
            {/* 📈 Mood Tracker */}

            <div className="flex-2 flex flex-col gap-5">
              <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-6 bg-pink-50 rounded-lg text-center shadow-sm">
                  <h3 className="text-sm text-gray-600">Total Journals</h3>
                  <p className="text-2xl font-bold text-pink-600">
                    {totalJournals}
                  </p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg text-center shadow-sm">
                  <h3 className="text-sm text-gray-600">Average Mood</h3>
                  <p className="text-2xl font-bold">
                    {avgMood} {moodEmojis[Math.round(avgMood)]}
                  </p>
                </div>
                <div className="p-6 bg-yellow-50 rounded-lg text-center shadow-sm">
                  <h3 className="text-sm text-gray-600">Most Frequent Mood</h3>
                  <p className="text-2xl font-bold">{topMood}</p>
                </div>
                <div className="p-6 bg-indigo-50 rounded-lg text-center shadow-sm">
                  <h3 className="text-sm text-gray-600">Current Streak 🔥</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {streak} days
                  </p>
                </div>
              </section>
              <section className="min-w-[320px] border border-pink-200 p-6 rounded-2xl shadow-sm bg-gradient-to-br from-[#FEE2E2] to-[#FDE8E8] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl opacity-40"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-xl text-gray-800">
                      Your Mood
                    </h2>
                    <span className="text-sm text-gray-500">
                      Last {chartData.length} days
                    </span>
                  </div>
                  {chartData.length === 0 ? (
                    <p className="text-gray-600 text-sm italic text-center py-10">
                      No data yet. Start journaling today! 💫
                    </p>
                  ) : (
                    <div className="w-full h-[300px] bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis
                            domain={[0, 5]}
                            ticks={[0, 1, 2, 3, 4, 5]}
                            tickFormatter={(v) => moodEmojis[v] || "❓"}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              borderRadius: "0.5rem",
                              border: "1px solid #E5E7EB",
                            }}
                            formatter={(v) => moodEmojis[v] || "❓"}
                            labelFormatter={(label) => `📅 ${label}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="mood"
                            stroke="#F9A8D4"
                            strokeWidth={3}
                            dot={{
                              r: 5,
                              fill: "#F9A8D4",
                              stroke: "#000000",
                              strokeWidth: 1,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </section>

              {/* 💕 Add Journal */}
              <section className="border border-gray-500/50 h-fit px-4 py-5 bg-white rounded-xl shadow-inner-lg">
                <button
                  id="add-journal-button"
                  className="px-4 py-2 text-left border border-gray-300 text-gray-500 w-full rounded-none cursor-pointer transition"
                  onClick={() => setShowModal(true)}
                >
                  Today I feel...
                </button>
              </section>
            </div>

            {/* 📒 Right side */}
            <div className="flex flex-1 flex-col gap-5">
              <section className="border p-5 rounded-2xl shadow-sm bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] border-green-200 text-center">
                <h2 className="font-bold text-lg text-gray-800 mb-2">
                  🌻 Daily Quote
                </h2>
                <p className="italic text-gray-700 text-sm">
                  "Even small steps count. Keep going, you’re doing amazing!" 💫
                </p>
              </section>
              <section className="flex-1 border p-5 rounded-2xl h-fit shadow-md border-pink-200 bg-gradient-to-br from-[#fef3f3] to-[#fce7f3]">
                <h2 className="font-bold text-lg text-gray-800 mb-3">
                  📝 Latest Journal
                </h2>
                {!latestJournal ? (
                  <p className="text-gray-600 text-sm italic text-center py-10">
                    No journal found. Start writing one today! ✨
                  </p>
                ) : (
                  <div className="text-sm flex flex-col space-y-3 justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(latestJournal.date).toLocaleString("id-ID")}
                      </p>
                      <h1 className="text-2xl font-bold mt-1 text-gray-800">
                        {latestJournal.text || "—"}
                      </h1>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 pt-2">
                      <div className="flex flex-wrap gap-1">
                        {latestJournal.tags?.length > 0 ? (
                          latestJournal.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No tags</span>
                        )}
                      </div>
                      <p className="text-3xl">
                        {moodEmojis[latestJournal.mood] || "❓"}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* 💕 Mood Frequency */}
              <section className="border p-5 rounded-2xl shadow-sm bg-gradient-to-br from-[#E0F2FE] to-[#DBEAFE] border-blue-200">
                <h2 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  💕 Mood Frequency
                </h2>
                {moodFrequency.length === 0 ? (
                  <p className="text-gray-500 text-sm italic text-center">
                    Not enough data yet.
                  </p>
                ) : (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={moodFrequency}>
                        <XAxis dataKey="mood" tick={{ fontSize: 20 }} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "0.75rem",
                            border: "1px solid #E5E7EB",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#93C5FD"
                          radius={[10, 10, 0, 0]}
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* 🪄 New Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md border border-pink-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                🌸 Write Your Journal
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✖
              </button>
            </div>
            <form action={submitJournal} className="space-y-4">
              <div>
                <select
                  name="mood"
                  defaultValue="2"
                  className="w-full border border-gray-400/70 rounded-md px-2 py-1"
                >
                  <option value="0">😞 Sad</option>
                  <option value="1">😐 Neutral</option>
                  <option value="2">🙂 Happy</option>
                  <option value="3">😄 Excited</option>
                  <option value="4">😲 Surprised</option>
                  <option value="5">😡 Angry</option>
                </select>
              </div>
              <div>
                <textarea
                  name="text"
                  placeholder="Write about your day..."
                  className="w-full border border-gray-400/70 rounded-md px-2 py-1"
                  rows={4}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="tags"
                  placeholder="e.g. happy, study"
                  className="w-full border border-gray-400/70 rounded-md px-2 py-1"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#F8F7BA] text-black cursor-pointer px-4 py-2 rounded-md transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
