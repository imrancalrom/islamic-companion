import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const on = Platform.OS !== 'web';

/** A light tick for each count. */
export const tick = () => on && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
/** A stronger buzz at a milestone, such as every 33. */
export const milestone = () => on && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
/** A success pattern when a target is reached. */
export const done = () => on && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
