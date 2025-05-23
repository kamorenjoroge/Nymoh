import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tess Treasure - Admin Dashboard",
  description: "Admin dashboard for Tess Treasure ecommerce system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><SideBar />
        <Header />
        <main className="pt-16 pb-12 md:pl-64 min-h-screen bg-light">
          <div className="p-4">{children}</div>
          <Toaster position="top-right" />
        </main>
        <Footer />
      </body>
    </html>
  );
}
