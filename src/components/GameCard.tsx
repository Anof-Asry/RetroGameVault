import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Game, GameConsole, UserGameData } from '../types';
import { getInitials } from '../utils/helpers';

type Props = {
  game: Game;
  gameConsole?: GameConsole;
  userData: UserGameData;
  onPress: () => void;
};

export default function GameCard({ game, gameConsole, userData, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.cover, { backgroundColor: gameConsole?.color ?? '#444444' }]}>
        <Text style={styles.initials}>{getInitials(game.title)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {gameConsole?.name ?? 'Unknown console'}
        </Text>
        <Text style={styles.meta}>
          {game.genre} • {game.releaseYear}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F5B301" />
          <Text style={styles.rating}>{game.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.icons}>
          {userData.status === 'owned' && (
            <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
          )}
          {userData.status === 'wishlist' && (
            <Ionicons name="bookmark" size={18} color="#3498DB" />
          )}
          {userData.isFavorite && <Ionicons name="heart" size={18} color="#E74C3C" />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  pressed: { opacity: 0.7 },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1, marginLeft: 12 },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  meta: { color: '#8A8AA3', fontSize: 13, marginTop: 2 },
  right: { alignItems: 'flex-end', justifyContent: 'space-between', height: 56 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  icons: { flexDirection: 'row', gap: 4 },
});