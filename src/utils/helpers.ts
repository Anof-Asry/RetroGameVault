// "The Legend of Zelda" -> "TL"
export function getInitials(title: string): string {
  return title
    .split(' ')
    .filter((word) => /^[A-Za-z0-9]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

// "Super Nintendo (SNES)" -> "SNES", otherwise the full name
export function getShortName(name: string): string {
  const match = name.match(/\(([^)]+)\)/);
  return match ? match[1] : name;
}