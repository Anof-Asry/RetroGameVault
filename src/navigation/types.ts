import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Library: { consoleId?: string } | undefined;
  Collection: undefined;
  Consoles: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  GameDetails: { gameId: string };
  AddEditGame: { gameId?: string } | undefined;
};