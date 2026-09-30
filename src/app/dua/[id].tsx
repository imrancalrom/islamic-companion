import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { Button, Card, EntryText } from '../../components/ui';
import { findDua } from '../../data/duas';
import { colors, fonts } from '../../theme';

export default function DuaDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dua = findDua(id);

  if (!dua) {
    return <Text style={{ padding: 24, fontFamily: fonts.regular, color: colors.text }}>This dua was not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Stack.Screen options={{ title: dua.title }} />
      <Card>
        <EntryText entry={dua} arabicSize={dua.arabic.length > 120 ? 26 : 30} />
      </Card>
      {dua.count > 1 ? (
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.goldText, textAlign: 'center' }}>
          Repeat {dua.count} times
        </Text>
      ) : null}
      <Button
        label="Make an image"
        icon="image"
        variant="outline"
        onPress={() => router.push({ pathname: '/create', params: { entry: dua.id } })}
      />
    </ScrollView>
  );
}
