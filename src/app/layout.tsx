import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ElClubDelCamarón | Sistema",
  description: "Sistema del restaurante el club del Camarón",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.className}`}>
      <body>{children}</body>
      <Toaster richColors />
    </html>
  );
}
