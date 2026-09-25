import Link from 'next/link';
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS, isEventCategory } from '@geekalender/shared';
import { getEvents } from '@/lib/api';

const formatMonthDay = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selected = isEventCategory(category) ? category : undefined;
  const events = await getEvents({ category: selected });

  return (
    <>
      <nav className="filters">
        <Link href="/" className={!selected ? 'active' : undefined}>
          All
        </Link>
        {EVENT_CATEGORIES.map((c) => (
          <Link key={c} href={`/?category=${c}`} className={c === selected ? 'active' : undefined}>
            {EVENT_CATEGORY_LABELS[c]}
          </Link>
        ))}
      </nav>

      <ul className="events">
        {events.map((e) => (
          <li key={e.id}>
            <time dateTime={e.date}>{formatMonthDay(e.date)}</time>
            <span className="title">{e.title}</span>
            <span className="meta">
              {e.franchise} &middot; {e.date.slice(0, 4)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
