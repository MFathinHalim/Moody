import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moody",
  description: "Track your mood",
  icons: {
    icon: "/a.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
