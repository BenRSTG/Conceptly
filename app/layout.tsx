import type { Metadata } from "next";
import { Inter, Yellowtail } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/lib/cart/CartContext";
import { UtmCapture } from "@/components/analytics/UtmCapture";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const scriptFont = Yellowtail({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Conceptly — Handpicked. Urban. You.",
    template: "%s — Conceptly",
  },
  description:
    "Kuratierte Deko- und Lifestyle-Produkte für ein urbanes Zuhause mit Charakter.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${bodyFont.variable} ${scriptFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-anthracite">
        <CartProvider>
          <UtmCapture />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
