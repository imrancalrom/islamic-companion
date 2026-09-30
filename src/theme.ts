// Colours and type used across the app. Matches the approved screen designs.
export const colors = {
  background: '#F4EFE3',
  surface: '#FFFDF7',
  surfaceWarm: '#F7F0DE',
  highlight: '#F1E6CC',
  border: '#E3D6B8',
  divider: '#EFE6D2',
  ink: '#1F4D3A', // primary green
  text: '#1F2A24',
  textMuted: '#4F5D55',
  gold: '#B08A3E',
  goldText: '#7A5214', // gold dark enough for text
  onInk: '#FAF6EC',
  onInkMuted: '#E8D4A6',
};

export const fonts = {
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
  arabic: 'Amiri_400Regular',
  arabicBold: 'Amiri_700Bold',
  quran: 'AmiriQuran_400Regular',
  urdu: 'NotoNastaliqUrdu_400Regular',
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 22, pill: 999 };
export const space = (n: number) => n * 4;
