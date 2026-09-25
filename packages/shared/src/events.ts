export const EVENT_CATEGORIES = [
  'birthday',
  'tv',
  'movie',
  'game',
  'book',
  'character',
  'fandom',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  birthday: 'Actor/creator birthdays',
  tv: 'TV premieres',
  movie: 'Movie releases',
  game: 'Game releases',
  book: 'Books & comics',
  character: 'Character birthdays',
  fandom: 'Fandom events',
};

export function isEventCategory(value: unknown): value is EventCategory {
  return typeof value === 'string' && (EVENT_CATEGORIES as readonly string[]).includes(value);
}

export interface GeekEvent {
  id: string;
  title: string;
  category: EventCategory;
  /** ISO date (YYYY-MM-DD) of the original occurrence. */
  date: string;
  /** Birthdays and anniversaries recur every year on the same month/day. */
  recursAnnually: boolean;
  franchise?: string;
  description?: string;
}
