import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, IconName } from '../../components/Icon';
import { Label, Title } from '../../components/ui';
import { colors, fonts, radius } from '../../theme';

type Href =
  | '/more/tasbeeh' | '/more/tracker' | '/more/qibla' | '/more/fasting' | '/more/friday' | '/more/hajj'
  | '/more/ramadan' | '/more/feeling' | '/more/hadith' | '/more/memorise' | '/more/zakat' | '/more/claims' | '/settings';

const SECTIONS: { title: string; tools: { href: Href; icon: IconName; title: string; hint: string }[] }[] = [
  {
    title: 'Daily worship',
    tools: [
      { href: '/more/tasbeeh', icon: 'beads', title: 'Tasbeeh', hint: 'After-prayer and bedtime tasbih, or a free count' },
      { href: '/more/tracker', icon: 'chart', title: 'Prayer tracker', hint: 'Streaks and qada prayers to make up' },
      { href: '/more/qibla', icon: 'compass', title: 'Qibla', hint: 'Compass pointing to the Kaaba' },
      { href: '/more/fasting', icon: 'calendar', title: 'Sunnah fasts', hint: 'Mondays, Thursdays, White Days, Ashura, Arafah' },
      { href: '/more/friday', icon: 'star', title: "Jumu'ah", hint: 'Al-Kahf, salawat and the last hour' },
      { href: '/more/ramadan', icon: 'moon', title: 'Ramadan', hint: 'Suhoor and iftar, Taraweeh tracker, Laylat al-Qadr' },
    ],
  },
  {
    title: 'Duas and learning',
    tools: [
      { href: '/more/feeling', icon: 'heart', title: "I'm feeling…", hint: 'Duas for anxiety, sadness, gratitude, illness' },
      { href: '/more/hadith', icon: 'book', title: 'Hadith of the day', hint: 'A short graded hadith every day' },
      { href: '/more/memorise', icon: 'refresh', title: 'Memorise', hint: 'Hide words step by step, with review reminders' },
      { href: '/more/claims', icon: 'shield', title: 'Check a claim', hint: 'Is that viral message authentic?' },
    ],
  },
  {
    title: 'Practices',
    tools: [
      { href: '/more/hajj', icon: 'kaaba', title: 'Hajj & Umrah', hint: "Step-by-step guide with tawaf and sa'i counters" },
      { href: '/more/zakat', icon: 'chart', title: 'Zakat calculator', hint: 'Nisab by gold or silver, 2.5% of zakatable wealth' },
      { href: '/settings', icon: 'settings', title: 'Settings', hint: 'Location, calculation method, reminders' },
    ],
  },
];

export default function MoreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={s.page}>
        <Title>More</Title>
        {SECTIONS.map((sec) => (
          <View key={sec.title} style={{ gap: 10 }}>
            <Label>{sec.title}</Label>
            {sec.tools.map((t) => (
              <Link key={t.href} href={t.href} asChild>
                <Pressable style={s.item}>
                  <View style={s.icon}>
                    <Icon name={t.icon} color={colors.goldText} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={s.title}>{t.title}</Text>
                    <Text style={s.hint}>{t.hint}</Text>
                  </View>
                  <Icon name="chevronRight" size={18} color={colors.textMuted} />
                </Pressable>
              </Link>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 18 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  icon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.highlight, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
});
