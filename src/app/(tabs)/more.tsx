import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, IconName } from '../../components/Icon';
import { Title } from '../../components/ui';
import { colors, fonts, radius } from '../../theme';

const TOOLS: { href: '/more/tasbeeh' | '/more/tracker' | '/more/qibla' | '/more/fasting' | '/more/friday' | '/more/hajj' | '/settings'; icon: IconName; title: string; hint: string }[] = [
  { href: '/more/tasbeeh', icon: 'beads', title: 'Tasbeeh', hint: 'After-prayer and bedtime tasbih, or a free count' },
  { href: '/more/tracker', icon: 'chart', title: 'Prayer tracker', hint: 'Streaks and qada prayers to make up' },
  { href: '/more/qibla', icon: 'compass', title: 'Qibla', hint: 'Compass pointing to the Kaaba' },
  { href: '/more/fasting', icon: 'calendar', title: 'Sunnah fasts', hint: 'Mondays, Thursdays, White Days, Ashura, Arafah' },
  { href: '/more/friday', icon: 'star', title: "Jumu'ah", hint: 'Al-Kahf, salawat and the last hour' },
  { href: '/more/hajj', icon: 'kaaba', title: 'Hajj & Umrah', hint: "Step-by-step guide with tawaf and sa'i counters" },
  { href: '/settings', icon: 'settings', title: 'Settings', hint: 'Location, calculation method, reminders' },
];

export default function MoreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={s.page}>
        <Title>More</Title>
        {TOOLS.map((t) => (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  icon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.highlight, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
});
