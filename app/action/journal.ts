"use server";
import { connectDB } from "@/lib/mongodb";
import Journal from "@/model/journal";

export async function createJournal({
  userId,
  mood,
  text,
  gratitude,
  tags,
}: Journal) {
  await connectDB();
  const newJournal = await Journal.create({
    userId,
    mood,
    text,
    gratitude,
    tags,
  });
  return JSON.parse(JSON.stringify(newJournal));
}
