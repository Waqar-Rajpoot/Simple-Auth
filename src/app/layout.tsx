import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import StoreProvider from "@/components/StoreProvider";

export const metadata = {
  title: "User Profile Management",
  description:
    "Manage user profiles with Redux Toolkit, Mongoose, and Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Toaster />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
