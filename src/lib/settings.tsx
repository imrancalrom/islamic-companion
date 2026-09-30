import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type MethodId =
  | 'UmmAlQura'
  | 'Karachi'
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Dubai'
  | 'Kuwait'
  | 'Qatar'
  | 'NorthAmerica'
  | 'MoonsightingCommittee'
  | 'Singapore'
  | 'Turkey';

export const METHODS: { id: MethodId; label: string }[] = [
  { id: 'UmmAlQura', label: 'Umm al-Qura (Makkah)' },
  { id: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { id: 'MuslimWorldLeague', label: 'Muslim World League' },
  { id: 'Egyptian', label: 'Egyptian General Authority' },
  { id: 'Dubai', label: 'Dubai' },
  { id: 'Kuwait', label: 'Kuwait' },
  { id: 'Qatar', label: 'Qatar' },
  { id: 'NorthAmerica', label: 'ISNA (North America)' },
  { id: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { id: 'Singapore', label: 'Singapore' },
  { id: 'Turkey', label: 'Diyanet (Turkey)' },
];

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type Place = { latitude: number; longitude: number; label: string };

export type Settings = {
  method: MethodId;
  /** Asr time: 'shafi' (standard) or 'hanafi' (later). */
  madhab: 'shafi' | 'hanafi';
  place: Place | null;
  notify: Record<PrayerKey, boolean>;
  /** Reminder for morning adhkar after Fajr and evening adhkar after Asr. */
  adhkarReminders: boolean;
  /** Prayers the user has ticked off, keyed by YYYY-MM-DD. */
  prayed: Record<string, PrayerKey[]>;
  /** Adhkar sessions finished, keyed by YYYY-MM-DD. */
  adhkarDone: Record<string, string[]>;
};

export const DEFAULT_SETTINGS: Settings = {
  method: 'UmmAlQura',
  madhab: 'shafi',
  place: null,
  notify: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  adhkarReminders: true,
  prayed: {},
  adhkarDone: {},
};

const KEY = 'settings.v1';

type Ctx = {
  settings: Settings;
  ready: boolean;
  update: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, ready, update }), [settings, ready, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
