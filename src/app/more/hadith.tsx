import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Arabic, Button, Card, Label, Urdu } from '../../components/ui';
import { hadithFor, HADITH } from '../../data/hadith';
import { useSettings } from '../../lib/settings';
import { addDays } from '../../lib/tracker';
import { colors, fonts } from '../../theme';

export default function HadithScreen() {
  const { settings, update } = useSettings();
  const today = new Date();
  const h = hadithFor(today);
  const coming = [1, 2, 3].map((n) => hadithFor(addDays(today, n)));

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Hadith of the day' }} />
      <Card style={{ gap: 10 }}>
        <Text style={s.label}>{today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        <Arabic size={28}>{h.arabic}</Arabic>
        <Urdu>{h.urdu}</Urdu>
        <Text style={s.english}>{h.english}</Text>
        <Text style={s.source}>
          {h.source} · {h.grade} · pending scholar review
        </Text>
      </Card>
      <Button
        label="Make an image"
        icon="image"
        variant="outline"
        onPress={() => router.push({ pathname: '/create', params: { entry: `hadith-${h.id}` } })}
      />

      <View style={s.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Daily reminder</Text>
          <Text style={s.small}>Every morning at 9:00</Text>
        </View>
        <Switch value={settings.reminders.hadith} onValueChange={(v) => update({ reminders: { ...settings.reminders, hadith: v } })} trackColor={{ true: colors.ink }} />
      </View>

      <Label>Coming days</Label>
      {coming.map((c, i) => (
        <Card key={c.id} style={{ gap: 4 }}>
          <Text style={s.small}>{addDays(today, i + 1).toLocaleDateString('en-GB', { weekday: 'long' })}</Text>
          <Text style={s.body}>{c.english}</Text>
          <Text style={s.source}>{c.source}</Text>
        </Card>
      ))}
      <Text style={s.small}>{HADITH.length} hadith in rotation, all from graded collections with the reference shown.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  label: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.goldText, textAlign: 'center' },
  english: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text, textAlign: 'center' },
  source: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
});
