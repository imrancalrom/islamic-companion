import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Button, Card, Chip, Label, SourceLine } from '../../components/ui';
import { ALL_ENTRIES, findEntry } from '../../data/feelings';
import type { Entry } from '../../data/types';
import { dayKey, useSettings } from '../../lib/settings';
import { hidden, INTERVALS, isDue, review } from '../../lib/memo';
import { colors, fonts, radius } from '../../theme';

const LEVELS = ['Read', '¼ hidden', '½ hidden', '¾ hidden', 'All hidden'];

function Practice({ entry, onDone }: { entry: Entry; onDone: () => void }) {
  const { settings, update } = useSettings();
  const [level, setLevel] = useState(0);
  const [shown, setShown] = useState<Set<number>>(new Set());
  const words = entry.arabic.split(' ');
  const quran = entry.script === 'quran';
  const box = settings.memo[entry.id]?.box;

  function answer(remembered: boolean) {
    update({ memo: review(settings.memo, entry.id, remembered) });
    onDone();
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={s.title}>{entry.title}</Text>
      <View style={s.row}>
        {LEVELS.map((l, i) => (
          <Chip
            key={l}
            label={l}
            selected={level === i}
            onPress={() => {
              setLevel(i);
              setShown(new Set());
            }}
          />
        ))}
      </View>
      <Card>
        <View style={s.words}>
          {words.map((w, i) => {
            const hide = hidden(i, level) && !shown.has(i) && !/^﴿/.test(w);
            return hide ? (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`Hidden word ${i + 1}, tap to show`}
                onPress={() => setShown((x) => new Set(x).add(i))}
                style={s.blank}
              >
                <Text style={s.blankText}>{' '.repeat(Math.max(4, Math.round(w.length * 1.2)))}</Text>
              </Pressable>
            ) : (
              <Text key={i} style={[s.word, { fontFamily: quran ? fonts.quran : fonts.arabic }]}>
                {w}
              </Text>
            );
          })}
        </View>
      </Card>
      <Text style={s.small}>Recite from memory, and tap a gap to check a word.</Text>
      <SourceLine entry={entry} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Button label="Not yet" variant="outline" onPress={() => answer(false)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="I remembered it" icon="check" onPress={() => answer(true)} />
        </View>
      </View>
      <Text style={s.small}>
        {box === undefined
          ? 'Remembering it schedules the next review for tomorrow; each success doubles the gap.'
          : `Review step ${box + 1} of ${INTERVALS.length}.`}
      </Text>
    </View>
  );
}

export default function MemoriseScreen() {
  const params = useLocalSearchParams<{ entry?: string }>();
  const { settings } = useSettings();
  const [current, setCurrent] = useState<string | null>(params.entry ?? null);
  const entry = current ? findEntry(current) : null;

  const learning = ALL_ENTRIES.filter((e) => settings.memo[e.id]);
  const due = learning.filter((e) => isDue(settings.memo, e.id));
  const notStarted = ALL_ENTRIES.filter((e) => !settings.memo[e.id] && e.arabic.length < 400);

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Memorise' }} />
      {entry ? (
        <>
          <Practice key={entry.id} entry={entry} onDone={() => setCurrent(null)} />
          <Button label="Back to the list" variant="outline" onPress={() => setCurrent(null)} />
        </>
      ) : (
        <>
          <Card style={{ gap: 4 }}>
            <Text style={s.title}>{due.length ? `${due.length} to review today` : 'Nothing to review today'}</Text>
            <Text style={s.small}>Words are hidden step by step. Reviews come back after 1, 2, 4, 8, 16 and 32 days.</Text>
          </Card>
          {due.length ? <Label>Due today</Label> : null}
          {due.map((e) => (
            <Item key={e.id} entry={e} hint="Review now" onPress={() => setCurrent(e.id)} />
          ))}
          {learning.length > due.length ? <Label>Learning</Label> : null}
          {learning
            .filter((e) => !isDue(settings.memo, e.id))
            .map((e) => (
              <Item key={e.id} entry={e} hint={`Next review ${settings.memo[e.id].due === dayKey(new Date()) ? 'today' : settings.memo[e.id].due}`} onPress={() => setCurrent(e.id)} />
            ))}
          <Label>Start learning</Label>
          {notStarted.map((e) => (
            <Item key={e.id} entry={e} hint={e.source} onPress={() => setCurrent(e.id)} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

function Item({ entry, hint, onPress }: { entry: Entry; hint: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={s.item}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.itemTitle}>{entry.title}</Text>
        <Text style={s.small} numberOfLines={1}>{hint}</Text>
      </View>
      <Icon name="chevronRight" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  words: { flexDirection: 'row-reverse', flexWrap: 'wrap', columnGap: 8, rowGap: 6, justifyContent: 'center' },
  word: { fontSize: 26, lineHeight: 50, color: colors.ink, writingDirection: 'rtl' },
  blank: { minHeight: 44, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: colors.gold, backgroundColor: colors.highlight, borderRadius: 6, paddingHorizontal: 4 },
  blankText: { fontSize: 22, lineHeight: 30 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  itemTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
});
