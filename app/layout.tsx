import type { Metadata } from "next";
import { Rubik, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import Header from "@/components/Header";

const geistSans = Rubik({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onboarding App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        <div className="container mx-auto mt-5">
          <div className="flex flex-col">
            <OnboardingProgress />
            <main className="grow">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
