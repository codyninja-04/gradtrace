'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/companies', label: 'Companies' },
  { href: '/salary', label: 'Salary tool' },
  { href: '/profile', label: 'Profile' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-line bg-white md:block">
      <div className="sticky top-0 flex h-screen flex-col px-4 py-5">
        <Link href="/dashboard" className="px-2 text-lg font-bold text-ink">
          GradTrace
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? 'bg-canvas text-ink' : 'text-muted hover:bg-canvas hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
