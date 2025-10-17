import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiftLogix - Train smarter, eat better, stay consistent",
  description: "A campus fitness & nutrition coach for college students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
