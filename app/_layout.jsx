import React, { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, TouchableOpacity, View, Text } from 'react-native';
import { Tabs, Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image'; // Mengimpor Image untuk rendering logo yang optimal

import '../global.css';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function saveTokenToServer(token) {

  if (!token) {
    console.log('❌ TOKEN TIDAK ADA');
    return;
  }

  try {

    const deviceInfo = {
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      modelId: Device.modelId,
      deviceName: Device.deviceName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      deviceType: Device.deviceType,
    };

    const finalDeviceName =
      Device.modelName ||
      Device.deviceName ||
      `${Device.brand || 'Unknown'} ${Device.osName || ''}`.trim();

    const payload = {
      token,
      device_name: finalDeviceName,
      device_info: deviceInfo,
    };

    console.log('🌐 API URL:', `${API_BASE_URL}/save-push-token`);
    console.log('📦 PAYLOAD:', payload);

    const response = await fetch(
      `${API_BASE_URL}/save-push-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    console.log('📡 STATUS:', response.status);

    const text = await response.text();

    console.log('📦 RESPONSE:', text);

  } catch (error) {

    console.log('🔥 SAVE TOKEN ERROR:', error);

  }
}

async function registerForPushNotificationsAsync() {

  let token = null;

  if (Platform.OS === 'android') {

    await Notifications.setNotificationChannelAsync(
      'default',
      {
        name: 'default',
        importance:
          Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      }
    );
  }

  if (!Device.isDevice) {

    console.log(
      '❌ Push Notification hanya berjalan pada device fisik'
    );

    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {

    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {

    console.log(
      '❌ Permission Push Notification ditolak'
    );

    return null;
  }

  try {

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    console.log('📌 PROJECT ID:', projectId);

    if (!projectId) {

      console.log(
        '❌ EAS Project ID tidak ditemukan'
      );

      return null;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    console.log('✅ EXPO TOKEN:', token);

    await saveTokenToServer(token);

  } catch (error) {

    console.log(
      '🔥 ERROR GET EXPO TOKEN:',
      error
    );

    return null;
  }

  return token;
}

export default function AppLayout() {

  const router = useRouter();

  const [expoPushToken, setExpoPushToken] =
    useState('');

  const [notification, setNotification] =
    useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

    const setupNotifications = async () => {

      const token =
        await registerForPushNotificationsAsync();

      if (token) {

        setExpoPushToken(token);

        console.log(
          '✅ TOKEN BERHASIL DISIMPAN:',
          token
        );
      }

      notificationListener.current =
        Notifications.addNotificationReceivedListener(
          notification => {

            console.log(
              '📩 NOTIFIKASI MASUK:',
              notification
            );

            setNotification(notification);
          }
        );

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
          response => {

            const data =
              response.notification.request.content.data;

            console.log(
              '👆 NOTIFIKASI DITEKAN:',
              data
            );

            if (data?.screen) {

              router.push(data.screen);

              return;
            }

            if (
              data?.type === 'registration_reminder'
            ) {

              router.push('/registration');
            }
          }
        );
    };

    setupNotifications();

    return () => {

      notificationListener.current?.remove();

      responseListener.current?.remove();
    };

  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00A54F',
        tabBarInactiveTintColor: 'gray',

        tabBarLabelStyle: {
          fontSize: 11,
          paddingBottom: 2,
        },

        // Mengatur gaya dasar header bar
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          shadowOpacity: 0, // Menghilangkan bayangan default iOS
          elevation: 0,     // Menghilangkan bayangan default Android
        },

        // Menyembunyikan judul teks standar bawaan router
        headerTitle: () => null,

        // Kustomisasi Bagian Kiri (Logo & Nama Klinik sesuai Gambar)
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 15,
            }}
          >
            <Image
              // Menggunakan tautan logo Unimus resmi. Bisa diganti ke path lokal seperti require('../assets/logo.png') jika tersedia
              source={{ uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png' }}
              style={{ width: 38, height: 38 }}
              contentFit="contain"
            />
            <View style={{ marginLeft: 8 }}>
              <Text
                style={{
                  color: '#00A54F',
                  fontSize: 12.5,
                  fontWeight: '900',
                  lineHeight: 14.5,
                  letterSpacing: 0.3,
                }}
              >
                KLINIK PRATAMA
              </Text>
              <Text
                style={{
                  color: '#00A54F',
                  fontSize: 12.5,
                  fontWeight: '900',
                  lineHeight: 14.5,
                  letterSpacing: 0.3,
                }}
              >
                UNIMUS
              </Text>
            </View>
          </View>
        ),

        // Kustomisasi Bagian Kanan (Tombol Daftar & Ikon Lonceng Notifikasi)
        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 15,
            }}
          >
            <Link
              href="/registration"
              asChild
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#00A54F',
                  paddingHorizontal: 15,
                  paddingVertical: 7,
                  borderRadius: 20,
                  marginRight: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color="white"
                  style={{
                    marginRight: 5,
                  }}
                />

                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  Daftar
                </Text>
              </TouchableOpacity>
            </Link>

            <Link
              href="/notifications"
              asChild
            >
              <TouchableOpacity style={{ padding: 4 }}>
                <Ionicons
                  name="notifications-outline"
                  size={26}
                  color="#111111"
                />
                {/* Red Notification Badge Dot */}
                <View
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: '#FF2D55',
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    borderWidth: 1,
                    borderColor: 'white',
                  }}
                />
              </TouchableOpacity>
            </Link>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: 'Layanan',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="grid"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="facilities"
        options={{
          title: 'Fasilitas',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="business"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="doctors"
        options={{
          title: 'Dokter',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="medkit"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="articles"
        options={{
          title: 'Artikel',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="newspaper"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="registration"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="announcements"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="chat-ai/index"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}