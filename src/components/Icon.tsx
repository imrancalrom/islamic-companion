import { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'clock' | 'beads' | 'book' | 'image' | 'settings' | 'pin' | 'check' | 'bell' | 'bellOff'
  | 'chevronRight' | 'chevronLeft' | 'sun' | 'moon' | 'plane' | 'food' | 'heart' | 'plus'
  | 'shield' | 'search' | 'share' | 'lock' | 'refresh' | 'compass' | 'calendar' | 'kaaba' | 'grid' | 'chart' | 'minus' | 'star';

type Props = { name: IconName; size?: number; color?: ColorValue; strokeWidth?: number };

/** Simple stroke icons drawn with SVG, so no icon font is needed. */
export function Icon({ name, size = 22, color = '#1F2A24', strokeWidth = 2 }: Props) {
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'clock' && (<><Circle cx={12} cy={12} r={9} {...p} /><Path d="M12 7v5l3 2" {...p} /></>)}
      {name === 'beads' && (<><Circle cx={12} cy={5} r={2} {...p} /><Circle cx={18} cy={10} r={2} {...p} /><Circle cx={16} cy={17} r={2} {...p} /><Circle cx={8} cy={17} r={2} {...p} /><Circle cx={6} cy={10} r={2} {...p} /></>)}
      {name === 'book' && <Path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13" {...p} />}
      {name === 'image' && (<><Rect x={3} y={3} width={18} height={18} rx={3} {...p} /><Circle cx={9} cy={9} r={2} {...p} /><Path d="M21 15l-5-5L5 21" {...p} /></>)}
      {name === 'settings' && (<><Circle cx={12} cy={12} r={3} {...p} /><Path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" {...p} /></>)}
      {name === 'pin' && (<><Path d="M12 22s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z" {...p} /><Circle cx={12} cy={10} r={2.5} {...p} /></>)}
      {name === 'check' && <Path d="M5 12l5 5L20 7" {...p} />}
      {name === 'bell' && (<><Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...p} /><Path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" {...p} /></>)}
      {name === 'bellOff' && (<><Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...p} /><Path d="M3 3l18 18" {...p} /></>)}
      {name === 'chevronRight' && <Path d="M9 6l6 6-6 6" {...p} />}
      {name === 'chevronLeft' && <Path d="M15 6l-6 6 6 6" {...p} />}
      {name === 'sun' && (<><Circle cx={12} cy={12} r={4} {...p} /><Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...p} /></>)}
      {name === 'moon' && <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" {...p} />}
      {name === 'plane' && <Path d="M2 16l20-8-8 14-2-6z" {...p} />}
      {name === 'food' && <Path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8" {...p} />}
      {name === 'heart' && <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" {...p} />}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'shield' && (<><Path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" {...p} /><Path d="M9 12l2 2 4-4" {...p} /></>)}
      {name === 'search' && (<><Circle cx={11} cy={11} r={7} {...p} /><Path d="M20 20l-3.5-3.5" {...p} /></>)}
      {name === 'share' && (<><Path d="M4 12v8h16v-8" {...p} /><Path d="M12 3v13" {...p} /><Path d="M7 8l5-5 5 5" {...p} /></>)}
      {name === 'lock' && (<><Rect x={5} y={11} width={14} height={10} rx={2} {...p} /><Path d="M8 11V7a4 4 0 0 1 8 0v4" {...p} /></>)}
      {name === 'refresh' && (<><Path d="M21 12a9 9 0 1 1-3-6.7L21 8" {...p} /><Path d="M21 3v5h-5" {...p} /></>)}
      {name === 'compass' && (<><Circle cx={12} cy={12} r={9} {...p} /><Path d="M15.5 8.5l-2 5-5 2 2-5z" {...p} /></>)}
      {name === 'calendar' && (<><Rect x={3} y={5} width={18} height={16} rx={2} {...p} /><Path d="M3 10h18M8 3v4M16 3v4" {...p} /></>)}
      {name === 'kaaba' && (<><Path d="M4 8l8-4 8 4v10l-8 3-8-3z" {...p} /><Path d="M4 11l8 3 8-3M12 14v7" {...p} /></>)}
      {name === 'grid' && (<><Rect x={4} y={4} width={7} height={7} rx={1.5} {...p} /><Rect x={13} y={4} width={7} height={7} rx={1.5} {...p} /><Rect x={4} y={13} width={7} height={7} rx={1.5} {...p} /><Rect x={13} y={13} width={7} height={7} rx={1.5} {...p} /></>)}
      {name === 'chart' && <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'star' && <Path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.1 6-.7z" {...p} />}
    </Svg>
  );
}
