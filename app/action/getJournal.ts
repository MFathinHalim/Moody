"use server";
import { connectDB } from "@/lib/mongodb";
import Journal from "@/model/journal";

export async function getJournal(userId: string) {
  await connectDB();
  const journal = await Journal.findOne({ userId });
  return journal;
}
