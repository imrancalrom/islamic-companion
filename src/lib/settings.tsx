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
  /** Optional reminders beyond the five prayers. */
  reminders: { duha: boolean; tahajjud: boolean; fasting: boolean; friday: boolean; hadith: boolean; ramadan: boolean };
  /** Time for the night adhkar reminder, "HH:MM", or null for off. */
  bedtime: string | null;
  /** Taraweeh nights prayed, keyed by Hijri year. */
  taraweeh: Record<string, number[]>;
  /** Memorisation progress: Leitner box and next review day per entry. */
  memo: Record<string, { box: number; due: string }>;
  /** Zakat calculator inputs. */
  zakat: Record<string, string>;
  /** Missed (qada) prayers still to make up. */
  qada: Record<PrayerKey, number>;
  /** Tasbeeh counted today. */
  tasbeeh: { day: string; total: number };
};

export const DEFAULT_SETTINGS: Settings = {
  method: 'UmmAlQura',
  madhab: 'shafi',
  place: null,
  notify: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  adhkarReminders: true,
  prayed: {},
  adhkarDone: {},
  reminders: { duha: false, tahajjud: false, fasting: true, friday: true, hadith: true, ramadan: true },
  bedtime: null,
  taraweeh: {},
  memo: {},
  zakat: {},
  qada: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  tasbeeh: { day: '', total: 0 },
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
        if (!raw) return;
        const saved = JSON.parse(raw);
        // Merge nested objects too, so settings saved by an older version gain new keys.
        setSettings({
          ...DEFAULT_SETTINGS,
          ...saved,
          reminders: { ...DEFAULT_SETTINGS.reminders, ...saved.reminders },
          qada: { ...DEFAULT_SETTINGS.qada, ...saved.qada },
          notify: { ...DEFAULT_SETTINGS.notify, ...saved.notify },
          tasbeeh: { ...DEFAULT_SETTINGS.tasbeeh, ...saved.tasbeeh },
        });
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
