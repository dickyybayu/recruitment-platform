import type {
  Metadata,
} from "next";

import "./globals.css";

import {
  QueryProvider,
} from "@/providers/query-provider";

import {
  Toaster,
} from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Recruitment Platform",
  description:
    "Multi-tenant recruitment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}

          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
