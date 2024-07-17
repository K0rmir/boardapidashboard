import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from 'primereact/api';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "boardapi dashboard",
  description: "Created by Kormir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrimeReactProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </PrimeReactProvider>
  );
}
