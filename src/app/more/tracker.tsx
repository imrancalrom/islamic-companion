import { Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stepper } from '../../components/Counter';
import { Icon } from '../../components/Icon';
import { Card, Label } from '../../components/ui';
import { PRAYER_KEYS, PRAYER_NAMES } from '../../lib/prayer';
import { dayKey, useSettings } from '../../lib/settings';
import { addDays, allPrayed, streaks, togglePrayer } from '../../lib/tracker';
import { colors, fonts, radius } from '../../theme';

export default function TrackerScreen() {
  const { settings, update } = useSettings();
  const today = new Date();
  const { current, best } = streaks(settings.prayed, today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, -i));
  const qadaTotal = PRAYER_KEYS.reduce((n, p) => n + settings.qada[p], 0);

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Prayer tracker' }} />

      <View style={s.stats}>
        <View style={s.stat}>
          <Text style={s.statValue}>{current}</Text>
          <Text style={s.statLabel}>{current === 1 ? 'day' : 'days'} in a row</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statValue}>{best}</Text>
          <Text style={s.statLabel}>best streak</Text>
        </View>
      </View>
      <Text style={s.hint}>A day counts when all five prayers are ticked. Missing a day starts the count again — just begin anew.</Text>

      <Label>Last 7 days</Label>
      <Card style={{ paddingVertical: 8, gap: 2 }}>
        <View style={s.gridRow}>
          <Text style={[s.dayLabel, s.head]}> </Text>
          {PRAYER_KEYS.map((p) => (
            <Text key={p} style={[s.cellHead, s.head]}>{PRAYER_NAMES[p].name.slice(0, 3)}</Text>
          ))}
        </View>
        {days.map((d, i) => {
          const key = dayKey(d);
          const list = settings.prayed[key] ?? [];
          return (
            <View key={key} style={s.gridRow}>
              <Text style={[s.dayLabel, allPrayed(settings.prayed, key) && { color: colors.ink, fontFamily: fonts.bold }]}>
                {i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
              </Text>
              {PRAYER_KEYS.map((p) => {
                const on = list.includes(p);
                return (
                  <Pressable
                    key={p}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={`${PRAYER_NAMES[p].name}, ${i === 0 ? 'today' : d.toDateString()}`}
                    onPress={() => update({ prayed: togglePrayer(settings.prayed, key, p) })}
                    style={s.cell}
                  >
                    <View style={[s.dot, on && s.dotOn]}>{on ? <Icon name="check" size={13} color={colors.onInk} strokeWidth={3} /> : null}</View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </Card>

      <Label>Qada — prayers to make up</Label>
      <Card style={{ paddingVertical: 6 }}>
        {PRAYER_KEYS.map((p) => (
          <Stepper key={p} label={PRAYER_NAMES[p].name} value={settings.qada[p]} onChange={(n) => update({ qada: { ...settings.qada, [p]: n } })} />
        ))}
      </Card>
      <Text style={s.hint}>
        {qadaTotal === 0 ? 'Nothing to make up. Add missed prayers here and tap − each time you pray one.' : `${qadaTotal} to make up. Tap − each time you pray one.`}
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: colors.ink, borderRadius: radius.xl, padding: 18, gap: 2 },
  statValue: { fontFamily: fonts.bold, fontSize: 34, color: colors.onInk },
  statLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.onInkMuted },
  hint: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  gridRow: { flexDirection: 'row', alignItems: 'center' },
  head: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted },
  dayLabel: { flex: 1.6, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  cellHead: { flex: 1, textAlign: 'center' },
  cell: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#C9BC9A', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.ink, borderColor: colors.ink },
});
