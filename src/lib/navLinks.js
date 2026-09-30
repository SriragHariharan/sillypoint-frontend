export const NAV_LINKS = [
  {
    to: '/home',
    label: 'Dashboard',
    icon: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    isActive: (pathname) => pathname === '/home',
  },
  {
    to: '/tournaments',
    label: 'Tournaments',
    icon: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4',
    isActive: (pathname) => pathname.startsWith('/tournaments') && pathname !== '/tournaments/new',
  },
  {
    to: '/tournaments/new',
    label: 'Create',
    icon: 'M12 5v14M5 12h14',
    isActive: (pathname) => pathname === '/tournaments/new',
  },
]
