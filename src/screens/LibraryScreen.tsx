import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GameCard from '../components/GameCard';
import { useGames } from '../context/GameContext';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { GameConsole } from '../types';
import { getShortName } from '../utils/helpers';

type SortOption = 'title' | 'rating' | 'year';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'title', label: 'A-Z' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'year', label: 'Newest' },
];

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const { games, consoles, getUserData, loading } = useGames();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<TabParamList, 'Library'>>();

  const [query, setQuery] = useState('');
  const [selectedConsole, setSelectedConsole] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('title');

  // Lets the Consoles screen open the Library already filtered
  useEffect(() => {
    if (route.params?.consoleId) {
      setSelectedConsole(route.params.consoleId);
    }
  }, [route.params?.consoleId, route.params?.ts]);

  const consoleMap = useMemo(() => {
    const map: Record<string, GameConsole> = {};
    consoles.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [consoles]);

  const genres = useMemo(
    () => Array.from(new Set(games.map((g) => g.genre))).sort(),
    [games]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = games.filter((game) => {
      const matchesConsole = selectedConsole === 'all' || game.consoleId === selectedConsole;
      const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre;
      const matchesQuery =
        q === '' ||
        game.title.toLowerCase().includes(q) ||
        game.developer.toLowerCase().includes(q);
      return matchesConsole && matchesGenre && matchesQuery;
    });

    return result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
  }, [games, query, selectedConsole, selectedGenre, sortBy]);

  const hasFilters = query !== '' || selectedConsole !== 'all' || selectedGenre !== 'all';

  const clearFilters = () => {
    setQuery('');
    setSelectedConsole('all');
    setSelectedGenre('all');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.libraryIntro}><View><Text style={styles.libraryEyebrow}>THE GAME ROOM</Text><Text style={styles.libraryTitle}>Find your next{ '\n' }favorite.</Text></View><View style={styles.libraryIcon}><Ionicons name="sparkles" size={25} color="#17203A" /></View></View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8A8AA3" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or developer"
          placeholderTextColor="#8A8AA3"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#8A8AA3" />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipContent}
      >
        <Chip
          label="All consoles"
          active={selectedConsole === 'all'}
          onPress={() => setSelectedConsole('all')}
        />
        {consoles.map((c) => (
          <Chip
            key={c.id}
            label={getShortName(c.name)}
            active={selectedConsole === c.id}
            onPress={() => setSelectedConsole(c.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipContent}
      >
        <Chip
          label="All genres"
          active={selectedGenre === 'all'}
          onPress={() => setSelectedGenre('all')}
        />
        {genres.map((genre) => (
          <Chip
            key={genre}
            label={genre}
            active={selectedGenre === genre}
            onPress={() => setSelectedGenre(genre)}
          />
        ))}
      </ScrollView>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {SORT_OPTIONS.map((option) => (
          <Chip
            key={option.key}
            label={option.label}
            active={sortBy === option.key}
            onPress={() => setSortBy(option.key)}
          />
        ))}
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filtered.length} {filtered.length === 1 ? 'game' : 'games'}
        </Text>
        {hasFilters && (
          <Pressable onPress={clearFilters}>
            <Text style={styles.clearText}>Clear filters</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(game) => game.id}
        keyboardShouldPersistTaps="handled"
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
            <Ionicons name="game-controller-outline" size={48} color="#8A8AA3" />
            <Text style={styles.emptyText}>No games found</Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('AddEditGame')}>
        <Ionicons name="add" size={28} color="#121212" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10152B', paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: '#929DBD', fontSize: 16, marginTop: 8 },
  libraryIntro: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333A71', borderRadius: 20, padding: 18, marginBottom: 5, overflow: 'hidden' },
  libraryEyebrow: { color: '#C5D0FF', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  libraryTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '900', lineHeight: 28, marginTop: 7 },
  libraryIcon: { width: 54, height: 54, backgroundColor: '#B9F36A', borderRadius: 17, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '8deg' }] },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A203B',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15, marginHorizontal: 8 },
  chipRow: { flexGrow: 0, marginTop: 10 },
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
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  sortLabel: { color: '#929DBD', fontSize: 13 },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  countText: { color: '#929DBD', fontSize: 13 },
  clearText: { color: '#B9F36A', fontSize: 13, fontWeight: '600' },
  listContent: { paddingBottom: 90 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#B9F36A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});