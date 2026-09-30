import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Icon } from '../components/Icon';
import { Button, Card, Label } from '../components/ui';
import { detectPlace } from '../lib/location';
import { rescheduleAll } from '../lib/notifications';
import { METHODS, useSettings } from '../lib/settings';
import { colors, fonts } from '../theme';

function Radio({ label, selected, onPress, detail }: { label: string; selected: boolean; onPress: () => void; detail?: string }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={s.radioRow}>
      <View style={[s.radio, selected && s.radioOn]}>{selected ? <View style={s.radioDot} /> : null}</View>
      <View style={{ flex: 1 }}>
        <Text style={s.radioLabel}>{label}</Text>
        {detail ? <Text style={s.detail}>{detail}</Text> : null}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { settings, update } = useSettings();
  const [msg, setMsg] = useState<string | null>(null);

  async function relocate() {
    setMsg('Finding your location…');
    const res = await detectPlace().catch(() => ({ error: 'Could not get your location.' }));
    if ('error' in res) setMsg(res.error);
    else {
      update({ place: res });
      setMsg(`Location set to ${res.label}.`);
    }
  }

  async function refresh() {
    const n = await rescheduleAll(settings);
    setMsg(n > 0 ? `${n} reminders scheduled for the next 5 days.` : 'Reminders are off, or notification permission was not given.');
  }

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Label>Location</Label>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="pin" size={18} color={colors.ink} />
          <Text style={s.value}>{settings.place?.label ?? 'Not set'}</Text>
        </View>
        <Button label="Update location" variant="outline" onPress={relocate} />
      </Card>

      <Label>Calculation method</Label>
      <Card style={{ paddingVertical: 4 }}>
        {METHODS.map((m) => (
          <Radio key={m.id} label={m.label} selected={settings.method === m.id} onPress={() => update({ method: m.id })} />
        ))}
      </Card>

      <Label>Asr time</Label>
      <Card style={{ paddingVertical: 4 }}>
        <Radio label="Standard" detail="Shafi'i, Maliki, Hanbali" selected={settings.madhab === 'shafi'} onPress={() => update({ madhab: 'shafi' })} />
        <Radio label="Hanafi" detail="Later Asr time" selected={settings.madhab === 'hanafi'} onPress={() => update({ madhab: 'hanafi' })} />
      </Card>

      <Label>Reminders</Label>
      <Card style={{ gap: 8 }}>
        <View style={s.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.radioLabel}>Adhkar reminders</Text>
            <Text style={s.detail}>Morning after Fajr, evening after Asr</Text>
          </View>
          <Switch value={settings.adhkarReminders} onValueChange={(v) => update({ adhkarReminders: v })} trackColor={{ true: colors.ink }} />
        </View>
        <Text style={s.detail}>Turn each prayer's reminder on or off with the bell on the Prayer screen.</Text>
        <Button label="Refresh reminders" variant="outline" icon="refresh" onPress={refresh} />
      </Card>

      {msg ? <Text style={s.msg}>{msg}</Text> : null}

      <Text style={s.footnote}>
        Prayer times are calculated on your phone and may differ by a few minutes from your local mosque. Adjust the
        method to match. All Quran and hadith text shows its source; items marked "pending scholar review" have not yet
        been checked. Quran text: Tanzil Project (tanzil.net), Uthmani text v1.1, CC BY 3.0, used verbatim.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 40 },
  value: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, paddingVertical: 6 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#B9AD8E', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.ink },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.ink },
  radioLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  detail: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textMuted },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  msg: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  footnote: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.textMuted, marginTop: 8 },
});
