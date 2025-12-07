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
import { useEffect, useRef } from "react";

function AllJournalsSection({
  journals,
  moodEmojis,
}: {
  journals: any[];
  moodEmojis: string[];
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(10);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = journals.filter(
      (j) =>
        j.text?.toLowerCase().includes(search.toLowerCase()) ||
        j.tags?.some((t: string) =>
          t.toLowerCase().includes(search.toLowerCase()),
        ),
    );

    if (sortBy === "latest")
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    else if (sortBy === "oldest")
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    else if (sortBy === "mood") result.sort((a, b) => b.mood - a.mood);

    return result;
  }, [journals, search, sortBy]);

  const visibleJournals = filtered.slice(0, visibleCount);

  // ♾️ Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 5, filtered.length));
        }
      },
      { threshold: 1.0 },
    );

    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [filtered.length]);

  return (
    <section className="h-full max-h-[310px] overflow-y-auto scroll-y-auto bg-green-50/50 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <div className="flex gap-2 w-full justify-between">
          <input
            type="text"
            placeholder="Search..."
            className="border border-black/10 w-full rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-pink-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-black/10 rounded-md px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mood">Mood</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 italic text-center py-10">
          No journals found 😢
        </p>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {visibleJournals.map((j) => (
            <div
              key={j._id}
              className="p-4 rounded-xl bg-none border border-black/10 hover:bg-white/90 transition-all shadow-sm"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {new Date(j.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <span className="text-xl">{moodEmojis[j.mood] || "❓"}</span>
              </div>
              <p className="font-semibold text-gray-800 mt-1">
                {j.text?.slice(0, 100) || "No content"}
              </p>
              {j.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {j.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 👇 Sentinel element for infinite scroll */}
          {visibleCount < filtered.length && (
            <div ref={listRef} className="text-center py-3 text-gray-400">
              Loading more...
            </div>
          )}
        </div>
      )}
    </section>
  );
}

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
  const [query, setQuery] = useState("");

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

    // urutkan dari terbaru ke terlama
    const sorted = [...journals].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    let count = 1;

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].date);
      const curr = new Date(sorted[i].date);

      const prevDay = new Date(
        prev.getFullYear(),
        prev.getMonth(),
        prev.getDate(),
      );
      const currDay = new Date(
        curr.getFullYear(),
        curr.getMonth(),
        curr.getDate(),
      );

      const diffDays =
        (prevDay.getTime() - currDay.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        count++;
      } else if (diffDays > 1) {
        break;
      } else {
        continue;
      }
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

  const handleEnter = (e: any) => {
    if (e.key === "Enter" && query.trim() !== "") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank",
      );
    }
  };

  return (
    <main className="h-screen flex-col container mx-auto px-5 md:px-0">
      <div className="z-10 flex justify-between align-center w-full pt-9 items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 bg-white/40 backdrop-blur-sm px-5 rounded-full py-2">
            Moody
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center cursor-pointer gap-2 bg-white/40 px-3 py-1 rounded-full hover:bg-white/70 transition"
          >
            {user?.image ? (
              <img
                src={user.image}
                referrerPolicy="no-referrer"
                className="w-8 h-8 border rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            {/* nama & email hanya muncul di desktop */}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-gray-600">
                {user?.email || "email"}
              </span>
            </div>

            <span className="text-gray-600 hidden md:block">▼</span>
          </button>

          {showMenu && (
            <>
              {/* backdrop biar klik luar nutup */}
              <div
                className="fixed inset-0 z-50"
                onClick={() => setShowMenu(false)}
              ></div>

              <div className="absolute right-0 mt-2 z-50 w-40 bg-white shadow-lg rounded-md border p-2 animate-fadeIn">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full py-2 z-50 text-center text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center my-10 md:p-8 align-center mx-auto py-3  md:bg-white/20 rounded-lg backdrop-blur-sm">
        <p className="text-3xl font-bold text-gray-600 mb-3">
          {greeting}
          <br className="md:hidden" /> {user?.name || "Friend"}
        </p>
        <div className="flex flex-wrap gap-5 w-full ">
          {/* 📈 Mood Tracker */}

          <div className="flex-2 flex flex-col gap-5">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-6 bg-pink-50/40 rounded-lg text-center shadow-sm">
                <h3 className="text-sm text-gray-600">Total Journals</h3>
                <p className="text-2xl font-bold">{totalJournals}</p>
              </div>
              <div className="p-6 bg-green-50/40 rounded-lg text-center shadow-sm">
                <h3 className="text-sm text-gray-600">Average Mood</h3>
                <p className="text-2xl font-bold">
                  {moodEmojis[Math.round(avgMood)]}
                </p>
              </div>
              <div className="p-6 bg-yellow-50/40 rounded-lg text-center shadow-sm">
                <h3 className="text-sm text-gray-600">Top Mood</h3>
                <p className="text-2xl font-bold">{topMood}</p>
              </div>
              <div className="p-6 bg-orange-50/40 rounded-lg text-center shadow-sm">
                <h3 className="text-3xl text-gray-600">🔥</h3>
                <p className="text-sm font-bold text-orange-600">
                  {streak} days
                </p>
              </div>
            </section>
            <section className="min-w-[320px] border border-pink-200 p-6 rounded-2xl shadow-sm bg-pink-50/70 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl text-gray-800">Your Mood</h2>
                  <span className="text-sm text-gray-500">
                    Last {chartData.length} days
                  </span>
                </div>
                {chartData.length === 0 ? (
                  <p className="text-gray-600 text-sm italic text-center py-10">
                    No data yet. Start journaling today! 💫
                  </p>
                ) : (
                  <div className="w-full h-[300px] rounded-xl">
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
            <section className="border border-gray-500/50 h-fit px-4 py-5 bg-white/50 rounded-xl shadow-inner-lg">
              <button
                id="add-journal-button"
                className="text-left text-gray-500 w-full pr-5 rounded-none cursor-pointer transition"
                onClick={() => setShowModal(true)}
              >
                Today I feel...
              </button>
            </section>
          </div>

          {/* 📒 Right side */}
          <div className="flex flex-1 flex-col gap-5">
            <section className="border border-gray-500/50 h-fit px-4 py-5 bg-white/50 rounded-xl shadow-inner-lg">
              <input
                placeholder="Search on Google"
                className="text-left text-gray-500 w-full pr-5 rounded-none cursor-pointer transition focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleEnter}
              />
            </section>
            <section className="border p-5 rounded-2xl max-h-fit shadow-sm border-pink-200 bg-pink-50/50">
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
            <AllJournalsSection journals={journals} moodEmojis={moodEmojis} />
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md border border-pink-100"
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
                  className="w-full border cursor-pointer border-gray-400/70 rounded-md px-2 py-1"
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
                  className="bg-[#F8F7BA] border text-black cursor-pointer px-4 py-2 rounded-md transition"
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
