import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, IconName } from '../../components/Icon';
import { Button, Card } from '../../components/ui';
import { adhkarFor } from '../../data/adhkar';
import { detectPlace } from '../../lib/location';
import { nextFast } from '../../lib/fasting';
import { isFriday } from '../../lib/friday';
import { formatCountdown, formatTime, hijriDate, nextPrayer, sunnahTimes, timeRows } from '../../lib/prayer';
import { dayKey, PrayerKey, useSettings } from '../../lib/settings';
import { togglePrayer } from '../../lib/tracker';
import { colors, fonts, radius } from '../../theme';

const SHORTCUTS: { href: '/more/tasbeeh' | '/more/qibla' | '/more/tracker'; icon: IconName; label: string }[] = [
  { href: '/more/tasbeeh', icon: 'beads', label: 'Tasbeeh' },
  { href: '/more/qibla', icon: 'compass', label: 'Qibla' },
  { href: '/more/tracker', icon: 'chart', label: 'Tracker' },
];

function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function PrayerScreen() {
  const { settings, update } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const now = useNow();
  const place = settings.place;

  async function locate() {
    setLocating(true);
    setError(null);
    try {
      const res = await detectPlace();
      if ('error' in res) setError(res.error);
      else update({ place: res });
    } catch {
      setError('Could not get your location. Check that location services are on.');
    } finally {
      setLocating(false);
    }
  }

  const today = dayKey(now);
  const rows = useMemo(() => (place ? timeRows(place, now, settings) : []), [place, settings.method, settings.madhab, today]); // eslint-disable-line react-hooks/exhaustive-deps
  const next = place ? nextPrayer(place, now, settings) : null;
  const prayed = settings.prayed[today] ?? [];
  const hijri = hijriDate(now);
  const sunnah = place ? sunnahTimes(place, now, settings) : null;
  const fast = nextFast(now);

  // Evening adhkar after Asr, morning before.
  const session = place && rows.length && now >= rows[3].time ? 'evening' : 'morning';
  const sessionItems = adhkarFor(session).length;
  const sessionDone = (settings.adhkarDone[today] ?? []).includes(session);

  function togglePrayed(key: PrayerKey) {
    update({ prayed: togglePrayer(settings.prayed, today, key) });
  }

  function toggleNotify(key: PrayerKey) {
    update({ notify: { ...settings.notify, [key]: !settings.notify[key] } });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={s.page}>
        <View style={s.header}>
          <View style={{ gap: 2, flexShrink: 1 }}>
            <View style={s.row}>
              <Icon name="pin" size={14} color={colors.textMuted} />
              <Text style={s.muted}>{place?.label ?? 'Location not set'}</Text>
            </View>
            <Text style={s.date}>{now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
            {hijri ? <Text style={s.hijri}>{hijri} (approx.)</Text> : null}
          </View>
          <Link href="/settings" asChild>
            <Pressable accessibilityLabel="Settings" style={s.iconButton}>
              <Icon name="settings" size={20} color={colors.ink} />
            </Pressable>
          </Link>
        </View>

        {!place ? (
          <Card style={{ gap: 12 }}>
            <Text style={s.cardTitle}>Set your location</Text>
            <Text style={s.body}>
              Prayer times are calculated on your phone from your location. It is never sent anywhere.
            </Text>
            {error ? <Text style={s.error}>{error}</Text> : null}
            <Button label={locating ? 'Finding you…' : 'Use my location'} icon="pin" onPress={locate} />
          </Card>
        ) : (
          <>
            {next ? (
              <View style={s.hero}>
                <Text style={s.heroLabel}>Next prayer</Text>
                <View style={s.heroRow}>
                  <View>
                    <Text style={s.heroName}>{next.name}</Text>
                    <Text style={s.heroArabic}>{next.arabic}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.heroTime}>{formatTime(next.time)}</Text>
                    <Text style={s.heroCountdown}>{formatCountdown(next.time.getTime() - now.getTime())}</Text>
                  </View>
                </View>
              </View>
            ) : null}

            <Card style={{ paddingVertical: 4 }}>
              {rows.map((r, i) => {
                const isNext = next?.key === r.key && r.time.toDateString() === next.time.toDateString();
                const isPrayer = r.key !== 'sunrise';
                const done = isPrayer && prayed.includes(r.key as PrayerKey);
                return (
                  <View key={r.key} style={[s.timeRow, i < rows.length - 1 && s.divider, isNext && s.timeRowNext]}>
                    {isPrayer ? (
                      <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: done }}
                        accessibilityLabel={`Mark ${r.name} as prayed`}
                        onPress={() => togglePrayed(r.key as PrayerKey)}
                        hitSlop={10}
                        style={[s.check, done && s.checkOn]}
                      >
                        {done ? <Icon name="check" size={14} color={colors.onInk} strokeWidth={3} /> : null}
                      </Pressable>
                    ) : (
                      <View style={{ width: 44 }} />
                    )}
                    <Text style={[s.timeName, isNext && s.bold]}>{r.name}</Text>
                    <Text style={[s.timeValue, isNext && s.bold]}>{formatTime(r.time)}</Text>
                    {isPrayer ? (
                      <Pressable
                        accessibilityRole="switch"
                        accessibilityState={{ checked: settings.notify[r.key as PrayerKey] }}
                        accessibilityLabel={`${r.name} reminder`}
                        onPress={() => toggleNotify(r.key as PrayerKey)}
                        style={s.bell}
                      >
                        <Icon
                          name={settings.notify[r.key as PrayerKey] ? 'bell' : 'bellOff'}
                          size={18}
                          color={settings.notify[r.key as PrayerKey] ? colors.goldText : '#9AA39D'}
                        />
                      </Pressable>
                    ) : (
                      <View style={{ width: 44 }} />
                    )}
                  </View>
                );
              })}
            </Card>

            <Link href={`/dhikr/${session}`} asChild>
              <Pressable style={s.adhkarCard}>
                <View style={s.adhkarIcon}>
                  <Icon name={session === 'morning' ? 'sun' : 'moon'} color={colors.goldText} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={s.cardTitle}>{session === 'morning' ? 'Morning adhkar' : 'Evening adhkar'}</Text>
                  <Text style={s.muted}>{sessionDone ? 'Done today, alhamdulillah' : `${sessionItems} adhkar · about 10 minutes`}</Text>
                </View>
                <Icon name="chevronRight" size={18} color={colors.textMuted} />
              </Pressable>
            </Link>

            {isFriday(now) ? (
              <Link href="/more/friday" asChild>
                <Pressable style={s.friday}>
                  <Icon name="star" color={colors.onInk} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.fridayTitle}>Jumu’ah Mubarak</Text>
                    <Text style={s.fridayBody}>Read Al-Kahf, send salawat, and make dua in the last hour before Maghrib.</Text>
                  </View>
                </Pressable>
              </Link>
            ) : null}

            {sunnah ? (
              <Card style={{ gap: 10 }}>
                <View style={s.sunRow}>
                  <Text style={s.sunLabel}>Duha</Text>
                  <Text style={s.sunValue}>{formatTime(sunnah.duhaStart)} – {formatTime(sunnah.duhaEnd)}</Text>
                </View>
                <View style={s.sunRow}>
                  <Text style={s.sunLabel}>Witr</Text>
                  <Text style={s.sunValue}>After Isha until Fajr</Text>
                </View>
                <View style={s.sunRow}>
                  <Text style={s.sunLabel}>Last third of the night</Text>
                  <Text style={s.sunValue}>from {formatTime(sunnah.lastThird)}</Text>
                </View>
                {fast ? (
                  <Link href="/more/fasting" asChild>
                    <Pressable style={s.fastRow}>
                      <Text style={s.sunLabel}>Next Sunnah fast</Text>
                      <Text style={[s.sunValue, { color: colors.ink }]}>
                        {fast.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {fast.fasts[0].title}
                      </Text>
                    </Pressable>
                  </Link>
                ) : null}
              </Card>
            ) : null}

            <View style={s.shortcuts}>
              {SHORTCUTS.map((x) => (
                <Link key={x.href} href={x.href} asChild>
                  <Pressable style={s.shortcut}>
                    <Icon name={x.icon} color={colors.goldText} />
                    <Text style={s.shortcutText}>{x.label}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  date: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  hijri: { fontFamily: fonts.medium, fontSize: 13, color: colors.goldText },
  iconButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#DDD0B0', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  error: { fontFamily: fonts.medium, fontSize: 13, color: '#9B2C2C' },
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: 20, gap: 4 },
  heroLabel: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.onInkMuted },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroName: { fontFamily: fonts.bold, fontSize: 34, color: colors.onInk },
  heroArabic: { fontFamily: fonts.arabic, fontSize: 22, lineHeight: 36, color: colors.onInkMuted },
  heroTime: { fontFamily: fonts.semibold, fontSize: 28, color: colors.onInk },
  heroCountdown: { fontFamily: fonts.regular, fontSize: 14, color: colors.onInkMuted },
  timeRow: { flexDirection: 'row', alignItems: 'center', minHeight: 52 },
  timeRowNext: { backgroundColor: colors.highlight, borderRadius: 12, marginHorizontal: -8, paddingHorizontal: 8 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  check: { width: 24, height: 24, marginRight: 20, borderRadius: 12, borderWidth: 1.5, borderColor: '#C9BC9A', alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  timeName: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  timeValue: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  bold: { fontFamily: fonts.bold, color: colors.ink },
  bell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  adhkarCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  friday: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, backgroundColor: colors.goldText },
  fridayTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.onInk },
  fridayBody: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.onInk },
  sunRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  fastRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 10, minHeight: 44 },
  sunLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
  sunValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, flexShrink: 1, textAlign: 'right' },
  shortcuts: { flexDirection: 'row', gap: 10 },
  shortcut: { flex: 1, minHeight: 72, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 6 },
  shortcutText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  adhkarIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.highlight, alignItems: 'center', justifyContent: 'center' },
});
