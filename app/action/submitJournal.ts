"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createJournal from "@/app/action/journal";

export async function submitJournal(formData: FormData) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/api/auth/signin");
  }

  const mood = Number(formData.get("mood"));
  const text = formData.get("text") as string;
  const gratitude = formData.get("gratitude") as string;
  const tags = formData.get("tags")?.toString().split(",") || [];

  await createJournal({ userId, mood, text, gratitude, tags });

  redirect("/dashboard"); // redirect setelah sukses
}
