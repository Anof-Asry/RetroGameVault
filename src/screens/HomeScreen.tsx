import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GameCard from '../components/GameCard';
import { useGames } from '../context/GameContext';
import { RootStackParamList } from '../navigation/types';
import { GameConsole } from '../types';

function StatCard({ icon, color, value, label }: { icon: keyof typeof Ionicons.glyphMap; color: string; value: number; label: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}><Ionicons name={icon} size={19} color={color} /></View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({ icon, label, detail, onPress, primary = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; detail: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable style={({ pressed }) => [styles.actionButton, primary && styles.actionPrimary, pressed && styles.pressed]} onPress={onPress}>
      <View style={[styles.actionIcon, primary && styles.actionIconPrimary]}><Ionicons name={icon} size={22} color={primary ? '#19213A' : '#B9F36A'} /></View>
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
      <Text style={[styles.actionDetail, primary && styles.actionDetailPrimary]}>{detail}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { games, consoles, getUserData, loading } = useGames();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const consoleMap = useMemo(() => {
    const map: Record<string, GameConsole> = {};
    consoles.forEach((c) => { map[c.id] = c; });
    return map;
  }, [consoles]);
  const stats = useMemo(() => {
    let owned = 0; let wishlist = 0; let favorites = 0; let ratingSum = 0; let ratedCount = 0;
    games.forEach((game) => {
      const data = getUserData(game.id);
      if (data.status === 'owned') owned += 1;
      if (data.status === 'wishlist') wishlist += 1;
      if (data.isFavorite) favorites += 1;
      if (data.myRating !== null) { ratingSum += data.myRating; ratedCount += 1; }
    });
    return { total: games.length, owned, wishlist, favorites, ratedCount, average: ratedCount > 0 ? ratingSum / ratedCount : null };
  }, [games, getUserData]);
  const topRated = useMemo(() => [...games].sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title)).slice(0, 5), [games]);
  const handleSurprise = () => {
    if (games.length === 0) return;
    const random = games[Math.floor(Math.random() * games.length)];
    navigation.navigate('GameDetails', { gameId: random.id });
  };

  if (loading) return <View style={styles.center}><Text style={styles.centerText}>Getting your vault ready…</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>YOUR PERSONAL ARCADE</Text><Ionicons name="sparkles" size={15} color="#B9F36A" /></View>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Welcome back,</Text>
          <Text style={styles.heroTitleAccent}>Player One.</Text>
          <Text style={styles.heroSub}>Your next favorite is waiting.</Text>
        </View>
        <View style={styles.heroBadge}><Ionicons name="game-controller" size={33} color="#19213A" /><Text style={styles.badgeText}>INSERT{ '\n' }COIN</Text></View>
        <View style={styles.heroGlow} />
      </View>
      <View style={styles.statsHeading}><Text style={styles.sectionTitle}>Your collection</Text><Text style={styles.sectionHint}>LOOK AT YOU GO</Text></View>
      <View style={styles.statsGrid}>
        <StatCard icon="albums" color="#B9F36A" value={stats.total} label="In the vault" />
        <StatCard icon="checkmark-circle" color="#69DDB6" value={stats.owned} label="In your hands" />
        <StatCard icon="bookmark" color="#91A9FF" value={stats.wishlist} label="On your radar" />
        <StatCard icon="heart" color="#FF8294" value={stats.favorites} label="All-time faves" />
      </View>
      <View style={styles.ratingCard}>
        <View style={styles.ratingIcon}><Ionicons name="star" size={19} color="#19213A" /></View>
        <View style={styles.ratingCopy}><Text style={styles.ratingHeading}>Your player score</Text><Text style={styles.ratingText}>{stats.average !== null ? `${stats.average.toFixed(1)} / 5 · ${stats.ratedCount} games rated` : 'Rate a game to start your own leaderboard'}</Text></View>
        <Ionicons name="chevron-forward" size={18} color="#9CA5C5" />
      </View>
      <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Pick your next quest</Text><Text style={styles.sectionSubtitle}>A little nostalgia goes a long way.</Text></View><Ionicons name="game-controller-outline" size={22} color="#B9F36A" /></View>
      <View style={styles.actionsRow}>
        <ActionButton icon="grid" label="Explore" detail="Browse games" primary onPress={() => navigation.navigate('Tabs', { screen: 'Library' })} />
        <ActionButton icon="shuffle" label="Surprise me" detail="Pick a classic" onPress={handleSurprise} />
        <ActionButton icon="add" label="Add a game" detail="Make it yours" onPress={() => navigation.navigate('AddEditGame')} />
      </View>
      <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Hall of fame</Text><Text style={styles.sectionSubtitle}>The classics players love most.</Text></View><View style={styles.topPill}><Ionicons name="trophy" size={13} color="#FFC76A" /><Text style={styles.topPillText}>TOP 5</Text></View></View>
      {topRated.map((game, index) => <GameCard key={game.id} game={game} gameConsole={consoleMap[game.consoleId]} userData={getUserData(game.id)} onPress={() => navigation.navigate('GameDetails', { gameId: game.id })} />)}
      <Text style={styles.footer}>GOOD GAMES NEVER GET OLD.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10152B' }, content: { padding: 18, paddingBottom: 34 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#10152B' }, centerText: { color: '#AAB2CF', fontSize: 16 }, pressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5, marginBottom: 15 }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#B9F36A' }, eyebrowText: { color: '#9CA5C5', fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  hero: { minHeight: 164, borderRadius: 24, padding: 22, backgroundColor: '#252D50', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', borderWidth: 1, borderColor: '#39446D' }, heroCopy: { zIndex: 1 }, heroTitle: { color: '#F4F5FC', fontSize: 26, fontWeight: '800', letterSpacing: -0.7 }, heroTitleAccent: { color: '#B9F36A', fontSize: 29, fontWeight: '900', letterSpacing: -0.8, marginTop: -2 }, heroSub: { color: '#B4BCD7', fontSize: 13, marginTop: 9 }, heroBadge: { width: 78, height: 90, borderRadius: 18, backgroundColor: '#B9F36A', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '5deg' }], zIndex: 1 }, badgeText: { color: '#19213A', fontSize: 8, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center', marginTop: 5 }, heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, right: 20, top: -92, backgroundColor: '#333D66' },
  statsHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 12 }, sectionTitle: { color: '#F4F5FC', fontSize: 19, fontWeight: '800', letterSpacing: -0.3 }, sectionHint: { color: '#737D9F', fontSize: 9, fontWeight: '800', letterSpacing: 1.3 }, statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, statCard: { width: '48%', flexGrow: 1, backgroundColor: '#1A203B', borderRadius: 17, padding: 14, borderWidth: 1, borderColor: '#2A3151' }, statIcon: { width: 33, height: 33, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, statValue: { color: '#F4F5FC', fontSize: 27, fontWeight: '900', marginTop: 10 }, statLabel: { color: '#AAB2CF', fontSize: 12, marginTop: 1 },
  ratingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#222A47', borderRadius: 16, padding: 13, marginTop: 11, borderWidth: 1, borderColor: '#343E63' }, ratingIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFC76A', alignItems: 'center', justifyContent: 'center' }, ratingCopy: { flex: 1 }, ratingHeading: { color: '#F4F5FC', fontSize: 13, fontWeight: '800' }, ratingText: { color: '#AAB2CF', fontSize: 11, marginTop: 3 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 27, marginBottom: 13 }, sectionSubtitle: { color: '#939DBD', fontSize: 12, marginTop: 4 }, actionsRow: { flexDirection: 'row', gap: 9 }, actionButton: { flex: 1, minHeight: 112, backgroundColor: '#1A203B', borderRadius: 17, padding: 12, borderWidth: 1, borderColor: '#2A3151' }, actionPrimary: { backgroundColor: '#B9F36A', borderColor: '#B9F36A' }, actionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#2B3455', alignItems: 'center', justifyContent: 'center' }, actionIconPrimary: { backgroundColor: '#D2FAA0' }, actionText: { color: '#F4F5FC', fontSize: 12, fontWeight: '800', marginTop: 9 }, actionTextPrimary: { color: '#19213A' }, actionDetail: { color: '#929DBD', fontSize: 10, marginTop: 3 }, actionDetailPrimary: { color: '#42532D' }, topPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#302E3F', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9 }, topPillText: { color: '#FFC76A', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 }, footer: { color: '#5F698A', textAlign: 'center', fontSize: 9, letterSpacing: 2, fontWeight: '800', marginTop: 12 },
});
