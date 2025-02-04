import { Inter, Ubuntu } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

// export const metadata = {
//   title: "Budget Tracker",
//   description: "Track your budget with ease",
// };

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>Budget Tracker</title>
          {/* Favicon Icon */}
          <link rel="icon" type="image/svg+xml" href="/logo.svg" />
          <meta name="description" content="Track your budget with ease" />
        </head>
        <body className={ubuntu.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
