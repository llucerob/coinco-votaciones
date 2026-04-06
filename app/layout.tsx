import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bitter, Manrope } from "next/font/google";
import "./globals.css";

const bitter = Bitter({
  variable: "--font-display",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Votaciones Concejo Coinco",
  description: "Sistema visual y local para apoyar votaciones del concejo municipal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" className={`${bitter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}