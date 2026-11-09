import React, { ReactNode, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import { getShortName } from '../utils/helpers';

const STATUS_OPTIONS: { key: GameStatus; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'owned', label: 'Owned' },
  { key: 'wishlist', label: 'Wishlist' },
];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

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
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function AddEditGameScreen() {
  const { games, consoles, addGame, updateGame, updateUserData } = useGames();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'AddEditGame'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddEditGame'>>();

  const gameId = route.params?.gameId;
  const isEdit = Boolean(gameId);
  const existing = gameId ? games.find((g) => g.id === gameId) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [consoleId, setConsoleId] = useState(existing?.consoleId ?? '');
  const [genre, setGenre] = useState(existing?.genre ?? '');
  const [year, setYear] = useState(existing ? String(existing.releaseYear) : '');
  const [developer, setDeveloper] = useState(existing?.developer ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [rating, setRating] = useState<number>(existing?.rating ?? 3);
  const [status, setStatus] = useState<GameStatus>('none');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genres = useMemo(
    () => Array.from(new Set(games.map((g) => g.genre))).sort(),
    [games]
  );

  if (isEdit && (!existing || !existing.isCustom)) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>This game can't be edited</Text>
      </View>
    );
  }

  const validate = () => {
    const next: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    if (!title.trim()) next.title = 'Title is required';
    if (!consoleId) next.console = 'Select a console';
    if (!genre.trim()) next.genre = 'Genre is required';

    const yearNumber = Number(year);
    if (!/^\d{4}$/.test(year) || yearNumber < 1970 || yearNumber > currentYear) {
      next.year = `Enter a year between 1970 and ${currentYear}`;
    }

    if (title.trim() && consoleId) {
      const duplicate = games.some(
        (g) =>
          g.id !== gameId &&
          g.consoleId === consoleId &&
          g.title.toLowerCase() === title.trim().toLowerCase()
      );
      if (duplicate) next.title = 'This game already exists for that console';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const data = {
      title: title.trim(),
      consoleId,
      genre: genre.trim(),
      releaseYear: Number(year),
      developer: developer.trim() || 'Unknown',
      description: description.trim() || 'No description added.',
      rating,
    };

    if (isEdit && existing) {
      updateGame({ ...existing, ...data });
    } else {
      const newId = addGame(data);
      if (status !== 'none') updateUserData(newId, { status });
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Title *" error={errors.title}>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="e.g. Donkey Kong Country"
            placeholderTextColor="#8A8AA3"
            value={title}
            onChangeText={setTitle}
          />
        </Field>

        <Field label="Console *" error={errors.console}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContent}
          >
            {consoles.map((c) => (
              <Chip
                key={c.id}
                label={getShortName(c.name)}
                active={consoleId === c.id}
                onPress={() => setConsoleId(c.id)}
              />
            ))}
          </ScrollView>
        </Field>

        <Field label="Genre *" error={errors.genre}>
          <TextInput
            style={[styles.input, errors.genre && styles.inputError]}
            placeholder="e.g. Platformer"
            placeholderTextColor="#8A8AA3"
            value={genre}
            onChangeText={setGenre}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.chipContent, styles.suggestRow]}
          >
            {genres.map((g) => (
              <Chip key={g} label={g} active={genre.trim() === g} onPress={() => setGenre(g)} />
            ))}
          </ScrollView>
        </Field>

        <Field label="Release year *" error={errors.year}>
          <TextInput
            style={[styles.input, errors.year && styles.inputError]}
            placeholder="e.g. 1994"
            placeholderTextColor="#8A8AA3"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
          />
        </Field>

        <Field label="Developer">
          <TextInput
            style={styles.input}
            placeholder="e.g. Rare"
            placeholderTextColor="#8A8AA3"
            value={developer}
            onChangeText={setDeveloper}
          />
        </Field>

        <Field label="Description">
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="What is this game about?"
            placeholderTextColor="#8A8AA3"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </Field>

        <Field label="Catalog rating">
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={34}
                  color="#F5B301"
                />
              </Pressable>
            ))}
          </View>
        </Field>

        {!isEdit && (
          <Field label="Add to my collection as">
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((option) => (
                <Pressable
                  key={option.key}
                  style={[styles.statusButton, status === option.key && styles.statusActive]}
                  onPress={() => setStatus(option.key)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === option.key && styles.statusTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Field>
        )}

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>{isEdit ? 'Save Changes' : 'Add Game'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212' },
  centerText: { color: '#8A8AA3', fontSize: 16 },
  field: { marginBottom: 18 },
  label: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#1E1E2E',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: { borderColor: '#E74C3C' },
  multiline: { minHeight: 100 },
  error: { color: '#E74C3C', fontSize: 13, marginTop: 6 },
  chipContent: { gap: 8, paddingRight: 8 },
  suggestRow: { marginTop: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#1E1E2E',
  },
  chipActive: { backgroundColor: '#F5B301' },
  chipText: { color: '#C9C9DB', fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#121212', fontWeight: '700' },
  starsRow: { flexDirection: 'row', gap: 6 },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    paddingVertical: 12,
  },
  statusActive: { backgroundColor: '#F5B301' },
  statusText: { color: '#C9C9DB', fontSize: 14, fontWeight: '500' },
  statusTextActive: { color: '#121212', fontWeight: '700' },
  saveButton: {
    backgroundColor: '#F5B301',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: { color: '#121212', fontSize: 16, fontWeight: '700' },
});