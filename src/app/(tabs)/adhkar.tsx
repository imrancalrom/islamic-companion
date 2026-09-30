import { Link, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Button, Chip, Title } from '../../components/ui';
import { adhkarFor } from '../../data/adhkar';
import type { Session } from '../../data/types';
import { dayKey, useSettings } from '../../lib/settings';
import { colors, fonts, radius } from '../../theme';

const SESSIONS: { id: Session; label: string; hint: string }[] = [
  { id: 'morning', label: 'Morning', hint: 'After Fajr until sunrise' },
  { id: 'evening', label: 'Evening', hint: 'After Asr until Maghrib' },
  { id: 'night', label: 'Night', hint: 'Before sleeping' },
];

export default function AdhkarScreen() {
  const [session, setSession] = useState<Session>(new Date().getHours() < 12 ? 'morning' : 'evening');
  const { settings } = useSettings();
  const items = adhkarFor(session);
  const done = (settings.adhkarDone[dayKey(new Date())] ?? []).includes(session);
  const hint = SESSIONS.find((x) => x.id === session)?.hint;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(d) => d.id}
        contentContainerStyle={s.page}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 14 }}>
            <Title>Adhkar</Title>
            <View style={s.chips}>
              {SESSIONS.map((x) => (
                <Chip key={x.id} label={x.label} selected={session === x.id} onPress={() => setSession(x.id)} />
              ))}
            </View>
            <Text style={s.hint}>{hint}{done ? ' · done today' : ''}</Text>
            <Button
              label={done ? 'Read again' : 'Start with counter'}
              icon="beads"
              onPress={() => router.push({ pathname: '/dhikr/[session]', params: { session } })}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <Link href={{ pathname: '/dhikr/[session]', params: { session, start: String(index) } }} asChild>
            <Pressable style={s.item}>
              <View style={s.countBadge}>
                <Text style={s.countText}>×{item.count}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.itemSource} numberOfLines={1}>{item.source}</Text>
              </View>
              <Icon name="chevronRight" size={18} color={colors.textMuted} />
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 0 },
  chips: { flexDirection: 'row', gap: 8 },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginTop: 0 },
  countBadge: { minWidth: 48, height: 48, borderRadius: 24, paddingHorizontal: 6, backgroundColor: colors.highlight, alignItems: 'center', justifyContent: 'center' },
  countText: { fontFamily: fonts.bold, fontSize: 14, color: colors.goldText },
  itemTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  itemSource: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
});
