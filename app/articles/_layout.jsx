// app/articles/_layout.jsx
import { Stack } from 'expo-router';

export default function ArticlesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Daftar Artikel & Berita' }} 
      />
      <Stack.Screen 
        name="[slug]" 
        options={{ title: 'Detail Artikel' }} 
      />
    </Stack>
  );
}