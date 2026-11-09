import { ImageSourcePropType } from 'react-native';

const covers: Record<string, ImageSourcePropType> = {
  platformer: require('../../assets/covers/platformer.jpg'),
  'action-adventure': require('../../assets/covers/adventure.jpg'),
  adventure: require('../../assets/covers/adventure.jpg'),
  rpg: require('../../assets/covers/rpg.jpg'),
  puzzle: require('../../assets/covers/arcade.jpg'),
  maze: require('../../assets/covers/arcade.jpg'),
  shooter: require('../../assets/covers/arcade.jpg'),
  racing: require('../../assets/covers/racing.jpg'),
  action: require('../../assets/covers/arcade.jpg'),
  'action platformer': require('../../assets/covers/platformer.jpg'),
  'beat \'em up': require('../../assets/covers/arcade.jpg'),
  'run and gun': require('../../assets/covers/arcade.jpg'),
  stealth: require('../../assets/covers/adventure.jpg'),
  strategy: require('../../assets/covers/adventure.jpg'),
};

export function getGameArtwork(genre: string): ImageSourcePropType {
  return covers[genre.toLowerCase()] ?? covers.adventure;
}
