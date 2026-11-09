import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Game, GameConsole, UserGameData } from '../types';
import { getInitials } from '../utils/helpers';
import { getGameArtwork } from '../utils/gameArtwork';

type Props = { game: Game; gameConsole?: GameConsole; userData: UserGameData; onPress: () => void };

export default function GameCard({ game, gameConsole, userData, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={[styles.cover, { backgroundColor: gameConsole?.color ?? '#59627E' }]}><Image source={getGameArtwork(game.genre)} style={styles.coverImage} /><View style={styles.coverShade} /><Text style={styles.coverInitials}>{getInitials(game.title)}</Text></View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>{gameConsole?.name ?? 'Unknown console'}</Text>
        <Text style={styles.meta}>{game.genre} · {game.releaseYear}</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.ratingRow}><Ionicons name="star" size={13} color="#FFC76A" /><Text style={styles.rating}>{game.rating.toFixed(1)}</Text></View>
        <View style={styles.icons}>
          {userData.status === 'owned' && <Ionicons name="checkmark-circle" size={16} color="#69DDB6" />}
          {userData.status === 'wishlist' && <Ionicons name="bookmark" size={16} color="#91A9FF" />}
          {userData.isFavorite && <Ionicons name="heart" size={16} color="#FF8294" />}
          <Ionicons name="chevron-forward" size={15} color="#687292" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A203B', borderRadius: 16, padding: 11, marginBottom: 9, borderWidth: 1, borderColor: '#2A3151' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  cover: { width: 66, height: 74, borderRadius: 13, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  coverImage: { ...StyleSheet.absoluteFill, width: undefined, height: undefined },
  coverShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(12,16,34,0.14)' },
  coverInitials: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', zIndex: 1, textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5, position: 'absolute', bottom: 5, left: 6 },
  info: { flex: 1, marginLeft: 12 }, title: { color: '#F4F5FC', fontSize: 14, fontWeight: '800' }, meta: { color: '#9BA5C5', fontSize: 11, marginTop: 3 },
  right: { alignItems: 'flex-end', justifyContent: 'space-between', height: 66 }, ratingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#302E3F', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 }, rating: { color: '#F4F5FC', fontSize: 11, fontWeight: '800', marginLeft: 4 }, icons: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
