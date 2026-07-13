// hooks/useCachedData.js
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://klinikunimus.vercel.app/index.php/api';

export const useCachedData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isActive = true) => {
    if (!endpoint) return;

    let finalUrl = '';
    if (endpoint.startsWith('http')) {
      finalUrl = endpoint;
    } else {
      const cleanBase = API_BASE_URL.replace(/\/+$/, '');
      const cleanEndpoint = endpoint.replace(/^\/+/, '');
      finalUrl = `${cleanBase}/${cleanEndpoint}`;
    }
    
    const cacheKey = `@cache_${finalUrl.replace(/[^a-zA-Z0-9]/g, '_')}`;

    if (isActive) {
      setLoading(true);
      setError(null);
    }

    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData && isActive) {
        setData(JSON.parse(cachedData));
      }
    } catch (e) {
      console.log('Cache read error:', e);
    }

    try {
      const response = await fetch(finalUrl);
      
      if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
      }
      
      const freshData = await response.json();

      if (isActive) {
        setData(freshData);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(freshData));
      }
    } catch (e) {
      if (isActive) {
        // PERBAIKAN: Gunakan console.log biasa, jangan console.error agar tidak muncul Kotak Merah di Expo Go
        console.log(`[useCachedData] Gagal memuat ${finalUrl}:`, e.message);
        setError(e.message);
      }
    } finally {
      if (isActive) setLoading(false);
    }
  }, [endpoint]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchData(isActive);
      return () => { isActive = false; };
    }, [fetchData])
  );

  return { data, loading, error, refresh: () => fetchData(true) };
};