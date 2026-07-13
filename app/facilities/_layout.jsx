// app/facilities/_layout.jsx
import { Stack } from 'expo-router';

export default function FacilitiesLayout() {
  return (
    <Stack>
      {/* Cukup satu rute index untuk satu halaman terpadu */}
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Fasilitas Klinik',
          headerShadowVisible: false, // Agar terlihat lebih clean/modern
        }} 
      />
    </Stack>
  );
}