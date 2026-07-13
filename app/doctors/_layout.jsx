// app/doctors/_layout.jsx
import { Stack } from 'expo-router';

export default function DoctorLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Daftar Dokter' }} />
      {/* Judul untuk halaman detail akan diatur di file [id].jsx */}
    </Stack>
  );
}