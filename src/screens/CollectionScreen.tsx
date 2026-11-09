import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GameCard from '../components/GameCard';
import { useGames } from '../context/GameContext';
import { RootStackParamList } from '../navigation/types';
import { Game, GameConsole } from '../types';

type Segment = 'owned' | 'wishlist' | 'favorites';

const SEGMENTS: {
  key: Segment;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  emptyTitle: string;
  emptyText: string;
}[] = [
  {
    key: 'owned',
    label: 'Owned',
    icon: 'checkmark-circle-outline',
    emptyTitle: 'No owned games yet',
    emptyText: 'Open a game and set its status to Owned.',
  },
  {
    key: 'wishlist',
    label: 'Wishlist',
    icon: 'bookmark-outline',
    emptyTitle: 'Your wishlist is empty',
    emptyText: 'Open a game and set its status to Wishlist.',
  },
  {
    key: 'favorites',
    label: 'Favorites',
    icon: 'heart-outline',
    emptyTitle: 'No favorites yet',
    emptyText: 'Open a game and tap Add to Favorites.',
  },
];

export default function CollectionScreen() {
  const { games, consoles, getUserData, loading } = useGames();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [segment, setSegment] = useState<Segment>('owned');

  const consoleMap = useMemo(() => {
    const map: Record<string, GameConsole> = {};
    consoles.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [consoles]);

  const lists = useMemo(() => {
    const owned: Game[] = [];
    const wishlist: Game[] = [];
    const favorites: Game[] = [];

    games.forEach((game) => {
      const data = getUserData(game.id);
      if (data.status === 'owned') owned.push(game);
      if (data.status === 'wishlist') wishlist.push(game);
      if (data.isFavorite) favorites.push(game);
    });

    const byTitle = (a: Game, b: Game) => a.title.localeCompare(b.title);
    return {
      owned: owned.sort(byTitle),
      wishlist: wishlist.sort(byTitle),
      favorites: favorites.sort(byTitle),
    };
  }, [games, getUserData]);

  const current = SEGMENTS.find((s) => s.key === segment)!;
  const data = lists[segment];

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.segmentRow}>
        {SEGMENTS.map((s) => {
          const active = s.key === segment;
          return (
            <Pressable
              key={s.key}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => setSegment(s.key)}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {s.label} ({lists[s.key].length})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(game) => game.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            gameConsole={consoleMap[item.consoleId]}
            userData={getUserData(item.id)}
            onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name={current.icon} size={52} color="#8A8AA3" />
            <Text style={styles.emptyTitle}>{current.emptyTitle}</Text>
            <Text style={styles.emptyText}>{current.emptyText}</Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => navigation.navigate('Tabs', { screen: 'Library' })}
            >
              <Text style={styles.browseText}>Browse Library</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10152B', paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#1A203B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  segmentActive: { backgroundColor: '#B9F36A' },
  segmentText: { color: '#AAB2CF', fontSize: 13, fontWeight: '500' },
  segmentTextActive: { color: '#10152B', fontWeight: '700' },
  listContent: { paddingBottom: 30, flexGrow: 1 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptyText: { color: '#929DBD', fontSize: 14, marginTop: 6, textAlign: 'center' },
  browseButton: {
    marginTop: 18,
    backgroundColor: '#B9F36A',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
  },
  browseText: { color: '#10152B', fontSize: 15, fontWeight: '700' },
});