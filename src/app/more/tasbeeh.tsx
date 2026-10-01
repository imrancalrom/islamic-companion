import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TapCounter } from '../../components/Counter';
import { Button, Chip, Label } from '../../components/ui';
import { FREE_PHRASES, FREE_TARGETS, PHRASES, PhraseId, PRESETS } from '../../data/tasbeeh';
import { done, milestone, tick } from '../../lib/haptics';
import { dayKey, useSettings } from '../../lib/settings';
import { colors, fonts, radius } from '../../theme';

type Mode = { kind: 'preset'; id: string } | { kind: 'free'; phrase: PhraseId; target: number };

export default function TasbeehScreen() {
  const { settings, update } = useSettings();
  const [mode, setMode] = useState<Mode>({ kind: 'preset', id: 'after-prayer' });
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const moving = useRef(false);

  const preset = mode.kind === 'preset' ? PRESETS.find((p) => p.id === mode.id)! : null;
  const phraseId: PhraseId = preset ? preset.steps[step].phrase : (mode as Extract<Mode, { kind: 'free' }>).phrase;
  const target = preset ? preset.steps[step].count : (mode as Extract<Mode, { kind: 'free' }>).target;
  const phrase = PHRASES[phraseId];

  const today = dayKey(new Date());
  const todayTotal = settings.tasbeeh.day === today ? settings.tasbeeh.total : 0;

  function reset(next?: Mode) {
    if (next) setMode(next);
    setStep(0);
    setCount(0);
    setFinished(false);
    moving.current = false;
  }

  function tap() {
    if (finished || moving.current) return;
    const n = count + 1;
    setCount(n);
    update({ tasbeeh: { day: today, total: todayTotal + 1 } });

    if (target && n >= target) {
      done();
      if (preset && step < preset.steps.length - 1) {
        moving.current = true;
        setTimeout(() => {
          setStep((x) => x + 1);
          setCount(0);
          moving.current = false;
        }, 500);
      } else if (preset) {
        setFinished(true);
      }
    } else if (n % 33 === 0) {
      milestone();
    } else {
      tick();
    }
  }

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Tasbeeh' }} />

      <View style={s.row}>
        {PRESETS.map((p) => (
          <Chip key={p.id} label={p.name} selected={mode.kind === 'preset' && mode.id === p.id} onPress={() => reset({ kind: 'preset', id: p.id })} />
        ))}
        <Chip label="Free count" selected={mode.kind === 'free'} onPress={() => reset({ kind: 'free', phrase: 'subhanallah', target: 33 })} />
      </View>

      {preset ? (
        <Text style={s.hint}>
          {preset.hint} · {preset.source}
        </Text>
      ) : null}

      <View style={s.phraseCard}>
        {preset ? <Text style={s.step}>Step {step + 1} of {preset.steps.length}</Text> : null}
        <Text style={s.arabic}>{phrase.arabic}</Text>
        <Text style={s.latin}>{phrase.latin}</Text>
        <Text style={s.english}>{phrase.english}</Text>
      </View>

      <View style={{ alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        {finished ? (
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={s.doneTitle}>Complete</Text>
            <Text style={s.hint}>May Allah accept it.</Text>
          </View>
        ) : (
          <TapCounter value={count} target={target || undefined} onPress={tap} accessibilityLabel={phrase.latin} />
        )}
        <Text style={s.hint}>Vibrates on each count, stronger every 33 and at the target.</Text>
      </View>

      {mode.kind === 'free' ? (
        <>
          <Label>Phrase</Label>
          <View style={s.row}>
            {FREE_PHRASES.map((id) => (
              <Chip key={id} label={PHRASES[id].latin} selected={mode.phrase === id} onPress={() => reset({ ...mode, phrase: id })} />
            ))}
          </View>
          <Label>Target</Label>
          <View style={s.row}>
            {FREE_TARGETS.map((t) => (
              <Chip key={t} label={t ? String(t) : 'No limit'} selected={mode.target === t} onPress={() => reset({ ...mode, target: t })} />
            ))}
          </View>
        </>
      ) : null}

      <Button label="Start again" variant="outline" icon="refresh" onPress={() => reset()} />
      <Text style={s.total}>Today: {todayTotal} counted</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 14, paddingBottom: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  phraseCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 18, gap: 4, alignItems: 'center' },
  step: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.goldText },
  arabic: { fontFamily: fonts.arabic, fontSize: 32, lineHeight: 60, color: colors.ink, textAlign: 'center', writingDirection: 'rtl' },
  latin: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, textAlign: 'center' },
  english: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  doneTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink },
  total: { fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
});
