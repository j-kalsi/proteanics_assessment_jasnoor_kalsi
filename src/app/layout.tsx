import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proteanics Editor",
  description: "A rich text editor with callout support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
