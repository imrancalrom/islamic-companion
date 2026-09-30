import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { PixelRatio, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Rect } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { Icon } from '../../components/Icon';
import { Button, Chip, Label, Title } from '../../components/ui';
import { ADHKAR } from '../../data/adhkar';
import { DUAS } from '../../data/duas';
import type { Entry } from '../../data/types';
import { colors, fonts, radius } from '../../theme';

const ALL: Entry[] = [...ADHKAR, ...DUAS];

const SIZES = [
  { id: 'post', label: 'Post 4:5', ratio: 5 / 4 },
  { id: 'story', label: 'Story 9:16', ratio: 16 / 9 },
  { id: 'square', label: 'Square', ratio: 1 },
] as const;

const THEMES = {
  green: { label: 'Green and gold', ink: '#1F4D3A', gold: '#B08A3E', paper: '#FAF6EC', frame: '#F4EFE3', text: '#34473D' },
  navy: { label: 'Navy and gold', ink: '#1E3A5F', gold: '#B08A3E', paper: '#F7F5EE', frame: '#EFEBE0', text: '#2F3D4F' },
  maroon: { label: 'Maroon', ink: '#6B2A2A', gold: '#A0763A', paper: '#FBF5EC', frame: '#F3EADB', text: '#4A3430' },
  night: { label: 'Night', ink: '#F1E2BD', gold: '#C9A55C', paper: '#15241D', frame: '#0E1914', text: '#D9CFB8' },
};
type ThemeId = keyof typeof THEMES;

/** Output width in real pixels. */
const EXPORT_WIDTH = 1080;

export default function CreateScreen() {
  const params = useLocalSearchParams<{ entry?: string }>();
  const { width: screenW } = useWindowDimensions();
  // A choice made here wins until the screen is opened again with a different entry.
  const [choice, setChoice] = useState<{ id: string; forParam?: string } | null>(null);
  const entryId =
    choice && choice.forParam === params.entry ? choice.id : (params.entry ?? choice?.id ?? 'subhanallah-wa-bihamdihi');
  const [size, setSize] = useState<(typeof SIZES)[number]['id']>('post');
  const [themeId, setThemeId] = useState<ThemeId>('green');
  const [showUrdu, setShowUrdu] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [picking, setPicking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const cardRef = useRef<View>(null);


  const entry = ALL.find((e) => e.id === entryId) ?? ALL[0];
  const t = THEMES[themeId];
  const ratio = SIZES.find((x) => x.id === size)!.ratio;

  // Preview fits the screen; the export is scaled up to 1080 px wide.
  const previewW = Math.min(screenW - 40, 360) * (size === 'story' ? 0.72 : 1);
  const previewH = previewW * ratio;
  const u = previewW / 360; // design unit

  // Shrink long text so it fits the card.
  // Start from a size estimated from the text length, then shrink until it fits the card.
  const len = entry.arabic.length + (showUrdu ? entry.urdu.length * 0.7 : 0) + (showEnglish ? entry.english.length * 0.5 : 0);
  const fit = Math.sqrt((120 * ratio) / Math.max(1, len));
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  // The shrink factor belongs to one layout; any change of text, size or screen starts again at 1.
  const layoutKey = `${entryId}|${size}|${showUrdu}|${showEnglish}|${screenW}`;
  const [shrinkState, setShrinkState] = useState({ key: layoutKey, value: 1 });
  const shrink = shrinkState.key === layoutKey ? shrinkState.value : 1;
  const [boxH, setBoxH] = useState(0);
  const arabicSize = u * clamp(40 * fit * shrink, 9, 44);
  const bodySize = u * clamp(15 * fit * shrink, 6, 16);
  function onContentLayout(h: number) {
    if (boxH > 0 && h > boxH && shrink > 0.3) setShrinkState({ key: layoutKey, value: shrink * 0.9 });
  }

  async function share() {
    setStatus(null);
    if (Platform.OS === 'web') {
      setStatus('Saving images works in the phone app. Open this on Android or iPhone.');
      return;
    }
    try {
      const px = EXPORT_WIDTH / PixelRatio.get();
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile', width: px, height: px * ratio });
      if (!(await Sharing.isAvailableAsync())) {
        setStatus('Sharing is not available on this device.');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: entry.title });
    } catch {
      setStatus('Could not create the image. Please try again.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={s.page}>
        <Title>Create image</Title>

        {/* The card that becomes the image */}
        <View style={{ alignItems: 'center' }}>
          <View
            ref={cardRef}
            collapsable={false}
            style={{ width: previewW, height: previewH, backgroundColor: t.frame, padding: 8 * u, borderRadius: 14 * u }}
          >
            <View style={{ flex: 1, borderWidth: 1.5 * u, borderColor: t.gold, borderRadius: 10 * u, padding: 5 * u }}>
              <View
                style={{
                  flex: 1,
                  borderWidth: 0.75 * u,
                  borderColor: t.gold,
                  borderRadius: 7 * u,
                  backgroundColor: t.paper,
                  paddingHorizontal: 20 * u,
                  paddingVertical: 18 * u,
                  justifyContent: 'center',
                }}
                onLayout={(e) => setBoxH(e.nativeEvent.layout.height - 36 * u)}
              >
                <View style={{ alignItems: 'center', gap: 10 * u }} onLayout={(e) => onContentLayout(e.nativeEvent.layout.height)}>
                <Svg width={30 * u} height={30 * u} viewBox="0 0 100 100">
                  <G fill="none" stroke={t.gold} strokeWidth={5}>
                    <Rect x={22} y={22} width={56} height={56} />
                    <Rect x={22} y={22} width={56} height={56} transform="rotate(45 50 50)" />
                    <Circle cx={50} cy={50} r={11} />
                  </G>
                </Svg>
                <Text style={{ fontFamily: entry.script === 'quran' ? fonts.quran : fonts.arabic, fontSize: arabicSize, lineHeight: arabicSize * (entry.script === 'quran' ? 2.05 : 1.85), color: t.ink, textAlign: 'center', writingDirection: 'rtl' }}>
                  {entry.arabic}
                </Text>
                {showUrdu ? (
                  <Text style={{ fontFamily: fonts.urdu, fontSize: bodySize, lineHeight: bodySize * 2.3, color: t.text, textAlign: 'center', writingDirection: 'rtl' }}>
                    {entry.urdu}
                  </Text>
                ) : null}
                {showEnglish ? (
                  <Text style={{ fontFamily: fonts.regular, fontSize: bodySize, lineHeight: bodySize * 1.45, color: t.text, textAlign: 'center' }}>
                    {entry.english}
                  </Text>
                ) : null}
                <View style={{ width: 56 * u, height: 1, backgroundColor: t.gold }} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 9.5 * u, color: t.text, textAlign: 'center' }}>{entry.source}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Pressable onPress={() => setPicking((p) => !p)} style={s.picker} accessibilityRole="button">
          <View style={{ flex: 1 }}>
            <Text style={s.pickerLabel}>Text</Text>
            <Text style={s.pickerValue}>{entry.title}</Text>
          </View>
          <Text style={s.pickerAction}>{picking ? 'Close' : 'Change'}</Text>
        </Pressable>
        {picking ? (
          <View style={s.list}>
            {ALL.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => {
                  setChoice({ id: e.id, forParam: params.entry });
                  setPicking(false);
                }}
                style={[s.listItem, e.id === entryId && { backgroundColor: colors.highlight }]}
              >
                <Text style={s.listText}>{e.title}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <Label>Size</Label>
        <View style={s.row}>
          {SIZES.map((x) => (
            <Chip key={x.id} label={x.label} selected={size === x.id} onPress={() => setSize(x.id)} />
          ))}
        </View>

        <Label>Theme</Label>
        <View style={s.row}>
          {(Object.keys(THEMES) as ThemeId[]).map((id) => (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={THEMES[id].label}
              accessibilityState={{ selected: themeId === id }}
              onPress={() => setThemeId(id)}
              style={[s.swatch, { backgroundColor: id === 'night' ? THEMES.night.paper : THEMES[id].ink, borderColor: themeId === id ? colors.gold : colors.surface }]}
            />
          ))}
        </View>

        <View style={s.switchRow}>
          <Text style={s.switchLabel}>Urdu translation</Text>
          <Switch value={showUrdu} onValueChange={setShowUrdu} trackColor={{ true: colors.ink }} />
        </View>
        <View style={s.switchRow}>
          <Text style={s.switchLabel}>English translation</Text>
          <Switch value={showEnglish} onValueChange={setShowEnglish} trackColor={{ true: colors.ink }} />
        </View>

        <View style={s.note}>
          <Icon name="lock" size={16} color={colors.goldText} />
          <Text style={s.noteText}>Text comes from the verified library and can{"'"}t be edited.</Text>
        </View>

        {status ? <Text style={s.status}>{status}</Text> : null}
        <Button label="Share image" icon="share" onPress={share} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { padding: 20, gap: 14, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  picker: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  pickerLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  pickerValue: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  pickerAction: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, padding: 8 },
  list: { borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  listItem: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.divider },
  listText: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  swatch: { width: 44, height: 44, borderRadius: 22, borderWidth: 3 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  switchLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, backgroundColor: colors.surfaceWarm },
  noteText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: '#3D4A43' },
  status: { fontFamily: fonts.medium, fontSize: 13, color: '#9B2C2C' },
});
