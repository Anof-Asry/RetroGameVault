import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGames } from '../context/GameContext';
import { RootStackParamList } from '../navigation/types';

export default function ConsolesScreen() {
  const { consoles, games, getUserData, loading } = useGames();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [manufacturer, setManufacturer] = useState<string>('all');

  const manufacturers = useMemo(
    () => Array.from(new Set(consoles.map((c) => c.manufacturer))).sort(),
    [consoles]
  );

  // Total games and owned games per console
  const stats = useMemo(() => {
    const result: Record<string, { total: number; owned: number }> = {};
    games.forEach((game) => {
      if (!result[game.consoleId]) result[game.consoleId] = { total: 0, owned: 0 };
      result[game.consoleId].total += 1;
      if (getUserData(game.id).status === 'owned') result[game.consoleId].owned += 1;
    });
    return result;
  }, [games, getUserData]);

  const visibleConsoles = useMemo(
    () =>
      consoles
        .filter((c) => manufacturer === 'all' || c.manufacturer === manufacturer)
        .sort((a, b) => a.releaseYear - b.releaseYear),
    [consoles, manufacturer]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  const chips = ['all', ...manufacturers];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipContent}
      >
        {chips.map((name) => {
          const active = manufacturer === name;
          return (
            <Pressable
              key={name}
              onPress={() => setManufacturer(name)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {name === 'all' ? 'All brands' : name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.countText}>
        {visibleConsoles.length} {visibleConsoles.length === 1 ? 'console' : 'consoles'}
      </Text>

      <FlatList
        data={visibleConsoles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const s = stats[item.id] ?? { total: 0, owned: 0 };
          return (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() =>
                navigation.navigate('Tabs', {
                  screen: 'Library',
                  params: { consoleId: item.id, ts: Date.now() },
                })
              }
            >
              <View style={[styles.badge, { backgroundColor: item.color }]}>
                <Ionicons name="game-controller" size={28} color="#FFFFFF" />
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.manufacturer} • {item.releaseYear}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.stats}>
                  {s.total} {s.total === 1 ? 'game' : 'games'} • {s.owned} owned
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#8A8AA3" />
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No consoles found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10152B', paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: '#929DBD', fontSize: 16 },
  chipRow: { flexGrow: 0 },
  chipContent: { gap: 8, paddingRight: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#1A203B',
  },
  chipActive: { backgroundColor: '#B9F36A' },
  chipText: { color: '#AAB2CF', fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#10152B', fontWeight: '700' },
  countText: { color: '#929DBD', fontSize: 13, marginTop: 12, marginBottom: 8 },
  listContent: { paddingBottom: 30 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A203B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  pressed: { opacity: 0.7 },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: 12, marginRight: 8 },
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  meta: { color: '#B9F36A', fontSize: 13, marginTop: 2 },
  description: { color: '#AAB2CF', fontSize: 13, marginTop: 4, lineHeight: 18 },
  stats: { color: '#929DBD', fontSize: 12, marginTop: 6 },
});