// app/services/_layout.jsx
import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Layanan Kami' }} />
      {/* Judul untuk halaman detail layanan akan diatur di file [slug].jsx */}
    </Stack>
  );
}