import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "solcraft",
  description: "run your solana programs on the browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            '"JetBrains Mono", monospace, Courier, "Droid Sans Mono", "monospace", monospace',
        }}
        className="antialiased overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
