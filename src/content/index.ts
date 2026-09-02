import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "./types";
import { en } from "./en";
import { vi } from "./vi";

const dictionaries: Record<Locale, Dictionary> = { en, vi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary, Pillar, CaseStudy, PillarSlug } from "./types";
