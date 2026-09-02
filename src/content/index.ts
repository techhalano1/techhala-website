import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "./types";
import { en } from "./en";
import { vi } from "./vi";

const dictionaries: Record<Locale, Dictionary> = { en, vi };

export function getDictionary(locale: string): Dictionary {
  if (!isLocale(locale)) notFound();
  return dictionaries[locale];
}

export type { Dictionary, Pillar, CaseStudy, PillarSlug } from "./types";
