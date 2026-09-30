import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import type { Entry } from '../data/types';
import { colors, fonts, radius } from '../theme';
import { Icon } from './Icon';

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Title({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={[s.title, style]}>{children}</Text>;
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

export function Arabic({ children, size = 28, color = colors.ink, center = true, quran = false }: { children: string; size?: number; color?: string; center?: boolean; quran?: boolean }) {
  return (
    <Text style={{ fontFamily: quran ? fonts.quran : fonts.arabic, fontSize: size, lineHeight: size * (quran ? 2.1 : 1.9), color, textAlign: center ? 'center' : 'right', writingDirection: 'rtl' }}>
      {children}
    </Text>
  );
}

export function Urdu({ children, size = 16, center = true }: { children: string; size?: number; center?: boolean }) {
  // Nastaliq needs a tall line height or the letters get clipped.
  return (
    <Text style={{ fontFamily: fonts.urdu, fontSize: size, lineHeight: size * 2.3, color: colors.text, textAlign: center ? 'center' : 'right', writingDirection: 'rtl' }}>
      {children}
    </Text>
  );
}

export function SourceLine({ entry }: { entry: Pick<Entry, 'source' | 'grade' | 'reviewed' | 'script'> }) {
  return (
    <View style={s.sourceRow}>
      <Icon name="shield" size={14} color={colors.ink} />
      <Text style={s.source}>
        {entry.source}{entry.grade === 'Quran' ? '' : ` · ${entry.grade}`}
        {entry.script === 'quran' ? ' · Arabic text: Tanzil.net' : ''}
        {!entry.reviewed ? (entry.script === 'quran' ? ' · translation pending review' : ' · pending scholar review') : ''}
      </Text>
    </View>
  );
}

/** Full text block for one dhikr or dua: Arabic, transliteration, Urdu, English, virtue, source. */
export function EntryText({ entry, arabicSize = 28 }: { entry: Entry; arabicSize?: number }) {
  return (
    <View style={{ gap: 10 }}>
      <Arabic size={arabicSize} quran={entry.script === 'quran'}>{entry.arabic}</Arabic>
      {entry.transliteration ? <Text style={s.translit}>{entry.transliteration}</Text> : null}
      <Urdu>{entry.urdu}</Urdu>
      <Text style={s.english}>{entry.english}</Text>
      {entry.virtue ? <Text style={s.virtue}>{entry.virtue}</Text> : null}
      <SourceLine entry={entry} />
    </View>
  );
}

export function Button({ label, onPress, variant = 'primary', icon }: { label: string; onPress: () => void; variant?: 'primary' | 'outline'; icon?: Parameters<typeof Icon>[0]['name'] }) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [s.button, primary ? s.buttonPrimary : s.buttonOutline, pressed && { opacity: 0.85 }]}
    >
      {icon ? <Icon name={icon} size={18} color={primary ? colors.onInk : colors.ink} /> : null}
      <Text style={[s.buttonText, { color: primary ? colors.onInk : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[s.chip, selected ? { backgroundColor: colors.ink, borderColor: colors.ink } : null]}
    >
      <Text style={[s.chipText, { color: selected ? colors.onInk : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.xl, padding: 18 },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.text },
  label: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.textMuted },
  translit: { fontFamily: fonts.regular, fontStyle: 'italic', fontSize: 15, textAlign: 'center', color: colors.textMuted },
  english: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, textAlign: 'center', color: colors.text },
  virtue: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: '#3D4A43', backgroundColor: colors.surfaceWarm, borderRadius: 14, padding: 12 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  source: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted, flexShrink: 1 },
  button: { height: 50, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 20 },
  buttonPrimary: { backgroundColor: colors.ink },
  buttonOutline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.ink },
  buttonText: { fontFamily: fonts.bold, fontSize: 16 },
  chip: { minHeight: 44, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: '#DDD0B0', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.semibold, fontSize: 14 },
});
