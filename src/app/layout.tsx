import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "../styles/globals.css";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets:['latin'],
  variable:'--font-sans',
  weight: ["400", "500", "700"],
});

const interTight = Inter({
  subsets:['latin'],
  variable:'--font-sans-tight',
  weight: ["400", "500", "700"],
});


export const metadata: Metadata = {
  title: "Mundo Pet",
  description: "Aqui voce pode ver todos os clientes agendados para o dia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable, interTight.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right"/>
      </body>
    </html>
  );
}
