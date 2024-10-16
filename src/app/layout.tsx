import type { Metadata } from "next";
import "./globals.css";
import AppEntry from "./appEntry";

export const metadata: Metadata = {
  title: "ADoList",
  description: "A simple collaborative todo list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppEntry>{children}</AppEntry>
      </body>
    </html>
  );
}
