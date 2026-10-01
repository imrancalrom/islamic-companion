import { hijriToGregorian } from '@tabby_ai/hijri-converter';
import { Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Card, EntryText, Label } from '../../components/ui';
import { IFTAR_DUA, QADR_DUA, RAMADAN_NOTES } from '../../data/ramadan';
import { HIJRI_MONTHS, toHijri } from '../../lib/hijri';
import { formatCountdown, formatTime, prayerTimes } from '../../lib/prayer';
import { useSettings } from '../../lib/settings';
import { colors, fonts, radius } from '../../theme';

export default function RamadanScreen() {
  const { settings, update } = useSettings();
  const now = new Date();
  const h = toHijri(now);
  const inRamadan = h.month === 9;
  const t = settings.place ? prayerTimes(settings.place, now, settings) : null;

  // Next Ramadan start (or this one's) for the countdown.
  const startYear = h.month > 9 ? h.year + 1 : h.year;
  const s0 = hijriToGregorian({ year: startYear, month: 9, day: 1 });
  const start = new Date(s0.year, s0.month - 1, s0.day);
  const daysToGo = Math.ceil((start.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 864e5);

  const yearKey = String(inRamadan ? h.year : startYear);
  const nights = settings.taraweeh[yearKey] ?? [];
  const toggleNight = (n: number) =>
    update({ taraweeh: { ...settings.taraweeh, [yearKey]: nights.includes(n) ? nights.filter((x) => x !== n) : [...nights, n] } });

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Ramadan' }} />

      {inRamadan ? (
        <View style={s.hero}>
          <Text style={s.heroLabel}>Ramadan {h.year} · day {h.day}</Text>
          {t ? (
            <View style={s.heroRow}>
              <View>
                <Text style={s.heroSmall}>Suhoor ends</Text>
                <Text style={s.heroTime}>{formatTime(t.fajr)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.heroSmall}>Iftar</Text>
                <Text style={s.heroTime}>{formatTime(t.maghrib)}</Text>
                {t.maghrib > now ? <Text style={s.heroSmall}>{formatCountdown(t.maghrib.getTime() - now.getTime())}</Text> : null}
              </View>
            </View>
          ) : (
            <Text style={s.heroSmall}>Set your location on the Prayer screen to see suhoor and iftar times.</Text>
          )}
          {h.day >= 21 ? <Text style={s.heroSmall}>The last ten nights — seek Laylat al-Qadr in the odd nights.</Text> : null}
        </View>
      ) : (
        <Card style={{ gap: 4 }}>
          <Text style={s.title}>
            Ramadan {startYear} begins in about {daysToGo} {daysToGo === 1 ? 'day' : 'days'}
          </Text>
          <Text style={s.small}>
            Expected {start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} by the Umm al-Qura
            calendar. Follow the moon sighting announced where you live. Today is {h.day} {HIJRI_MONTHS[h.month - 1]}.
          </Text>
        </Card>
      )}

      <View style={s.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Ramadan reminders</Text>
          <Text style={s.small}>Suhoor 45 minutes before Fajr, iftar at Maghrib, and the odd nights of the last ten</Text>
        </View>
        <Switch value={settings.reminders.ramadan} onValueChange={(v) => update({ reminders: { ...settings.reminders, ramadan: v } })} trackColor={{ true: colors.ink }} />
      </View>

      <Label>Taraweeh · {nights.length} of 30 nights</Label>
      <View style={s.grid}>
        {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
          const on = nights.includes(n);
          const odd = n > 20 && n % 2 === 1;
          return (
            <Pressable
              key={n}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`Night ${n}${odd ? ', an odd night of the last ten' : ''}`}
              onPress={() => toggleNight(n)}
              style={[s.night, odd && s.nightOdd, on && s.nightOn]}
            >
              {on ? <Icon name="check" size={14} color={colors.onInk} strokeWidth={3} /> : <Text style={[s.nightText, odd && { color: colors.goldText }]}>{n}</Text>}
            </Pressable>
          );
        })}
      </View>
      <Text style={s.small}>Gold outlines mark the odd nights of the last ten.</Text>

      <Card>
        <EntryText entry={IFTAR_DUA} arabicSize={26} />
      </Card>
      <Card>
        <EntryText entry={QADR_DUA} arabicSize={26} />
      </Card>

      {RAMADAN_NOTES.map((n) => (
        <Card key={n.title} style={{ gap: 4 }}>
          <Text style={s.title}>{n.title}</Text>
          <Text style={s.body}>{n.text}</Text>
          <Text style={s.small}>{n.source} · pending scholar review</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: 20, gap: 10 },
  heroLabel: { fontFamily: fonts.semibold, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.onInkMuted },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroSmall: { fontFamily: fonts.regular, fontSize: 13, color: colors.onInkMuted },
  heroTime: { fontFamily: fonts.bold, fontSize: 28, color: colors.onInk },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  night: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#C9BC9A', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  nightOdd: { borderColor: colors.gold, borderWidth: 2 },
  nightOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  nightText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
});
