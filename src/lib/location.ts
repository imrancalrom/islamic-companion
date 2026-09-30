import * as Location from 'expo-location';
import { Platform } from 'react-native';
import type { Place } from './settings';

/** Asks for location once and returns a place label. Location never leaves the phone. */
export async function detectPlace(): Promise<Place | { error: string }> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { error: 'Location permission is needed to calculate prayer times for where you are.' };
  }
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
  const { latitude, longitude } = pos.coords;
  let label = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  if (Platform.OS !== 'web') {
    try {
      const [addr] = await Location.reverseGeocodeAsync({ latitude, longitude });
      label = addr?.city ?? addr?.subregion ?? addr?.region ?? label;
    } catch {
      // Keep the coordinates as the label.
    }
  }
  return { latitude, longitude, label };
}
