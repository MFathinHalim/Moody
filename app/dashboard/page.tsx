// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/lib/mongodb";
import Journal from "@/model/journal";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  if (!session?.user?.id) redirect("/api/auth/signin");

  await connectDB();

  //@ts-ignore
  const journals = await Journal.find({ userId: session.user.id })
    .sort({ date: -1 })
    .lean();

  return (
    <DashboardClient
      journals={JSON.parse(JSON.stringify(journals))}
      user={session.user}
    />
  );
}
