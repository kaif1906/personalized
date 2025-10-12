import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RecipeAI - AI-Powered Recipe Recommendations",
  description: "Get personalized recipe recommendations using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Navbar />
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow pt-16">
            <Suspense fallback={<div></div>}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </div>

      </body>
    </html>
  );
}
