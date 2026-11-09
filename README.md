# Retro Game Vault – Offline Retro Game Collection Catalog & Rating Tracker

A React Native (Expo) mobile app for browsing classic video games, building a personal collection, and tracking ratings and notes. It works fully offline and uses no public APIs or online databases.

**ICA 03 – Individual React Native Project**
Name: Asry | Index No: [2022/ICT/100] | University of Vavuniya

## Features

- Browse 40 retro games across 10 classic consoles
- Search by title or developer
- Filter by console and genre, and sort by title, rating or release year
- View detailed game information
- Mark games as Owned or Wishlist, and add favorites
- Give each game your own star rating and write notes
- Add, edit and delete your own games
- Collection screen with Owned, Wishlist and Favorites tabs
- Console guide with manufacturer filter and game counts
- Home dashboard with statistics, top-rated games and a random game picker
- All data stored locally on the device

## Screens

1. **Home** – statistics, quick actions, top-rated games
2. **Library** – full game list with search, filters and sorting
3. **My Collection** – Owned / Wishlist / Favorites
4. **Consoles** – console guide that opens the filtered Library
5. **Game Details** – full info, status, favorite, rating, notes
6. **Add / Edit Game** – form with validation

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation (bottom tabs and native stack)
- AsyncStorage for local persistence
- Bundled JSON files as the local dataset
- React Context for state management

## Local Data

- `src/data/consoles.json` – 10 consoles
- `src/data/games.json` – 40 games
- User data (status, favorites, ratings, notes) and custom games are saved on the device with AsyncStorage

## Getting Started

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go, or press `a` to open an Android emulator.

## Project Structure

```
src/
  components/   GameCard, Placeholder
  context/      GameContext (data and state)
  data/         consoles.json, games.json
  navigation/   AppNavigator, types
  screens/      Home, Library, Collection, Consoles, GameDetails, AddEditGame
  types/        TypeScript models
  utils/        storage and helper functions
```