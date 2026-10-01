import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  value: number;
  target?: number;
  label?: string;
  size?: number;
  onPress: () => void;
  accessibilityLabel: string;
};

/** The big round tap counter used for tasbeeh, adhkar and tawaf laps. */
export function TapCounter({ value, target, label, size = 184, onPress, accessibilityLabel }: Props) {
  const complete = target !== undefined && value >= target;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}. ${value}${target ? ` of ${target}` : ''}`}
      onPress={onPress}
      style={({ pressed }) => [
        s.circle,
        { width: size, height: size, borderRadius: size / 2 },
        complete && { backgroundColor: colors.gold },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <Text style={[s.value, { fontSize: size * 0.3 }]}>{value}</Text>
      {target !== undefined ? <Text style={s.of}>{label ? `${label} · ` : ''}of {target}</Text> : label ? <Text style={s.of}>{label}</Text> : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  circle: { borderWidth: 6, borderColor: colors.onInkMuted, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  value: { fontFamily: fonts.bold, color: colors.onInk },
  of: { fontFamily: fonts.regular, fontSize: 14, color: colors.onInkMuted },
});

export function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <View style={st.row}>
      <Text style={st.label}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Fewer ${label}`} onPress={() => onChange(Math.max(0, value - 1))} style={st.btn}>
        <Text style={st.btnText}>−</Text>
      </Pressable>
      <Text style={st.value}>{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`More ${label}`} onPress={() => onChange(value + 1)} style={st.btn}>
        <Text style={st.btnText}>+</Text>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52 },
  label: { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.text },
  btn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#DDD0B0', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, lineHeight: 26 },
  value: { minWidth: 36, textAlign: 'center', fontFamily: fonts.bold, fontSize: 18, color: colors.text },
});
