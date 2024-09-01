import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from 'primereact/api';
import DataProvider from '@/context/DataContext';

const inter = Inter({ subsets: ["latin"] });

const chakra = Chakra_Petch({ subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"] });

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
    <DataProvider>
      <PrimeReactProvider>
        <html lang="en">
          <body className={chakra.className}>{children}</body>
        </html>
      </PrimeReactProvider>
    </DataProvider>
  );
}
