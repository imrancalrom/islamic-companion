import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Label, Title } from '../../components/ui';
import { CATEGORIES, DUAS } from '../../data/duas';
import { colors, fonts, radius } from '../../theme';

/** Removes Arabic vowel marks so a search without harakat still matches. */
const plain = (s: string) => s.toLowerCase().replace(/[ً-ٰٟۖ-ۭ]/g, '');

export default function DuasScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = plain(query.trim());
    return DUAS.filter((d) => {
      if (category && d.category !== category) return false;
      if (!q) return true;
      return [d.title, d.arabic, d.urdu, d.english, d.transliteration ?? ''].some((t) => plain(t).includes(q));
    });
  }, [query, category]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
        <Title>Duas</Title>

        <View style={s.search}>
          <Icon name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search in Arabic, Urdu or English"
            placeholderTextColor="#7B857F"
            accessibilityLabel="Search duas"
            style={s.input}
          />
        </View>

        <View style={s.grid}>
          {CATEGORIES.map((c) => {
            const on = category === c.id;
            return (
              <Pressable
                key={c.id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => setCategory(on ? null : c.id)}
                style={[s.cat, on && { backgroundColor: colors.ink, borderColor: colors.ink }]}
              >
                <Icon name={c.icon} size={20} color={on ? colors.onInk : colors.goldText} />
                <Text style={[s.catText, on && { color: colors.onInk }]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Label>{category ? CATEGORIES.find((c) => c.id === category)?.name : query ? 'Results' : 'All duas'}</Label>

        {results.length === 0 ? <Text style={s.empty}>No duas match “{query}”.</Text> : null}

        {results.map((d) => (
          <Link key={d.id} href={{ pathname: '/dua/[id]', params: { id: d.id } }} asChild>
            <Pressable style={s.item}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.itemTitle}>{d.title}</Text>
                <Text style={[s.itemArabic, d.script === 'quran' && { fontFamily: fonts.quran }]} numberOfLines={1}>{d.arabic}</Text>
                <Text style={s.itemSource}>{d.source}</Text>
              </View>
              <Icon name="chevronRight" size={18} color={colors.textMuted} />
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 14 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingHorizontal: 16, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cat: { width: '48%', flexGrow: 1, height: 60, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 },
  catText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, flexShrink: 1 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  itemTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  itemArabic: { fontFamily: fonts.arabic, fontSize: 20, lineHeight: 36, color: colors.ink, textAlign: 'right', writingDirection: 'rtl' },
  itemSource: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
});
