import Link from "next/link";
import { Heading, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section className="text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <Heading as="h1" className="mt-3">
        Page not found
      </Heading>
      <p className="mt-4 text-muted">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-md bg-fg px-5 text-sm font-medium text-bg">
        TechHala
      </Link>
    </Section>
  );
}
