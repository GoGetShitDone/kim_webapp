import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "김비서 | AI 네이티브 백오피스",
  description:
    "AI + 블록체인 기반으로 자영업, 소상공인을 위한 백오피스 조력자 김비서 데모.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-50 antialiased`}
      >
        <div className="relative min-h-dvh w-full overflow-hidden bg-slate-950">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-[-30%] h-96 w-96 rounded-full bg-brand/25 blur-[120px] animate-[orbFloat_26s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-30%] right-[-10%] h-[28rem] w-[28rem] rounded-full bg-emerald-500/20 blur-[140px] animate-[orbDrift_32s_ease-in-out_infinite]" />
            <div className="absolute top-1/3 right-[45%] h-56 w-56 rounded-full border border-white/10 bg-white/5 blur-3xl animate-[orbFloat_18s_ease-in-out_infinite]" />
          </div>
          <div className="relative z-10 flex min-h-dvh w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
