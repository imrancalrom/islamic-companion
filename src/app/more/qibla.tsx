import { router, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { Button, Card } from '../../components/ui';
import { useCompass } from '../../lib/compass';
import { done } from '../../lib/haptics';
import { qiblaBearing } from '../../lib/prayer';
import { useSettings } from '../../lib/settings';
import { colors, fonts } from '../../theme';

const SIZE = 290;
const C = SIZE / 2;
const R = SIZE / 2 - 14;

const STATUS_TEXT = {
  starting: 'Finding direction…',
  ok: '',
  'no-sensor':
    Platform.OS === 'web' ? 'The compass works in the phone app.' : 'This phone has no compass sensor. Use the angle below with a separate compass.',
  'no-data': 'No compass reading yet. Move the phone in a figure-of-eight, away from metal.',
} as const;

/** Signed difference from heading to target in degrees, -180..180. */
const diff = (target: number, heading: number) => ((target - heading + 540) % 360) - 180;

export default function QiblaScreen() {
  const { settings } = useSettings();
  const place = settings.place;
  const bearing = place ? qiblaBearing(place) : null;
  const { heading, status, needsCalibration } = useCompass(place?.latitude ?? null, place?.longitude ?? null);
  const aligned = useRef(false);

  // One vibration when the phone comes round to face the Qibla.
  useEffect(() => {
    if (heading === null || bearing === null) return;
    const off = Math.abs(diff(bearing, heading));
    if (off <= 5 && !aligned.current) {
      aligned.current = true;
      done();
    } else if (off > 10) {
      aligned.current = false;
    }
  }, [heading, bearing]);

  if (!place || bearing === null) {
    return (
      <View style={s.page}>
        <Stack.Screen options={{ title: 'Qibla' }} />
        <Card style={{ gap: 12 }}>
          <Text style={s.body}>Set your location on the Prayer screen first. The Qibla direction is calculated from it.</Text>
          <Button label="Go to Prayer screen" onPress={() => router.navigate('/')} />
        </Card>
      </View>
    );
  }

  const off = heading === null ? null : diff(bearing, heading);
  const facing = off !== null && Math.abs(off) <= 5;

  const rotate = heading === null ? 0 : -heading;
  const kx = C + (R - 26) * Math.sin((bearing * Math.PI) / 180);
  const ky = C - (R - 26) * Math.cos((bearing * Math.PI) / 180);

  return (
    <View style={s.page}>
      <Stack.Screen options={{ title: 'Qibla' }} />
      <Text style={[s.status, facing && { color: colors.ink }]}>
        {heading === null
          ? STATUS_TEXT[status]
          : facing
            ? 'You are facing the Qibla'
            : `Turn ${off! > 0 ? 'right' : 'left'} ${Math.round(Math.abs(off!))}°`}
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Svg width={SIZE} height={SIZE + 14} viewBox={`0 -14 ${SIZE} ${SIZE + 14}`}>
          {/* Fixed pointer: the direction the top of the phone faces */}
          <Path d={`M${C - 9} -12 L${C + 9} -12 L${C} 6 Z`} fill={facing ? colors.ink : colors.goldText} />
          <G rotation={rotate} origin={`${C}, ${C}`}>
            <Circle cx={C} cy={C} r={R} fill={colors.surface} stroke={colors.border} strokeWidth={2} />
            {Array.from({ length: 72 }, (_, i) => {
              const a = (i * 5 * Math.PI) / 180;
              const len = i % 6 === 0 ? 14 : 6;
              return (
                <Line
                  key={i}
                  x1={C + R * Math.sin(a)}
                  y1={C - R * Math.cos(a)}
                  x2={C + (R - len) * Math.sin(a)}
                  y2={C - (R - len) * Math.cos(a)}
                  stroke={i % 18 === 0 ? colors.text : '#B9AD8E'}
                  strokeWidth={i % 6 === 0 ? 2 : 1}
                />
              );
            })}
            {(['N', 'E', 'S', 'W'] as const).map((l, i) => (
              <SvgText
                key={l}
                x={C + (R - 30) * Math.sin((i * Math.PI) / 2)}
                y={C - (R - 30) * Math.cos((i * Math.PI) / 2) + 6}
                fontSize={17}
                fontWeight="700"
                fill={l === 'N' ? '#9B2C2C' : colors.text}
                textAnchor="middle"
              >
                {l}
              </SvgText>
            ))}
            {/* Line and Kaaba marker at the Qibla bearing */}
            <Line x1={C} y1={C} x2={kx} y2={ky} stroke={colors.gold} strokeWidth={3} strokeLinecap="round" />
            <G x={kx - 13} y={ky - 13}>
              <Path d="M2 7 L13 2 L24 7 L24 21 L13 25 L2 21 Z" fill={colors.text} />
              <Path d="M2 11 L13 15 L24 11" stroke={colors.gold} strokeWidth={2.5} fill="none" />
            </G>
            <Circle cx={C} cy={C} r={6} fill={colors.ink} />
          </G>
        </Svg>
      </View>

      <Card style={{ gap: 6 }}>
        <Text style={s.body}>
          From {place.label}, the Qibla is <Text style={s.bold}>{Math.round(bearing)}°</Text> from true north.
        </Text>
        <Text style={s.small}>
          Hold the phone flat, away from metal and magnets.
          {needsCalibration ? ' The compass needs calibrating: move the phone in a figure-of-eight a few times.' : ''}
        </Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 18, backgroundColor: colors.background },
  status: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, textAlign: 'center' },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  bold: { fontFamily: fonts.bold },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted },
});
