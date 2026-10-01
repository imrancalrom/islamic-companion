import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TapCounter } from '../../components/Counter';
import { Icon } from '../../components/Icon';
import { Button, Card, Chip, EntryText } from '../../components/ui';
import { GuideStep, HAJJ_DAYS, UMRAH_STEPS } from '../../data/hajj';
import { done, tick } from '../../lib/haptics';
import { colors, fonts, radius } from '../../theme';

function LapCounter({ laps }: { laps: NonNullable<GuideStep['laps']> }) {
  const [n, setN] = useState(0);
  const complete = n >= laps.count;
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <TapCounter
        value={n}
        target={laps.count}
        label={laps.label}
        size={140}
        accessibilityLabel={`${laps.label} counter`}
        onPress={() => {
          if (complete) return;
          const next = n + 1;
          setN(next);
          if (next >= laps.count) done();
          else tick();
        }}
      />
      <Text style={s.small}>{complete ? 'Complete' : laps.note}</Text>
      <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
        <View style={{ flex: 1 }}>
          <Button label="Undo" variant="outline" onPress={() => setN((x) => Math.max(0, x - 1))} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Reset" variant="outline" onPress={() => setN(0)} />
        </View>
      </View>
    </View>
  );
}

function StepCard({ step, index, checked, onCheck }: { step: GuideStep; index: number; checked: boolean; onCheck: () => void }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <Card style={{ gap: 12 }}>
      <View style={s.stepHead}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={`Mark "${step.title}" done`}
          onPress={onCheck}
          hitSlop={10}
          style={[s.num, checked && s.numOn]}
        >
          {checked ? <Icon name="check" size={16} color={colors.onInk} strokeWidth={3} /> : <Text style={s.numText}>{index + 1}</Text>}
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((v) => !v)} style={{ flex: 1, gap: 2 }}>
          {step.when ? <Text style={s.when}>{step.when}</Text> : null}
          <Text style={[s.stepTitle, checked && { color: colors.textMuted }]}>{step.title}</Text>
        </Pressable>
        <Pressable accessibilityLabel={open ? 'Collapse' : 'Expand'} onPress={() => setOpen((v) => !v)} style={s.chev}>
          <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
            <Icon name="chevronRight" size={18} color={colors.textMuted} />
          </View>
        </Pressable>
      </View>

      {open ? (
        <View style={{ gap: 12 }}>
          {step.points.map((p, i) => (
            <View key={i} style={s.point}>
              <View style={s.bullet} />
              <Text style={s.body}>{p}</Text>
            </View>
          ))}
          {step.laps ? <LapCounter laps={step.laps} /> : null}
          {step.duas?.map((d) => (
            <View key={d.id} style={s.dua}>
              <Text style={s.duaTitle}>{d.title}</Text>
              <EntryText entry={d} arabicSize={d.arabic.length > 120 ? 22 : 26} />
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

export default function HajjScreen() {
  const [which, setWhich] = useState<'umrah' | 'hajj'>('umrah');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const steps = which === 'umrah' ? UMRAH_STEPS : HAJJ_DAYS;

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Hajj & Umrah' }} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="Umrah" selected={which === 'umrah'} onPress={() => setWhich('umrah')} />
        <Chip label="Hajj (Tamattu')" selected={which === 'hajj'} onPress={() => setWhich('hajj')} />
      </View>
      <Text style={s.small}>
        {which === 'umrah'
          ? 'The steps of Umrah in order. Tick each one as you finish it.'
          : "Hajj al-Tamattu': perform Umrah first (see the Umrah tab), then these days of Hajj."}{' '}
        Scholars differ on some details; follow your own scholar or Hajj group. This guide is pending scholar review.
      </Text>
      {steps.map((step, i) => (
        <StepCard
          key={`${which}-${step.id}`}
          step={step}
          index={i}
          checked={!!checked[`${which}-${step.id}`]}
          onCheck={() => setChecked((c) => ({ ...c, [`${which}-${step.id}`]: !c[`${which}-${step.id}`] }))}
        />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  stepHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  num: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  numOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  numText: { fontFamily: fonts.bold, fontSize: 14, color: colors.goldText },
  when: { fontFamily: fonts.semibold, fontSize: 12, color: colors.goldText },
  stepTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  chev: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
  point: { flexDirection: 'row', gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold, marginTop: 8 },
  body: { flex: 1, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  dua: { gap: 8, padding: 14, borderRadius: radius.md, backgroundColor: colors.surfaceWarm },
  duaTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.goldText },
});
