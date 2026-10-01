import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Chip, Label } from '../../components/ui';
import { useSettings } from '../../lib/settings';
import { colors, fonts, radius } from '../../theme';

/** Nisab thresholds in grams (85 g gold, 595 g silver). */
const NISAB_GOLD_G = 85;
const NISAB_SILVER_G = 595;
const RATE = 0.025;

const FIELDS: { key: string; label: string; hint?: string; unit: 'money' | 'grams'; sign: 1 | -1 }[] = [
  { key: 'cash', label: 'Cash and bank balances', unit: 'money', sign: 1 },
  { key: 'goldG', label: 'Gold you own', hint: 'Weight of pure gold', unit: 'grams', sign: 1 },
  { key: 'silverG', label: 'Silver you own', unit: 'grams', sign: 1 },
  { key: 'investments', label: 'Shares, savings and investments', unit: 'money', sign: 1 },
  { key: 'business', label: 'Business stock for sale', unit: 'money', sign: 1 },
  { key: 'owed', label: 'Money owed to you that you expect back', unit: 'money', sign: 1 },
  { key: 'debts', label: 'Debts and bills due now', unit: 'money', sign: -1 },
];

const num = (v?: string) => {
  const n = parseFloat((v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function ZakatScreen() {
  const { settings, update } = useSettings();
  const z = settings.zakat;
  const set = (k: string, v: string) => update({ zakat: { ...z, [k]: v } });
  const currency = z.currency || 'SAR';
  const basis = z.basis === 'gold' ? 'gold' : 'silver';
  const goldPrice = num(z.goldPrice);
  const silverPrice = num(z.silverPrice);

  const value = (f: (typeof FIELDS)[number]) =>
    f.unit === 'grams' ? num(z[f.key]) * (f.key === 'goldG' ? goldPrice : silverPrice) : num(z[f.key]);
  const total = FIELDS.reduce((sum, f) => sum + f.sign * value(f), 0);
  const nisab = basis === 'gold' ? NISAB_GOLD_G * goldPrice : NISAB_SILVER_G * silverPrice;
  const priceMissing = basis === 'gold' ? !goldPrice : !silverPrice;
  const due = !priceMissing && total >= nisab ? total * RATE : 0;
  const fmt = (n: number) => `${currency} ${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

  return (
    <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Zakat calculator' }} />

      <View style={s.result}>
        <Text style={s.resultLabel}>Zakat due</Text>
        <Text style={s.resultValue}>{fmt(due)}</Text>
        <Text style={s.resultSmall}>
          {priceMissing
            ? `Enter today's ${basis} price below to work out the nisab.`
            : total >= nisab
              ? `Your zakatable wealth ${fmt(total)} is above the nisab of ${fmt(nisab)}. Zakat is 2.5%.`
              : `Your zakatable wealth ${fmt(Math.max(0, total))} is below the nisab of ${fmt(nisab)}, so no zakat is due.`}
        </Text>
      </View>

      <Label>Prices today (per gram)</Label>
      <Card style={{ gap: 10 }}>
        <Field label="Currency" value={z.currency ?? ''} placeholder="SAR" onChange={(v) => set('currency', v.toUpperCase())} text />
        <Field label="Gold price per gram (24k)" value={z.goldPrice ?? ''} onChange={(v) => set('goldPrice', v)} />
        <Field label="Silver price per gram" value={z.silverPrice ?? ''} onChange={(v) => set('silverPrice', v)} />
        <Text style={s.small}>Check today&apos;s price with a local jeweller or bank. Prices are not fetched automatically.</Text>
      </Card>

      <Label>Nisab based on</Label>
      <View style={s.row}>
        <Chip label="Silver (595 g)" selected={basis === 'silver'} onPress={() => set('basis', 'silver')} />
        <Chip label="Gold (85 g)" selected={basis === 'gold'} onPress={() => set('basis', 'gold')} />
      </View>
      <Text style={s.small}>
        Many scholars advise the silver nisab for cash because it is lower and so more cautious for the poor; others use gold. Follow
        your scholar.
      </Text>

      <Label>What you own</Label>
      <Card style={{ gap: 10 }}>
        {FIELDS.map((f) => (
          <Field
            key={f.key}
            label={`${f.label}${f.unit === 'grams' ? ' (grams)' : ` (${currency})`}`}
            hint={f.hint}
            value={z[f.key] ?? ''}
            onChange={(v) => set(f.key, v)}
          />
        ))}
      </Card>

      <Text style={s.small}>
        Zakat is due on wealth above the nisab that you have held for a full lunar year. Your home, car, and things you use are not
        included. This is a guide, not a fatwa — ask a scholar for your situation, especially for jewellery, shares and business
        assets. Pending scholar review.
      </Text>
    </ScrollView>
  );
}

function Field({ label, hint, value, onChange, placeholder = '0', text }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; text?: boolean }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      {hint ? <Text style={s.small}>{hint}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9AA39D"
        keyboardType={text ? 'default' : 'decimal-pad'}
        autoCapitalize={text ? 'characters' : 'none'}
        accessibilityLabel={label}
        style={s.input}
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 60 },
  row: { flexDirection: 'row', gap: 8 },
  result: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: 20, gap: 4 },
  resultLabel: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.onInkMuted },
  resultValue: { fontFamily: fonts.bold, fontSize: 32, color: colors.onInk },
  resultSmall: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.onInkMuted },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  fieldLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 14, fontFamily: fonts.regular, fontSize: 16, color: colors.text },
});
