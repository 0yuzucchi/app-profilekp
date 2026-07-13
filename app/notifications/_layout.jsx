// app/notifications/_layout.jsx
import { Stack } from 'expo-router';

export default function AnnouncementsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Daftar Pengumuman' }} />
      <Stack.Screen name="[slug]" options={{ title: 'Detail Pengumuman' }} />
      <Stack.Screen name="job/[id]" options={{ title: 'Detail Lowongan' }} />
    </Stack>
  );
}