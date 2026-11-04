import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import consolesData from '../data/consoles.json';
import gamesData from '../data/games.json';
import { Game, GameConsole, UserGameData } from '../types';
import {
  loadCustomGames,
  loadUserData,
  saveCustomGames,
  saveUserData,
} from '../utils/storage';

const seedConsoles = consolesData as GameConsole[];
const seedGames = gamesData as Game[];

const defaultUserData = (gameId: string): UserGameData => ({
  gameId,
  status: 'none',
  isFavorite: false,
  myRating: null,
  notes: '',
});

type GameContextType = {
  consoles: GameConsole[];
  games: Game[];
  loading: boolean;
  getUserData: (gameId: string) => UserGameData;
  updateUserData: (
    gameId: string,
    changes: Partial<Omit<UserGameData, 'gameId'>>
  ) => void;
  toggleFavorite: (gameId: string) => void;
  addGame: (game: Omit<Game, 'id' | 'isCustom'>) => string;
  updateGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [customGames, setCustomGames] = useState<Game[]>([]);
  const [userData, setUserData] = useState<Record<string, UserGameData>>({});
  const [loading, setLoading] = useState(true);

  // Load saved data once when the app starts
  useEffect(() => {
    (async () => {
      const [savedUserData, savedGames] = await Promise.all([
        loadUserData(),
        loadCustomGames(),
      ]);
      setUserData(savedUserData);
      setCustomGames(savedGames);
      setLoading(false);
    })();
  }, []);

  // Save automatically whenever data changes (after the first load)
  useEffect(() => {
    if (!loading) saveUserData(userData);
  }, [userData, loading]);

  useEffect(() => {
    if (!loading) saveCustomGames(customGames);
  }, [customGames, loading]);

  const games = useMemo(() => [...seedGames, ...customGames], [customGames]);

  const getUserData = useCallback(
    (gameId: string) => userData[gameId] ?? defaultUserData(gameId),
    [userData]
  );

  const updateUserData = useCallback(
    (gameId: string, changes: Partial<Omit<UserGameData, 'gameId'>>) => {
      setUserData((prev) => ({
        ...prev,
        [gameId]: { ...(prev[gameId] ?? defaultUserData(gameId)), ...changes },
      }));
    },
    []
  );

  const toggleFavorite = useCallback((gameId: string) => {
    setUserData((prev) => {
      const current = prev[gameId] ?? defaultUserData(gameId);
      return { ...prev, [gameId]: { ...current, isFavorite: !current.isFavorite } };
    });
  }, []);

  const addGame = useCallback((game: Omit<Game, 'id' | 'isCustom'>) => {
    const id = `c${Date.now()}`;
    setCustomGames((prev) => [...prev, { ...game, id, isCustom: true }]);
    return id;
  }, []);

  const updateGame = useCallback((game: Game) => {
    setCustomGames((prev) => prev.map((g) => (g.id === game.id ? game : g)));
  }, []);

  const deleteGame = useCallback((gameId: string) => {
    setCustomGames((prev) => prev.filter((g) => g.id !== gameId));
    setUserData((prev) => {
      const { [gameId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const value = useMemo(
    () => ({
      consoles: seedConsoles,
      games,
      loading,
      getUserData,
      updateUserData,
      toggleFavorite,
      addGame,
      updateGame,
      deleteGame,
    }),
    [games, loading, getUserData, updateUserData, toggleFavorite, addGame, updateGame, deleteGame]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGames() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGames must be used inside a GameProvider');
  }
  return context;
}