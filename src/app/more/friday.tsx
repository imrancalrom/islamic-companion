import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { TapCounter } from '../../components/Counter';
import { Arabic, Card, Label } from '../../components/ui';
import { QURAN, QURAN_SOURCE } from '../../data/quran.generated';
import { FRIDAY_PRACTICES, isFriday, SALAWAT } from '../../lib/friday';
import { tick, milestone } from '../../lib/haptics';
import { formatTime, prayerTimes } from '../../lib/prayer';
import { useSettings } from '../../lib/settings';
import { addDays } from '../../lib/tracker';
import { colors, fonts } from '../../theme';

function nextFriday(from: Date) {
  let d = new Date(from);
  while (!isFriday(d)) d = addDays(d, 1);
  return d;
}

export default function FridayScreen() {
  const { settings, update } = useSettings();
  const [salawat, setSalawat] = useState(0);
  const [showKahf, setShowKahf] = useState(false);
  const today = new Date();
  const friday = nextFriday(today);
  const t = settings.place ? prayerTimes(settings.place, friday, settings) : null;

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: "Jumu'ah" }} />

      <Card style={{ gap: 4 }}>
        <Text style={s.title}>{isFriday(today) ? "Jumu'ah Mubarak — today is Friday" : `Next Friday: ${friday.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`}</Text>
        {t ? (
          <Text style={s.small}>
            The last hour: {formatTime(new Date(t.maghrib.getTime() - 60 * 60000))} to Maghrib at {formatTime(t.maghrib)}
          </Text>
        ) : (
          <Text style={s.small}>Set your location on the Prayer screen to see the last hour.</Text>
        )}
      </Card>

      <View style={s.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Friday reminders</Text>
          <Text style={s.small}>Al-Kahf and salawat in the morning, the last hour before Maghrib</Text>
        </View>
        <Switch
          value={settings.reminders.friday}
          onValueChange={(v) => update({ reminders: { ...settings.reminders, friday: v } })}
          trackColor={{ true: colors.ink }}
        />
      </View>

      {FRIDAY_PRACTICES.map((p) => (
        <Card key={p.id} style={{ gap: 4 }}>
          <Text style={s.title}>{p.title}</Text>
          <Text style={s.body}>{p.why}</Text>
          <Text style={s.source}>{p.source} · pending scholar review</Text>
        </Card>
      ))}

      <Label>Salawat</Label>
      <Card style={{ gap: 10, alignItems: 'center' }}>
        <Arabic size={26}>{SALAWAT.arabic}</Arabic>
        <Text style={[s.body, { textAlign: 'center' }]}>{SALAWAT.english}</Text>
        <TapCounter
          value={salawat}
          size={130}
          label="sent"
          accessibilityLabel="Count salawat"
          onPress={() => {
            const n = salawat + 1;
            setSalawat(n);
            if (n % 100 === 0) milestone();
            else tick();
          }}
        />
      </Card>

      <Label>Surah Al-Kahf</Label>
      <Pressable accessibilityRole="button" onPress={() => setShowKahf((v) => !v)} style={s.toggle}>
        <Text style={s.toggleText}>{showKahf ? 'Hide Surah Al-Kahf' : 'Read Surah Al-Kahf (110 ayat)'}</Text>
      </Pressable>
      {showKahf ? (
        <Card style={{ gap: 8 }}>
          {QURAN['al-kahf'].bismillah ? <Arabic size={24} quran>{QURAN['al-kahf'].bismillah}</Arabic> : null}
          <Arabic size={24} quran center={false}>
            {QURAN['al-kahf'].text}
          </Arabic>
          <Text style={s.source}>Quran 18 · Arabic text: {QURAN_SOURCE}</Text>
        </Card>
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  source: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
  toggle: { minHeight: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  toggleText: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
});
