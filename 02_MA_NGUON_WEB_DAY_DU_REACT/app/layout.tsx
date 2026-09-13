import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TAPA - LUYỆN THI EPS TOPIK",
  description: "Nền tảng luyện thi EPS TOPIK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi"><body><a className="skip-link" href="#main-content">Bỏ qua điều hướng</a><Providers>{children}</Providers></body></html>
  );
}
