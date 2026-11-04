import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, UserGameData } from '../types';

const USER_DATA_KEY = 'rgv:userData';
const CUSTOM_GAMES_KEY = 'rgv:customGames';

export async function loadUserData(): Promise<Record<string, UserGameData>> {
  try {
    const raw = await AsyncStorage.getItem(USER_DATA_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn('Failed to load user data', error);
    return {};
  }
}

export async function saveUserData(data: Record<string, UserGameData>): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save user data', error);
  }
}

export async function loadCustomGames(): Promise<Game[]> {
  try {
    const raw = await AsyncStorage.getItem(CUSTOM_GAMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Failed to load custom games', error);
    return [];
  }
}

export async function saveCustomGames(games: Game[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(games));
  } catch (error) {
    console.warn('Failed to save custom games', error);
  }
}