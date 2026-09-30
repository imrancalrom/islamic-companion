import { Tabs } from 'expo-router/js-tabs';
import { Icon } from '../../components/Icon';
import { colors, fonts } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Prayer', tabBarIcon: ({ color }) => <Icon name="clock" color={color} /> }} />
      <Tabs.Screen name="adhkar" options={{ title: 'Adhkar', tabBarIcon: ({ color }) => <Icon name="beads" color={color} /> }} />
      <Tabs.Screen name="duas" options={{ title: 'Duas', tabBarIcon: ({ color }) => <Icon name="book" color={color} /> }} />
      <Tabs.Screen name="create" options={{ title: 'Create', tabBarIcon: ({ color }) => <Icon name="image" color={color} /> }} />
    </Tabs>
  );
}
