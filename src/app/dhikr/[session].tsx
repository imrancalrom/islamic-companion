import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, EntryText } from '../../components/ui';
import { adhkarFor } from '../../data/adhkar';
import type { Session } from '../../data/types';
import { dayKey, useSettings } from '../../lib/settings';
import { colors, fonts } from '../../theme';

const TITLES: Record<Session, string> = { morning: 'Morning adhkar', evening: 'Evening adhkar', night: 'Before sleeping' };

function tapFeedback(finished: boolean) {
  if (Platform.OS === 'web') return;
  if (finished) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export default function DhikrCounter() {
  const params = useLocalSearchParams<{ session: string; start?: string }>();
  const session: Session = params.session === 'evening' || params.session === 'night' ? params.session : 'morning';
  const items = adhkarFor(session);
  const { settings, update } = useSettings();

  const [index, setIndex] = useState(() => Math.min(Number(params.start ?? 0) || 0, items.length - 1));
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const item = items[index];

  function markSessionDone() {
    const key = dayKey(new Date());
    const list = settings.adhkarDone[key] ?? [];
    if (!list.includes(session)) {
      const recent = Object.fromEntries(Object.entries(settings.adhkarDone).sort().slice(-59));
      update({ adhkarDone: { ...recent, [key]: [...list, session] } });
    }
  }

  function goTo(i: number) {
    setCount(0);
    if (i >= items.length) {
      setFinished(true);
      markSessionDone();
      return;
    }
    setIndex(Math.max(0, i));
  }

  function tap() {
    if (count >= item.count) return; // already moving to the next dhikr
    const next = count + 1;
    const complete = next >= item.count;
    tapFeedback(complete);
    if (complete) {
      setCount(item.count);
      // Short pause so the full count is visible before moving on.
      setTimeout(() => goTo(index + 1), 450);
    } else {
      setCount(next);
    }
  }

  if (finished) {
    return (
      <SafeAreaView style={s.doneWrap} edges={['bottom']}>
        <Stack.Screen options={{ title: TITLES[session] }} />
        <Text style={s.doneArabic}>تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ</Text>
        <Text style={s.doneTitle}>{TITLES[session]} complete</Text>
        <Text style={s.doneBody}>May Allah accept it from us and from you.</Text>
        <Button label="Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const progress = (index + count / item.count) / items.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <Stack.Screen options={{ title: TITLES[session] }} />
      <View style={s.progressWrap}>
        <Text style={s.step}>{index + 1} of {items.length} · {item.title}</Text>
        <View style={s.track}><View style={[s.fill, { width: `${Math.round(progress * 100)}%` }]} /></View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 12 }}>
        <Card>
          <EntryText entry={item} arabicSize={item.arabic.length > 200 ? 24 : 30} />
        </Card>
      </ScrollView>

      <View style={s.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Count. ${count} of ${item.count}`}
          onPress={tap}
          style={({ pressed }) => [s.counter, pressed && { transform: [{ scale: 0.97 }] }]}
        >
          <Text style={s.counterValue}>{count}</Text>
          <Text style={s.counterOf}>of {item.count}</Text>
        </Pressable>
        <View style={s.footerRow}>
          <View style={{ flex: 1 }}>
            <Button label="Previous" variant="outline" onPress={() => goTo(index - 1)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label={index === items.length - 1 ? 'Finish' : 'Skip'} variant="outline" onPress={() => goTo(index + 1)} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  progressWrap: { paddingHorizontal: 20, gap: 8 },
  step: { fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted },
  track: { height: 6, borderRadius: 3, backgroundColor: '#E6DCC4', overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.ink },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, gap: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
  counter: { width: 148, height: 148, borderRadius: 74, borderWidth: 6, borderColor: colors.onInkMuted, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  counterValue: { fontFamily: fonts.bold, fontSize: 46, color: colors.onInk },
  counterOf: { fontFamily: fonts.regular, fontSize: 14, color: colors.onInkMuted },
  footerRow: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  doneWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  doneArabic: { fontFamily: fonts.arabic, fontSize: 30, lineHeight: 56, color: colors.ink, textAlign: 'center' },
  doneTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  doneBody: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 12 },
});
