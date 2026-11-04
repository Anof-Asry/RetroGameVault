export type GameStatus = 'owned' | 'wishlist' | 'none';

export interface GameConsole {
  id: string;
  name: string;
  manufacturer: string;
  releaseYear: number;
  description: string;
  color: string;
}

export interface Game {
  id: string;
  title: string;
  consoleId: string;
  genre: string;
  releaseYear: number;
  developer: string;
  description: string;
  rating: number;
  isCustom?: boolean;
}

export interface UserGameData {
  gameId: string;
  status: GameStatus;
  isFavorite: boolean;
  myRating: number | null;
  notes: string;
}