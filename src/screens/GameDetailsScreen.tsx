import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
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
import { useGames } from '../context/GameContext';
import { RootStackParamList } from '../navigation/types';
import { GameStatus } from '../types';
import { getInitials } from '../utils/helpers';
import { getGameArtwork } from '../utils/gameArtwork';

const STATUS_OPTIONS: {
  key: GameStatus;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'owned', label: 'Owned', icon: 'checkmark-circle' },
  { key: 'wishlist', label: 'Wishlist', icon: 'bookmark' },
  { key: 'none', label: 'None', icon: 'close-circle' },
];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function GameDetailsScreen() {
  const { games, consoles, getUserData, updateUserData, toggleFavorite, deleteGame } =
    useGames();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'GameDetails'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'GameDetails'>>();
  const { gameId } = route.params;

  const game = games.find((g) => g.id === gameId);
  const gameConsole = consoles.find((c) => c.id === game?.consoleId);
  const userData = getUserData(gameId);
  const [notes, setNotes] = useState(userData.notes);

  useLayoutEffect(() => {
    if (game) navigation.setOptions({ title: game.title });
  }, [navigation, game]);

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Game not found</Text>
      </View>
    );
  }

  const notesChanged = notes !== userData.notes;

  const handleDelete = () => {
    Alert.alert('Delete game', `Remove "${game.title}" from your library?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          navigation.goBack();
          deleteGame(game.id);
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero */}
      <ImageBackground source={getGameArtwork(game.genre)} imageStyle={styles.heroImage} style={styles.hero}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroBadge}><Text style={styles.heroInitials}>{getInitials(game.title)}</Text></View>
        <Text style={styles.heroTitle}>{game.title}</Text>
        <Text style={styles.heroSub}>{gameConsole?.name ?? 'Unknown console'} · {game.releaseYear}</Text>
      </ImageBackground>

      {/* Favorite */}
      <Pressable
        style={[styles.favButton, userData.isFavorite && styles.favButtonActive]}
        onPress={() => toggleFavorite(game.id)}
      >
        <Ionicons
          name={userData.isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={userData.isFavorite ? '#FFFFFF' : '#E74C3C'}
        />
        <Text style={[styles.favText, userData.isFavorite && styles.favTextActive]}>
          {userData.isFavorite ? 'In Favorites' : 'Add to Favorites'}
        </Text>
      </Pressable>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.description}>{game.description}</Text>

      {/* Info */}
      <View style={styles.card}>
        <InfoRow label="Console" value={gameConsole?.name ?? 'Unknown'} />
        <InfoRow label="Genre" value={game.genre} />
        <InfoRow label="Released" value={String(game.releaseYear)} />
        <InfoRow label="Developer" value={game.developer} />
        <InfoRow label="Catalog rating" value={`${game.rating.toFixed(1)} / 5`} />
      </View>

      {/* Status */}
      <Text style={styles.sectionTitle}>My Status</Text>
      <View style={styles.statusRow}>
        {STATUS_OPTIONS.map((option) => {
          const active = userData.status === option.key;
          return (
            <Pressable
              key={option.key}
              style={[styles.statusButton, active && styles.statusButtonActive]}
              onPress={() => updateUserData(game.id, { status: option.key })}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={active ? '#10152B' : '#AAB2CF'}
              />
              <Text style={[styles.statusText, active && styles.statusTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* My rating */}
      <Text style={styles.sectionTitle}>My Rating</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            onPress={() =>
              updateUserData(game.id, {
                myRating: userData.myRating === star ? null : star,
              })
            }
          >
            <Ionicons
              name={
                userData.myRating !== null && star <= userData.myRating
                  ? 'star'
                  : 'star-outline'
              }
              size={36}
              color="#F5B301"
            />
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>Tap the same star again to clear your rating</Text>

      {/* Notes */}
      <Text style={styles.sectionTitle}>My Notes</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Add your thoughts about this game..."
        placeholderTextColor="#8A8AA3"
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
      />
      <Pressable
        style={[styles.saveButton, !notesChanged && styles.saveButtonDisabled]}
        disabled={!notesChanged}
        onPress={() => updateUserData(game.id, { notes: notes.trim() })}
      >
        <Text style={styles.saveText}>{notesChanged ? 'Save Notes' : 'Notes Saved'}</Text>
      </Pressable>

      {/* Custom game actions */}
      {game.isCustom && (
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('AddEditGame', { gameId: game.id })}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10152B' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#10152B' },
  emptyText: { color: '#929DBD', fontSize: 16 },
  hero: { height: 245, borderRadius: 22, alignItems: 'center', justifyContent: 'flex-end', padding: 22, overflow: 'hidden', marginBottom: 15 },
  heroImage: { borderRadius: 22 },
  heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(11,15,32,0.38)' },
  heroBadge: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInitials: { color: '#FFFFFF', fontSize: 34, fontWeight: 'bold' },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 14,
  },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E74C3C',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  favButtonActive: { backgroundColor: '#E74C3C' },
  favText: { color: '#E74C3C', fontSize: 15, fontWeight: '600' },
  favTextActive: { color: '#FFFFFF' },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 8,
  },
  description: { color: '#AAB2CF', fontSize: 15, lineHeight: 22 },
  card: {
    backgroundColor: '#1A203B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A3151',
  },
  infoLabel: { color: '#929DBD', fontSize: 14 },
  infoValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '500', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1A203B',
    borderRadius: 12,
    paddingVertical: 12,
  },
  statusButtonActive: { backgroundColor: '#B9F36A' },
  statusText: { color: '#AAB2CF', fontSize: 14, fontWeight: '500' },
  statusTextActive: { color: '#10152B', fontWeight: '700' },
  starsRow: { flexDirection: 'row', gap: 6 },
  hint: { color: '#929DBD', fontSize: 12, marginTop: 6 },
  notesInput: {
    backgroundColor: '#1A203B',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#B9F36A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: { backgroundColor: '#3A3A4E' },
  saveText: { color: '#10152B', fontSize: 15, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 12,
  },
  editButton: { backgroundColor: '#3498DB' },
  deleteButton: { backgroundColor: '#C0392B' },
  actionText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});