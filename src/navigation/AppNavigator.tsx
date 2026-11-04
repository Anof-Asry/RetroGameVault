import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ConsolesScreen from '../screens/ConsolesScreen';
import GameDetailsScreen from '../screens/GameDetailsScreen';
import AddEditGameScreen from '../screens/AddEditGameScreen';
import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F5B301',
    background: '#121212',
    card: '#1E1E2E',
    text: '#FFFFFF',
    border: '#2A2A3C',
  },
};

const tabIcons: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Library: 'game-controller',
  Collection: 'albums',
  Consoles: 'hardware-chip',
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name]} size={size} color={color} />
        ),
        tabBarActiveTintColor: '#F5B301',
        tabBarInactiveTintColor: '#8A8AA3',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Retro Game Vault' }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'Library' }} />
      <Tab.Screen name="Collection" component={CollectionScreen} options={{ title: 'My Collection' }} />
      <Tab.Screen name="Consoles" component={ConsolesScreen} options={{ title: 'Consoles' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="GameDetails"
          component={GameDetailsScreen}
          options={{ title: 'Game Details' }}
        />
        <Stack.Screen
          name="AddEditGame"
          component={AddEditGameScreen}
          options={({ route }) => ({
            title: route.params?.gameId ? 'Edit Game' : 'Add Game',
            presentation: 'modal',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}