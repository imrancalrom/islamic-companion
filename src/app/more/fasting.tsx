import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Card, Label } from '../../components/ui';
import { fastingForbidden, fastsOn, isRamadan } from '../../lib/fasting';
import { formatHijri, toHijri } from '../../lib/hijri';
import { useSettings } from '../../lib/settings';
import { addDays } from '../../lib/tracker';
import { colors, fonts } from '../../theme';

export default function FastingScreen() {
  const { settings, update } = useSettings();
  const today = new Date();
  const todays = fastsOn(today);
  const forbidden = fastingForbidden(today);

  const upcoming = Array.from({ length: 30 }, (_, i) => addDays(today, i + 1))
    .map((date) => ({ date, fasts: fastsOn(date) }))
    .filter((x) => x.fasts.length);

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Sunnah fasts' }} />

      <Card style={{ gap: 6 }}>
        <Text style={s.small}>{formatHijri(toHijri(today))} (approx.)</Text>
        <Text style={s.title}>
          {forbidden ?? (isRamadan(today) ? 'Ramadan — the obligatory fast.' : todays.length ? `Today: ${todays.map((f) => f.title).join(' · ')}` : 'No Sunnah fast today.')}
        </Text>
      </Card>

      <View style={s.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Remind me the evening before</Text>
          <Text style={s.small}>After Isha, with the time suhoor ends</Text>
        </View>
        <Switch
          value={settings.reminders.fasting}
          onValueChange={(v) => update({ reminders: { ...settings.reminders, fasting: v } })}
          trackColor={{ true: colors.ink }}
        />
      </View>

      <Label>Next 30 days</Label>
      {upcoming.length === 0 ? <Text style={s.small}>No Sunnah fasts in the next 30 days.</Text> : null}
      {upcoming.map(({ date, fasts }) => (
        <Card key={date.toISOString()} style={{ gap: 6 }}>
          <View style={s.dateRow}>
            <Text style={s.date}>{date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
            <Text style={s.small}>{formatHijri(toHijri(date))}</Text>
          </View>
          {fasts.map((f) => (
            <View key={f.id} style={{ gap: 2 }}>
              <Text style={s.fastTitle}>{f.title}</Text>
              <Text style={s.body}>{f.why}</Text>
              <Text style={s.source}>{f.source} · pending scholar review</Text>
            </View>
          ))}
        </Card>
      ))}

      <Text style={s.small}>
        Dates use the Umm al-Qura calendar and can differ by a day from moon sighting where you live. Fasting is not allowed on
        the two Eids and the days of Tashriq (11–13 Dhu al-Hijjah).
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 },
  date: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  fastTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  source: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
});
