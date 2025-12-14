import { Providers } from "@/utils/Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.css"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Collaborative Code Editor",
    template: "%s | Collaborative Code Editor",
  },
  description:
    "A real-time collaborative code editor that allows multiple developers to write, edit, and review code together instantly.",
  keywords: [
    "collaborative code editor",
    "real-time code editor",
    "pair programming",
    "live coding",
    "online IDE",
    "developer collaboration",
    "code sharing",
  ],
  authors: [{ name: "Vishal Bodkhe" }],
  creator: "Vishal Bodkhe",
  applicationName: "Collaborative Code Editor",

  icons: {
    icon: "/tab-logo.jpg",
    shortcut: "/tab-logo.jpg",
    apple: "/tab-logo.jpg",
  },

  openGraph: {
    title: "Collaborative Code Editor",
    description:
      "Write and collaborate on code in real time with your team. Fast, secure, and built for modern developers.",
    type: "website",
    url: "https://real-time-collaborative-code-editor-ten.vercel.app/",
    siteName: "Collaborative Code Editor",
    images: [
      {
        url: "/code-editor-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Collaborative Code Editor Preview",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </Providers>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </body>
    </html>
  );
}
