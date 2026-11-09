import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GameCard from '../components/GameCard';
import { useGames } from '../context/GameContext';
import { RootStackParamList } from '../navigation/types';
import { GameConsole } from '../types';

function StatCard({
  icon,
  color,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color="#F5B301" />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { games, consoles, getUserData, loading } = useGames();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const consoleMap = useMemo(() => {
    const map: Record<string, GameConsole> = {};
    consoles.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [consoles]);

  const stats = useMemo(() => {
    let owned = 0;
    let wishlist = 0;
    let favorites = 0;
    let ratingSum = 0;
    let ratedCount = 0;

    games.forEach((game) => {
      const data = getUserData(game.id);
      if (data.status === 'owned') owned += 1;
      if (data.status === 'wishlist') wishlist += 1;
      if (data.isFavorite) favorites += 1;
      if (data.myRating !== null) {
        ratingSum += data.myRating;
        ratedCount += 1;
      }
    });

    return {
      total: games.length,
      owned,
      wishlist,
      favorites,
      ratedCount,
      average: ratedCount > 0 ? ratingSum / ratedCount : null,
    };
  }, [games, getUserData]);

  const topRated = useMemo(
    () =>
      [...games]
        .sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title))
        .slice(0, 5),
    [games]
  );

  const handleSurprise = () => {
    if (games.length === 0) return;
    const random = games[Math.floor(Math.random() * games.length)];
    navigation.navigate('GameDetails', { gameId: random.id });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Ionicons name="game-controller" size={40} color="#F5B301" />
        <Text style={styles.heroTitle}>Retro Game Vault</Text>
        <Text style={styles.heroSub}>Your offline classic game collection</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard icon="albums" color="#F5B301" value={stats.total} label="Total games" />
        <StatCard icon="checkmark-circle" color="#2ECC71" value={stats.owned} label="Owned" />
        <StatCard icon="bookmark" color="#3498DB" value={stats.wishlist} label="Wishlist" />
        <StatCard icon="heart" color="#E74C3C" value={stats.favorites} label="Favorites" />
      </View>

      <View style={styles.ratingCard}>
        <Ionicons name="star" size={22} color="#F5B301" />
        <Text style={styles.ratingText}>
          {stats.average !== null
            ? `Your average rating: ${stats.average.toFixed(1)} / 5 (${stats.ratedCount} rated)`
            : 'You have not rated any games yet'}
        </Text>
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <ActionButton
          icon="library"
          label="Browse"
          onPress={() => navigation.navigate('Tabs', { screen: 'Library' })}
        />
        <ActionButton
          icon="add-circle"
          label="Add Game"
          onPress={() => navigation.navigate('AddEditGame')}
        />
        <ActionButton icon="shuffle" label="Surprise Me" onPress={handleSurprise} />
      </View>

      {/* Top rated */}
      <Text style={styles.sectionTitle}>Top Rated</Text>
      {topRated.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          gameConsole={consoleMap[game.consoleId]}
          userData={getUserData(game.id)}
          onPress={() => navigation.navigate('GameDetails', { gameId: game.id })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 16, paddingBottom: 30 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212' },
  centerText: { color: '#8A8AA3', fontSize: 16 },
  pressed: { opacity: 0.7 },
  hero: { alignItems: 'center', paddingVertical: 16 },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', marginTop: 8 },
  heroSub: { color: '#8A8AA3', fontSize: 14, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  statCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginTop: 6 },
  statLabel: { color: '#8A8AA3', fontSize: 13, marginTop: 2 },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  ratingText: { color: '#C9C9DB', fontSize: 14, flex: 1 },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
  },
  actionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});