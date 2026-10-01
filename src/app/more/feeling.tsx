import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Chip, EntryText } from '../../components/ui';
import { entriesFor, FEELINGS } from '../../data/feelings';
import { colors, fonts } from '../../theme';

export default function FeelingScreen() {
  const [id, setId] = useState(FEELINGS[0].id);
  const feeling = FEELINGS.find((f) => f.id === id)!;

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: "I'm feeling…" }} />
      <View style={s.row}>
        {FEELINGS.map((f) => (
          <Chip key={f.id} label={f.label} selected={f.id === id} onPress={() => setId(f.id)} />
        ))}
      </View>
      <Text style={s.note}>{feeling.note}</Text>
      {entriesFor(feeling).map((e) => (
        <Card key={e.id} style={{ gap: 10 }}>
          <Text style={s.title}>{e.title}</Text>
          <EntryText entry={e} arabicSize={e.arabic.length > 160 ? 22 : 26} />
        </Card>
      ))}
      <Text style={s.note}>
        If you are struggling a lot, please also talk to someone you trust or a professional. Seeking help is part of trusting Allah.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
});
