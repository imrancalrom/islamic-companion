import * as Location from 'expo-location';
import { Accelerometer, Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { azimuth, declination, Vec } from './compassMath';

export type CompassState = {
  /** Degrees clockwise from true north, smoothed; null until the first reading. */
  heading: number | null;
  status: 'starting' | 'ok' | 'no-sensor' | 'no-data';
  /** True when readings look disturbed and the phone should be calibrated. */
  needsCalibration: boolean;
};

/**
 * Live compass heading. On Android it reads the accelerometer and magnetometer
 * directly (the built-in heading watcher stays silent on some phones); on iOS it
 * uses the system heading, which is already calibrated.
 */
export function useCompass(lat: number | null, lon: number | null): CompassState {
  const [state, setState] = useState<CompassState>({ heading: null, status: 'starting', needsCalibration: false });
  const smooth = useRef<{ s: number; c: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const subs: { remove: () => void }[] = [];
    const decl = lat !== null && lon !== null ? declination(lat, lon) : 0;
    let got = false;

    // Circular low-pass filter so the dial does not jitter or spin the long way round.
    const push = (deg: number, needsCalibration: boolean) => {
      got = true;
      const r = (deg * Math.PI) / 180;
      const prev = smooth.current;
      const k = 0.25;
      const s = prev ? prev.s + k * (Math.sin(r) - prev.s) : Math.sin(r);
      const c = prev ? prev.c + k * (Math.cos(r) - prev.c) : Math.cos(r);
      smooth.current = { s, c };
      const heading = ((Math.atan2(s, c) * 180) / Math.PI + 360) % 360;
      if (!cancelled) setState({ heading, status: 'ok', needsCalibration });
    };

    (async () => {
      if (Platform.OS === 'web') {
        setState((x) => ({ ...x, status: 'no-sensor' }));
        return;
      }

      if (Platform.OS === 'ios') {
        try {
          await Location.requestForegroundPermissionsAsync().catch(() => null);
          const sub = await Location.watchHeadingAsync((h) => {
            const trueH = h.trueHeading >= 0 ? h.trueHeading : (h.magHeading + decl + 360) % 360;
            push(trueH, h.accuracy < 2);
          });
          if (cancelled) sub.remove();
          else subs.push(sub);
        } catch {
          if (!cancelled) setState((x) => ({ ...x, status: 'no-sensor' }));
        }
        return;
      }

      // Android: our own sensor fusion.
      const [hasMag, hasAcc] = await Promise.all([
        Magnetometer.isAvailableAsync().catch(() => false),
        Accelerometer.isAvailableAsync().catch(() => false),
      ]);
      if (cancelled) return;
      if (!hasMag || !hasAcc) {
        setState((x) => ({ ...x, status: 'no-sensor' }));
        return;
      }
      let acc: Vec | null = null;
      Magnetometer.setUpdateInterval(100);
      Accelerometer.setUpdateInterval(100);
      subs.push(
        Accelerometer.addListener((a) => {
          acc = a;
        }),
      );
      subs.push(
        Magnetometer.addListener((m) => {
          if (!acc) return;
          const a = azimuth(acc, m);
          if (a === null) return;
          // Earth's field is about 25–65 µT; far outside that means interference.
          const strength = Math.hypot(m.x, m.y, m.z);
          push((a + decl + 360) % 360, strength < 20 || strength > 80);
        }),
      );
    })();

    // If nothing has arrived after a few seconds, say so instead of waiting forever.
    const timer = setTimeout(() => {
      if (!got && !cancelled) setState((x) => (x.status === 'starting' ? { ...x, status: 'no-data' } : x));
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      subs.forEach((s) => s.remove());
      smooth.current = null;
    };
  }, [lat, lon]);

  return state;
}
