import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "КвартираHub — Недвижимость Казахстана",
  description: "Каталог квартир по Казахстану",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
