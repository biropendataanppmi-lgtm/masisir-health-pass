import { id, type MessageKey } from "./id";

// Minimal i18n: one active locale today, structured so more can be added.
const dictionaries = { id } as const;
type Locale = keyof typeof dictionaries;
const locale: Locale = "id";

export function t(key: MessageKey): string {
  return dictionaries[locale][key] ?? key;
}

export const currentLocale = locale;
