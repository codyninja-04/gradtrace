'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/companies', label: 'Companies' },
  { href: '/profile', label: 'Profile' },
];

export function Header({ email }: { email: string | null }) {
  const router = useRouter();
  const pathname = usePathname();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <Link href="/dashboard" className="text-base font-bold text-ink md:hidden">
          GradTrace
        </Link>
        <nav className="hidden gap-4 text-sm md:flex">
          {/* The sidebar carries primary nav on desktop, so the header stays light. */}
        </nav>
        <div className="flex items-center gap-3">
          {email && <span className="hidden text-sm text-muted sm:inline">{email}</span>}
          <button
            onClick={signOut}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-canvas"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Compact nav row for mobile, since there is no sidebar there. */}
      <nav className="flex gap-1 border-t border-line px-2 py-1 md:hidden">
        {MOBILE_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium ${
                active ? 'bg-canvas text-ink' : 'text-muted'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
