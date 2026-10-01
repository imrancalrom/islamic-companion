import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Card } from '../../components/ui';
import { CLAIMS, searchClaims, Verdict, VERDICT_LABEL } from '../../data/claims';
import { colors, fonts, radius } from '../../theme';

const VERDICT_STYLE: Record<Verdict, { bg: string; fg: string }> = {
  authentic: { bg: '#DCEBDF', fg: '#1F4D3A' },
  partly: { bg: '#F1E6CC', fg: '#6B4A12' },
  weak: { bg: '#F6DED3', fg: '#8A3B1C' },
  'no-basis': { bg: '#F3D6D6', fg: '#8B1E1E' },
};

export default function ClaimsScreen() {
  const [q, setQ] = useState('');
  const results = searchClaims(q);

  return (
    <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Check a claim' }} />
      <Text style={s.small}>
        Paste or type what a post says, for example “Surah Waqiah prevents poverty”. Answers are written and checked in advance, not
        generated.
      </Text>
      <View style={s.search}>
        <Icon name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Surah name, claim or keyword"
          placeholderTextColor="#7B857F"
          accessibilityLabel="Search claims"
          multiline
          style={s.input}
        />
      </View>

      {q && results.length === 0 ? (
        <Card style={{ gap: 6 }}>
          <Text style={s.title}>Not in the list yet</Text>
          <Text style={s.body}>
            We have not checked this claim. Until a scholar has, treat any specific promise (“this surah does X”) with caution and ask
            for the hadith reference and its grading.
          </Text>
        </Card>
      ) : null}

      {results.map((c) => {
        const v = VERDICT_STYLE[c.verdict];
        return (
          <Card key={c.id} style={{ gap: 8 }}>
            <View style={[s.badge, { backgroundColor: v.bg }]}>
              <Text style={[s.badgeText, { color: v.fg }]}>{VERDICT_LABEL[c.verdict]}</Text>
            </View>
            <Text style={s.title}>“{c.claim}”</Text>
            <Text style={s.body}>{c.answer}</Text>
            {c.authentic ? (
              <View style={s.instead}>
                <Text style={s.insteadLabel}>What is authentic</Text>
                <Text style={s.body}>{c.authentic}</Text>
              </View>
            ) : null}
            <Text style={s.source}>{c.sources} · pending scholar review</Text>
          </Card>
        );
      })}
      <Text style={s.small}>{CLAIMS.length} claims checked so far.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  search: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text, minHeight: 22 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontFamily: fonts.bold, fontSize: 12 },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  instead: { gap: 2, padding: 12, borderRadius: 12, backgroundColor: colors.surfaceWarm },
  insteadLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.goldText },
  source: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
});
