import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Renaud Tixier | Rethink centuries-old watchmaking",
  description:
    "The union of two pioneering and visionary minds to shape the future of horology",
  icons: {
    icon: [
      {
        rel: "icon",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
        url: "/favicon/favicon-light.png",
      },
      {
        rel: "icon",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
        url: "/favicon/favicon-dark.png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen w-full overflow-y-hidden font-axiforma">
        <Toaster closeButton richColors />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
