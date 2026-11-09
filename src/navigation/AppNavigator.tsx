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
    primary: '#B9F36A',
    background: '#10152B',
    card: '#1A203B',
    text: '#F4F5FC',
    border: '#2A3151',
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
        tabBarActiveTintColor: '#B9F36A',
        tabBarInactiveTintColor: '#8993B2',
        tabBarStyle: {
          backgroundColor: '#171D36',
          borderTopColor: '#2A3151',
          height: 62,
          paddingTop: 7,
          paddingBottom: 7,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        headerStyle: { backgroundColor: '#171D36' },
        headerTintColor: '#F4F5FC',
        headerTitleStyle: { fontWeight: '800' },
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
