"use server";
import { connectDB } from "@/lib/mongodb";
import Journal from "@/model/journal";

export default async function createJournal({
  userId,
  mood,
  text,
  gratitude,
  tags,
}: {
  userId: string;
  mood: number;
  text: string;
  gratitude?: string;
  tags?: string[];
}) {
  console.log("📥 createJournal called with:", {
    userId,
    mood,
    text,
    gratitude,
    tags,
  });

  await connectDB();

  const newJournal = await Journal.create({
    userId,
    mood,
    text,
    gratitude,
    tags,
  });

  console.log("✅ new journal created:", newJournal);
  return JSON.parse(JSON.stringify(newJournal));
}
