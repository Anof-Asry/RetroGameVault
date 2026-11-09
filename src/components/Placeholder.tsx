import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGames } from '../context/GameContext';

export default function Placeholder({ title }: { title: string }) {
  const { games, consoles, loading } = useGames();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>
        {loading ? 'Loading...' : `${games.length} games • ${consoles.length} consoles`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10152B',
  },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  sub: { color: '#929DBD', fontSize: 16, marginTop: 8 },
});