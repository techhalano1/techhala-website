import Link from "next/link";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <Link href="/" className="text-sm text-muted underline">
          TechHala
        </Link>
      </body>
    </html>
  );
}
