export interface ArchiveConfig {
  title: string
  perPage: number
  emptyText: string
  backText: string
  accentColor?: string
}

export const ARCHIVES: Record<string, ArchiveConfig> = {
  caps: {
    title: 'Kronkorken',
    perPage: 12,
    emptyText: 'Keine Kronkorken gefunden.',
    backText: 'Zurück zur Übersicht',
    accentColor: '#f2a541',
  },
  flags: {
    title: 'Fahnen',
    perPage: 12,
    emptyText: 'Keine Fahnen gefunden.',
    backText: 'Zurück zur Übersicht',
    accentColor: '#2f6fb3',
  },
  cups: {
    title: 'Pokale',
    perPage: 12,
    emptyText: 'Keine Pokale gefunden.',
    backText: 'Zurück zur Übersicht',
    accentColor: '#4a9d5f',
  },
  posts: {
    title: 'Beiträge',
    perPage: 12,
    emptyText: 'Keine Beiträge gefunden.',
    backText: 'Zurück',
    accentColor: '#2f6fb3',
  },
}
