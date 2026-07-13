import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Pressable,
  Platform,
  Linking
} from 'react-native';
import tw from 'twrnc';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import RenderHTML from 'react-native-render-html';
import FloatingAIButton from '../components/FloatingAIButton';

import { useCachedData } from '../hooks/useCachedData';

// --- KONSTANTA & DATA STATIS (DIPINDAHKAN KELUAR KOMPONEN) ---
const DUMMY_IMAGE = "https://via.placeholder.com/400x250.png/cccccc/969696?text=Image+Not+Found";
const MAIN_GREEN = "#00A54F";
const HERO_GRADIENT_COLORS = [
  'rgba(6, 78, 59, 0.95)',
  'rgba(6, 78, 59, 0.50)',
  'rgba(6, 78, 59, 0.05)'
];

const FALLBACK_SERVICES = [
  {
    id: 1,
    title: 'Rawat Inap',
    content: '<p>Fasilitas laboratorium internal untuk pemeriksaan darah, urin, dan sampel lainnya.</p>',
    image_path: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/FOTO%20KLINIK2.jpeg',
    is_featured: 1
  }
];

const FALLBACK_FACILITIES = [
  {
    id: 1,
    category: 'Fasilitas Perawatan',
    title: 'Ruang Nifas',
    content: '["1 Kursi Penunggu Pasien", "Box Bayi", "1 Tempat Tidur", "Kamar Mandi Luar"]',
    image_path: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/FOTO%20KLINIK2.jpeg'
  }
];

const FALLBACK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Jadwal Cek Kesehatan gratis tahun 2026 di klinik pratama unimus',
    image_path: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/FOTO%20KLINIK2.jpeg'
  }
];

const FALLBACK_CONTACT = {
  address: 'Jl. Petek Kp. Gayam, RT.02/RW.06, Dadapsari, Kec. Semarang Utara, Kota Semarang, Jawa Tengah 50173',
  whatsappRegistration: '62895616833383',
  whatsappInformation: '6289675873994',
  email: 'klinikpratamarawatinap@unimus.ac.id',
  googleMapsLink: 'https://maps.google.com',
  operatingHours: '24 Jam Setiap Hari (Hari Libur Buka)',
  socialMedia: {
    "fallback_fb": { "platform": "Facebook", "link": "https://www.facebook.com/profile.php?id=100083638056092" },
    "fallback_ig": { "platform": "Instagram", "link": "https://www.instagram.com/klinikpratamaunimus_official" },
    "fallback_tt": { "platform": "Tiktok", "link": "http://tiktok.com/@klinik.unimus" },
    "fallback_yt": { "platform": "YouTube", "link": "https://www.youtube.com" }
  }
};

const CERTIFICATE_DATA = [
  { id: 1, imagePath: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/sertifikat/SERTIFIKAT%20FASYANKES%20KEMENKES.png' },
  { id: 2, imagePath: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/sertifikat/SERTIFIKAT%20AKREDITASI.png' },
  { id: 3, imagePath: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/sertifikat/SERTIFIKAT%20SERTIFIKASI%20USG.png' }
];

const PARTNERS_DATA = [
  { id: 1, uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_bpjs.png' },
  { id: 2, uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/LOGO%20BARIKLANA%20AQIQAH.png' },
  { id: 3, uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_lapklin.png' },
  { id: 4, uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_cito.png' },
  { id: 5, uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_bni.png' }
];

const HTML_TAGS_STYLES = {
  p: tw`text-gray-600 text-base mb-4 leading-6`,
  h1: tw`text-emerald-800 text-2xl font-bold mb-3`,
  h2: tw`text-emerald-800 text-xl font-bold mb-2`,
  ul: tw`mb-4 ml-2`,
  li: tw`text-gray-600 text-base mb-2`,
  strong: tw`text-gray-800 font-bold`,
};

// --- KOMPONEN SKELETON ANIMASI HALUS ---
const Skeleton = ({ style }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const sharedAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    sharedAnimation.start();
    return () => sharedAnimation.stop();
  }, [pulseAnim]);

  return <Animated.View style={[tw`bg-gray-200`, style, { opacity: pulseAnim }]} />;
};

// --- SKELETON PER BAGIAN ---
const CarouselSkeleton = ({ width }) => (
  <View style={[{ width, height: 220 }, tw`bg-gray-100 p-6 justify-between relative overflow-hidden`]}>
    <Skeleton style={tw`absolute inset-0 w-full h-full`} />
    <View style={tw`z-10`}>
      <Skeleton style={tw`w-40 h-6 rounded-md bg-gray-300/50 mb-2`} />
    </View>
    <View style={tw`z-10 gap-2`}>
      <Skeleton style={tw`w-3/4 h-5 rounded-md bg-gray-300/50`} />
      <Skeleton style={tw`w-1/2 h-3.5 rounded-md bg-gray-300/50`} />
    </View>
    <View style={tw`absolute bottom-3 w-full flex-row justify-center gap-2`}>
      <Skeleton style={tw`w-6 h-1.5 rounded-full bg-gray-300/60`} />
      <Skeleton style={tw`w-2 h-1.5 rounded-full bg-gray-300/40`} />
      <Skeleton style={tw`w-2 h-1.5 rounded-full bg-gray-300/40`} />
    </View>
  </View>
);

const FacilityCardSkeleton = () => (
  <View style={tw`bg-white rounded-[28px] w-72 mr-6 shadow-md border border-gray-100 overflow-hidden`}>
    <View style={tw`relative w-full h-44 bg-gray-50`}>
      <Skeleton style={tw`w-full h-full`} />
      <View style={tw`absolute top-3 left-3`}>
        <Skeleton style={tw`w-28 h-6 rounded-full`} />
      </View>
    </View>
    <View style={tw`p-5`}>
      <Skeleton style={tw`w-3/4 h-6 rounded-md mb-2`} />
      <Skeleton style={tw`w-1/2 h-3 rounded mb-5`} />
      <View style={tw`flex-row flex-wrap justify-between gap-y-2`}>
        {[1, 2, 3, 4].map((_, idx) => (
          <View key={idx} style={tw`w-[48%] flex-row items-center bg-emerald-50/20 px-2 rounded-full`}>
            <Skeleton style={tw`w-3.5 h-3.5 rounded-full mr-1.5`} />
            <Skeleton style={tw`flex-1 h-3 rounded-full`} />
          </View>
        ))}
      </View>
    </View>
  </View>
);

const AnnouncementCardSkeleton = () => (
  <View style={tw`relative w-72 h-44 mr-4 rounded-tl-[68px] rounded-bl-[20px] rounded-br-[68px] overflow-hidden bg-gray-100`}>
    <Skeleton style={tw`absolute inset-0 w-full h-full`} />
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.08)' }]} />
    <View style={tw`absolute bottom-4 left-32 right-4 z-10 gap-1.5`}>
      <Skeleton style={tw`w-full h-3 rounded bg-white/50`} />
      <Skeleton style={tw`w-4/5 h-3 rounded bg-white/50`} />
    </View>
    <View style={tw`absolute bottom-0 left-0 bg-white px-5 py-3.5 rounded-tr-[24px]`}>
      <Skeleton style={tw`w-16 h-3 rounded bg-gray-300`} />
    </View>
  </View>
);

const ContactSkeleton = () => (
  <View style={tw`flex-row justify-between items-stretch`}>
    <View style={tw`w-[44%] h-80 rounded-[30px] overflow-hidden shadow-md border-2 border-gray-50`}>
      <Skeleton style={tw`w-full h-full`} />
    </View>
    <View style={tw`w-[1px] bg-gray-200 my-1`} />
    <View style={tw`w-[50%] flex-col justify-between py-2`}>
      {[1, 2, 3, 4].map((_, idx) => (
        <View key={idx} style={tw`flex-row items-center`}>
          <Skeleton style={tw`w-8 h-8 rounded-full mr-3`} />
          <View style={tw`flex-1 gap-1.5`}>
            <Skeleton style={tw`w-3/4 h-3 rounded-md`} />
            <Skeleton style={tw`w-1/2 h-3 rounded-md`} />
          </View>
        </View>
      ))}
      <View style={tw`h-[1px] w-full bg-gray-200`} />
      <View>
        <Skeleton style={tw`w-24 h-4 rounded mb-2`} />
        <View style={tw`flex-row gap-3`}>
          {[1, 2, 3, 4].map((_, idx) => (
            <Skeleton key={idx} style={tw`w-8 h-8 rounded-full`} />
          ))}
        </View>
      </View>
    </View>
  </View>
);

// --- HELPER LAIN ---
const stripHtml = (htmlString) => {
  if (typeof htmlString !== 'string') return '';
  return htmlString.replace(/<[^>]*>?/gm, '');
};

const extractAmenities = (content) => {
  if (!content) return [];
  try {
      let parsed = typeof content === 'string' ? JSON.parse(content) : content;
      if (Array.isArray(parsed)) {
          return parsed.map(item => (typeof item === 'object' ? item.item : item)).filter(Boolean);
      }
  } catch (e) { return []; }
  return [];
};

const formatPhoneNumber = (num) => {
  if (!num) return '';
  const clean = num.replace(/[^0-9]/g, '');
  if (clean.startsWith('62')) {
    return `+62 ${clean.slice(2, 5)}-${clean.slice(5, 9)}-${clean.slice(9)}`;
  }
  if (clean.startsWith('0')) {
    return `+62 ${clean.slice(1, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}`;
  }
  return `+${clean}`;
};

const parseSocialMedia = (socialData) => {
  if (!socialData) return [];
  if (typeof socialData === 'string') {
    try {
      return Object.values(JSON.parse(socialData));
    } catch (e) { return []; }
  }
  return Object.values(socialData);
};

const openExternalUrl = async (url) => {
  if (!url || typeof url !== 'string') return;
  let targetUrl = url.trim().replace(/^[",'\s]+|[",'\s]+$/g, '');
  if (targetUrl === '' || targetUrl === ',') return;
  if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith('mailto:')) {
    targetUrl = 'https://' + targetUrl;
  }
  try { await Linking.openURL(targetUrl); } catch (err) { console.warn(err); }
};

const openWhatsApp = (num) => {
  if (!num) return;
  const clean = num.replace(/[^0-9]/g, '');
  openExternalUrl(`https://wa.me/${clean}`);
};

const handleMapPress = async (link, address) => {
  const query = encodeURIComponent(address || "Klinik Pratama UNIMUS Semarang");
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  try {
    await Linking.openURL(webUrl);
  } catch (err) {
    const nativeUrl = Platform.OS === 'ios' ? `maps://0,0?q=${query}` : `geo:0,0?q=${query}`;
    Linking.openURL(nativeUrl).catch(() => {});
  }
};

const SectionTitle = React.memo(({ title }) => (
  <View style={tw`items-center mb-6 mt-4 w-full`}>
    <Text 
      numberOfLines={1} 
      style={tw`text-xl font-black text-black tracking-widest uppercase text-center`}
    >
      {title}
    </Text>
    <View style={tw`h-[3px] w-28 bg-[${MAIN_GREEN}] mt-1`} />
  </View>
));

// --- KOMPONEN UTAMA ---
const Home = () => {
  const { width } = useWindowDimensions();

  // Memanggil Custom Hook Offline Caching
  const { data: servicesData, loading: loadingServices, error: errorServices } = useCachedData('/services');
  const { data: facPerawatanData, loading: loadingFacPerawatan, error: errorFacPerawatan } = useCachedData('/facilities/perawatan');
  const { data: facPenunjangData, loading: loadingFacPenunjang, error: errorFacPenunjang } = useCachedData('/facilities/penunjang');
  const { data: announcementsData, loading: loadingAnnouncements, error: errorAnnouncements } = useCachedData('/announcements');
  const { data: contactData, loading: loadingContact, error: errorContact } = useCachedData('/contact');

  // Carousel State & Ref
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  // Modal State & Anim
  const [activeService, setActiveService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalAnim = useRef(new Animated.Value(0)).current;
  
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // --- RE-PARSING DATA DENGAN MEMOIZATION ---
  const services = useMemo(() => {
    if (!servicesData) return [];
    return Array.isArray(servicesData) ? servicesData : (servicesData.data || []);
  }, [servicesData]);

  const facilities = useMemo(() => {
    const f1 = facPerawatanData ? (Array.isArray(facPerawatanData) ? facPerawatanData : (facPerawatanData.data || [])) : [];
    const f2 = facPenunjangData ? (Array.isArray(facPenunjangData) ? facPenunjangData : (facPenunjangData.data || [])) : [];
    return [...f1, ...f2];
  }, [facPerawatanData, facPenunjangData]);

  const announcements = useMemo(() => {
    if (!announcementsData) return [];
    return Array.isArray(announcementsData) ? announcementsData : (announcementsData.data || []);
  }, [announcementsData]);

  const contact = useMemo(() => contactData || null, [contactData]);

  // Optimalisasi Filter List menggunakan useMemo agar tidak dieksekusi terus menerus
  const displayServices = useMemo(() => {
    const activeList = services.length > 0 ? services : FALLBACK_SERVICES;
    return activeList.filter(item => item.is_featured == 1 || item.is_featured === true).slice(0, 5);
  }, [services]);

  const displayFacilities = useMemo(() => {
    return facilities.length > 0 ? facilities : FALLBACK_FACILITIES;
  }, [facilities]);

  const displayAnnouncements = useMemo(() => {
    const activeList = announcements.length > 0 ? announcements : FALLBACK_ANNOUNCEMENTS;
    return activeList.slice(0, 5);
  }, [announcements]);

  const activeContact = useMemo(() => contact || FALLBACK_CONTACT, [contact]);

  // Penyaring Koneksi Offline Pintar
  const isNetworkError = (errorMsg) => {
    if (!errorMsg) return false;
    if (errorMsg.includes('404')) return false;
    return true;
  };

  const hasNetworkError = useMemo(() => {
    return isNetworkError(errorServices) || 
           isNetworkError(errorFacPerawatan) || 
           isNetworkError(errorFacPenunjang) || 
           isNetworkError(errorAnnouncements) || 
           isNetworkError(errorContact);
  }, [errorServices, errorFacPerawatan, errorFacPenunjang, errorAnnouncements, errorContact]);

  const hasAnyData = services.length > 0 || facilities.length > 0 || announcements.length > 0 || contact !== null;
  const showOfflineBanner = hasNetworkError && hasAnyData;

  // Status Loading Parsial untuk Skeletons
  const showServicesSkeleton = loadingServices && services.length === 0;
  const showFacilitiesSkeleton = (loadingFacPerawatan || loadingFacPenunjang) && facilities.length === 0;
  const showAnnouncementsSkeleton = loadingAnnouncements && announcements.length === 0;
  const showContactSkeleton = loadingContact && contact === null;

  // --- EVENT HANDLERS (OPTIMALISASI ANIMASI) ---
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const getSocialLinkByPlatform = useCallback((platformName) => {
    const list = parseSocialMedia(activeContact.socialMedia);
    const found = list.find(item => item.platform && item.platform.toLowerCase() === platformName.toLowerCase());
    
    if (found && found.link) {
      let cleanLink = found.link.trim().replace(/^[",'\s]+|[",'\s]+$/g, '');
      if (cleanLink !== '' && cleanLink !== ',') return cleanLink;
    }
    
    const defaultLinks = {
      'facebook': 'https://www.facebook.com/profile.php?id=100083638056092',
      'instagram': 'https://www.instagram.com/klinikpratamaunimus_official',
      'tiktok': 'http://tiktok.com/@klinik.unimus',
      'youtube': 'https://www.youtube.com'
    };
    
    return defaultLinks[platformName.toLowerCase()] || null;
  }, [activeContact.socialMedia]);

  // --- EFFECTS ---

  // Animasi Berputar Auto-Play Carousel
  useEffect(() => {
    if (showServicesSkeleton || displayServices.length < 2 || isAutoPlayPaused) return;

    const timer = setInterval(() => {
      let nextIndex = activeSlideIndex + 1;
      if (nextIndex >= displayServices.length) {
        nextIndex = 0;
      }

      scrollViewRef.current?.scrollTo({ 
        x: nextIndex * width, 
        animated: true 
      });

      setActiveSlideIndex(nextIndex);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeSlideIndex, displayServices.length, isAutoPlayPaused, width, showServicesSkeleton]);

  // Animasi Gelombang Sertifikat
  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollAnim, { toValue: 1, duration: 7000, useNativeDriver: true }),
        Animated.delay(1500),
        Animated.timing(scrollAnim, { toValue: 0, duration: 7000, useNativeDriver: true }),
        Animated.delay(1500),
      ])
    );
    loopAnim.start();
    return () => loopAnim.stop();
  }, [scrollAnim]);

  // --- HANDLERS MODAL ---
  const openModal = useCallback((service) => {
    setActiveService(service);
    setModalVisible(true);
    Animated.spring(modalAnim, { toValue: 1, tension: 65, friction: 10, useNativeDriver: true }).start();
  }, [modalAnim]);
  
  const closeModal = useCallback(() => {
    Animated.timing(modalAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      setModalVisible(false);
      setActiveService(null);
    });
  }, [modalAnim]);

  const backdropOpacity = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] });
  const modalScale = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });
  const modalTranslateY = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] });

  // Optimalisasi Object RenderHTML agar tidak dialokasikan berulang kali di memori
  const htmlSource = useMemo(() => ({
    html: activeService?.content || ''
  }), [activeService?.content]);

  const emailString = activeContact?.email || 'klinikpratamarawatinap@unimus.ac.id';
  const emailParts = useMemo(() => emailString.split('@'), [emailString]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* --- BANNER OFFLINE DINAMIS --- */}
      {showOfflineBanner && (
        <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center border-b border-amber-200`}>
          <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
          <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>
            Menampilkan data terakhir (Mode Offline)
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* === HERO CAROUSEL / SKELETON: LAYANAN UNGGULAN === */}
        {showServicesSkeleton ? (
          <CarouselSkeleton width={width} />
        ) : (
          <View style={tw`relative w-full h-[220px]`}> 
            <Animated.ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onScrollBeginDrag={() => setIsAutoPlayPaused(true)}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setActiveSlideIndex(index);
                setIsAutoPlayPaused(false);
              }}
            >
              {displayServices.map((item, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                
                const textOpacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                
                const textTranslateY = scrollX.interpolate({
                  inputRange,
                  outputRange: [20, 0, 20],
                  extrapolate: 'clamp',
                });

                return (
                  <Pressable 
                    key={item.id || index} 
                    onPress={() => openModal(item)}
                    style={{ width, height: 220 }} 
                  >
                    {/* OPTIMALISASI: Mengganti ImageBackground dengan Image (expo-image) + Absolute View */}
                    <View style={tw`w-full h-full relative`}>
                      <Image
                        source={{ uri: item.image_path || item.image_url || DUMMY_IMAGE }}
                        style={StyleSheet.absoluteFillObject}
                        contentFit="cover"
                        transition={200}
                      />
                      <LinearGradient
                        colors={HERO_GRADIENT_COLORS}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                      />
                      
                      <View style={tw`flex-1 px-6 pt-4 pb-10 justify-between z-10`}>
                        <Text style={tw`text-white text-xl font-black tracking-widest`}>LAYANAN UNGGULAN</Text>
                        
                        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslateY }] }}>
                          <Text style={tw`text-white text-lg font-bold mb-1`} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={tw`text-white/95 text-xs leading-relaxed mb-1 pr-4`} numberOfLines={2}>
                            {stripHtml(item.content)}
                          </Text>
                        </Animated.View>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </Animated.ScrollView>

            <View style={tw`absolute bottom-3 w-full flex-row justify-center items-center gap-2 pointer-events-none`}>
              {displayServices.map((_, i) => {
                 const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                 
                 const dotWidth = scrollX.interpolate({
                   inputRange,
                   outputRange: [8, 28, 8],
                   extrapolate: 'clamp',
                 });
                 
                 const dotOpacity = scrollX.interpolate({
                   inputRange,
                   outputRange: [0.5, 1, 0.5],
                   extrapolate: 'clamp',
                 });

                 return (
                   <Animated.View 
                     key={i} 
                     style={[tw`h-1.5 bg-white rounded-full`, { width: dotWidth, opacity: dotOpacity }]} 
                   />
                 );
              })}
            </View>
          </View>
        )}

        {/* === FASILITAS / SKELETON === */}
        <View style={tw`py-8 bg-white`}>
          <SectionTitle title="FASILITAS" />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`pl-6 pr-2 pb-6`}>
            {showFacilitiesSkeleton ? (
              [1, 2].map((_, index) => <FacilityCardSkeleton key={index} />)
            ) : (
              displayFacilities.slice(0, 4).map((item, index) => {
                const amenities = extractAmenities(item.content);
                const rawFeatures = amenities.length > 0 ? amenities : ['Fasilitas 1', 'Fasilitas 2', 'Fasilitas 3'];
                
                const sortedFeatures = [...rawFeatures].sort((a, b) => a.length - b.length);
                const featuresToDisplay = sortedFeatures.slice(0, 4);

                return (
                  <View key={item.id || index} style={tw`bg-white rounded-[28px] w-72 mr-6 shadow-md border border-gray-100`}>
                    <View style={tw`relative rounded-t-[28px] overflow-hidden bg-gray-100`}>
                      <Image 
                        source={{ uri: item.image_path || item.image_url || DUMMY_IMAGE }} 
                        style={tw`w-full h-44`} 
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={tw`absolute top-3 left-3 bg-white px-3.5 py-1.5 rounded-full shadow-sm`}>
                        <Text style={tw`text-[${MAIN_GREEN}] font-bold text-[10px] uppercase`}>
                          {item.category || 'FASILITAS PERAWATAN'}
                        </Text>
                      </View>
                    </View>

                    <View style={tw`p-5`}>
                      <Text style={tw`text-black font-extrabold text-xl mb-1`} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={tw`text-gray-400 font-bold text-[10px] tracking-widest uppercase mb-4`}>
                        FASILITAS TERSEDIA
                      </Text>
                      
                      <View style={tw`flex-row flex-wrap justify-between`}>
                        {featuresToDisplay.map((feat, idx) => (
                          <View 
                            key={idx} 
                            style={tw`w-[48%] flex-row items-center bg-[#F0FDF4] border border-emerald-100/80 px-2.5 py-1.5 rounded-full mb-2 shadow-sm`}
                          >
                            <Ionicons name="checkmark-circle" size={14} color={MAIN_GREEN} style={tw`mr-1`} />
                            
                            <Text 
                              style={tw`text-[10px] text-[#0A5C36] font-bold flex-1`} 
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {feat}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* === PENGUMUMAN TERKINI / SKELETON === */}
        <View style={tw`py-5 bg-[#E6F9EE]`}>
          
          <View style={tw`items-center mb-6`}>
            <Text style={tw`text-lg font-black text-teal-950 tracking-widest`}>PENGUMUMAN TERKINI</Text>
            <View style={tw`h-[4px] w-24 bg-[#009B4C] mt-2 rounded-full`} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`pl-6 pr-2`}>
            {showAnnouncementsSkeleton ? (
              [1, 2].map((_, index) => <AnnouncementCardSkeleton key={index} />)
            ) : (
              displayAnnouncements.map((item, index) => {
                const ANNOUNCEMENT_PLACEHOLDER = "https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/announcements/placeholder/placeholder-pengumuman.png";
                const imageSource = item.image_url || item.image_path || ANNOUNCEMENT_PLACEHOLDER;
                const detailHref = item.slug ? `/notifications/${item.slug}` : '/notifications';

                return (
                  <View 
                    key={item.id || index} 
                    style={tw`relative w-72 h-44 mr-4 rounded-tl-[68px] rounded-bl-[20px] rounded-br-[68px] overflow-hidden border border-emerald-100/60 shadow-md mb-2 bg-gray-100`}
                  >
                    <Image 
                      source={{ uri: imageSource }} 
                      style={tw`w-full h-full bg-gray-100`} 
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.45)' }]} />

                    <View style={tw`absolute bottom-4 left-32 right-4 z-10`}>
                      <Text style={tw`text-white font-extrabold text-[11px] leading-snug`} numberOfLines={3}>
                        {item.title}
                      </Text>
                    </View>

                    <Link href={detailHref} asChild>
                      <TouchableOpacity style={tw`absolute bottom-0 left-0 bg-white px-5 py-3.5 rounded-tr-[24px] shadow-sm z-20`}>
                        <Text style={tw`text-black font-black text-[9px] tracking-wider`}>SELENGKAPNYA</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* === SERTIFIKAT === */}
        <View style={tw`py-10 bg-white`}>
          <SectionTitle title="SERTIFIKAT" />

          <View style={tw`overflow-hidden w-full`}>
            <Animated.View
              style={[
                tw`flex-row pl-6 pr-2 py-4`,
                {
                  transform: [
                    {
                      translateX: scrollAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -Math.max(0, 712 - width)],
                      }),
                    },
                  ],
                },
              ]}
            >
              {CERTIFICATE_DATA.map((cert) => (
                <View
                  key={cert.id}
                  style={tw`border-[4px] border-[${MAIN_GREEN}] rounded-[16px] p-1.5 bg-white mr-5 shadow-sm`}
                >
                  <Image
                    source={{ uri: cert.imagePath }}
                    style={tw`w-52 h-36 rounded-[10px]`}
                    contentFit="contain"
                    transition={200}
                  />
                </View>
              ))}
            </Animated.View>
          </View>
        </View>

        {/* === KERJA SAMA === */}
        <View style={tw` bg-[#E6F9EE] relative overflow-hidden`}>
          <View 
            style={[
              tw`absolute -top-16 -right-16 w-42 h-42 rounded-full border-[18px] border-[${MAIN_GREEN}] opacity-95`,
              { backgroundColor: 'transparent' }
            ]} 
          />
          <View style={tw`absolute -bottom-14 -left-14 w-28 h-28 bg-[${MAIN_GREEN}] rotate-45 opacity-95`} />
          <View style={tw`absolute -bottom-18 -left-18 w-32 h-32 border-[8px] border-[${MAIN_GREEN}]/40 rotate-45`} />

          <View style={tw`z-10`}>
            <SectionTitle title="KERJA SAMA" />
            
            <View style={tw`items-center px-4`}>
              <View style={tw`flex-row justify-center items-center gap-x-10 mb-8`}>
                {PARTNERS_DATA.slice(0, 3).map((partner) => (
                  <Image
                    key={partner.id}
                    source={{ uri: partner.uri }}
                    style={tw`w-26 h-16`}
                    contentFit="contain"
                    transition={200}
                  />
                ))}
              </View>

              <View style={tw`flex-row justify-center items-center gap-x-16`}>
                {PARTNERS_DATA.slice(3, 5).map((partner) => (
                  <Image
                    key={partner.id}
                    source={{ uri: partner.uri }}
                    style={tw`w-28 h-16`}
                    contentFit="contain"
                    transition={200}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* === KONTAK / SKELETON === */}
        <View style={tw`py-10 bg-white px-6 pb-20`}>
          <SectionTitle title="KONTAK" />
          <Text style={tw`text-center text-black font-bold text-[13px] mb-8 mt-[-10px]`}>
            Hubungi Klinik Pratama Unimus melalui sosial media.
          </Text>

          {showContactSkeleton ? (
            <ContactSkeleton />
          ) : (
            <View style={tw`flex-row justify-between items-stretch`}>
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => handleMapPress(activeContact.googleMapsLink, activeContact.address)}
                style={tw`w-[44%] h-80 rounded-[30px] overflow-hidden shadow-md border-2 border-gray-50`}
              >
                <Image 
                  source={{ uri: 'https://static-maps.yandex.ru/1.x/?ll=110.4194605,-6.9677168&z=16&l=map&size=450,450&lang=en_US&pt=110.4194605,-6.9677168,pm2rdm' }}
                  style={tw`w-full h-full`}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>

              <View style={tw`w-[1px] bg-gray-300 my-1`} />

              <View style={tw`w-[50%] flex-col justify-between py-2`}>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => handleMapPress(activeContact.googleMapsLink, activeContact.address)}
                  style={tw`flex-row items-start`}
                >
                  <View style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center mr-3 mt-1 flex-shrink-0`}>
                    <Ionicons name="location-outline" size={16} color="white" />
                  </View>
                  <Text style={tw`flex-1 text-[11px] text-gray-700 leading-tight font-semibold`}>
                    {activeContact.address}
                  </Text>
                </TouchableOpacity>

                <View style={tw`h-[1px] w-full bg-gray-300`} />

                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => openWhatsApp(activeContact.whatsappRegistration)}
                  style={tw`flex-row items-center`}
                >
                  <View style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center mr-3 flex-shrink-0`}>
                    <FontAwesome5 name="whatsapp" size={16} color="white" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[11px] font-black text-gray-800`}>(Pendaftaran)</Text>
                    <Text style={tw`text-[11px] font-black text-gray-800`}>
                      {formatPhoneNumber(activeContact.whatsappRegistration)}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => openExternalUrl(`mailto:${emailString}`)}
                  style={tw`flex-row items-center`}
                >
                  <View style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center mr-3 flex-shrink-0`}>
                    <Ionicons name="mail-outline" size={16} color="white" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[10px] font-bold text-gray-800`}>{emailParts[0] || 'klinikpratamarawatinap'}</Text>
                    <Text style={tw`text-[10px] font-bold text-gray-800`}>@{emailParts[1] || 'unimus.ac.id'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => openWhatsApp(activeContact.whatsappInformation)}
                  style={tw`flex-row items-center`}
                >
                  <View style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center mr-3 flex-shrink-0`}>
                    <FontAwesome5 name="whatsapp" size={16} color="white" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[11px] font-black text-gray-800`}>(Informasi)</Text>
                    <Text style={tw`text-[11px] font-black text-gray-800`}>
                      {formatPhoneNumber(activeContact.whatsappInformation)}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={tw`h-[1px] w-full bg-gray-300`} />

                <View>
                  <Text style={tw`text-[13px] font-bold text-gray-700 mb-3`}>Sosial Media</Text>
                  <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity 
                      activeOpacity={0.7}
                      onPress={() => {
                        const link = getSocialLinkByPlatform('Facebook');
                        if (link) openExternalUrl(link);
                      }}
                      style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center`}
                    >
                      <FontAwesome5 name="facebook-f" size={14} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      activeOpacity={0.7}
                      onPress={() => {
                        const link = getSocialLinkByPlatform('Instagram');
                        if (link) openExternalUrl(link);
                      }}
                      style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center`}
                    >
                      <Ionicons name="logo-instagram" size={16} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      activeOpacity={0.7}
                      onPress={() => {
                        const link = getSocialLinkByPlatform('Tiktok');
                        if (link) openExternalUrl(link);
                      }}
                      style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center`}
                    >
                      <FontAwesome5 name="tiktok" size={14} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      activeOpacity={0.7}
                      onPress={() => {
                        const link = getSocialLinkByPlatform('YouTube');
                        if (link) openExternalUrl(link);
                      }}
                      style={tw`bg-[${MAIN_GREEN}] w-9 h-9 rounded-full items-center justify-center`}
                    >
                      <Ionicons name="logo-youtube" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      {/* === MODAL POPUP DETAIL LAYANAN === */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={tw`flex-1 justify-center items-center p-5`}>
          <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: backdropOpacity }]} />
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>

          <Animated.View style={[
            tw`bg-white w-full max-h-[85%] rounded-[35px] overflow-hidden shadow-2xl`,
            { maxWidth: 500, transform: [{ scale: modalScale }, { translateY: modalTranslateY }], opacity: modalAnim }
          ]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {activeService && (
                <>
                  <Image
                    source={{ uri: activeService.image_path || activeService.image_url || DUMMY_IMAGE }}
                    style={[tw`w-full`, { aspectRatio: 486 / 333 }]}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={tw`p-6 pt-8`}>
                    <Text style={tw`text-2xl text-emerald-700 font-extrabold mb-4 border-b border-gray-100 pb-3`}>
                      {activeService.title}
                    </Text>
                    <RenderHTML 
                      contentWidth={width - 80} 
                      source={htmlSource} 
                      tagsStyles={HTML_TAGS_STYLES} 
                    />
                    <View style={tw`h-6`} />
                    <TouchableOpacity onPress={closeModal} activeOpacity={0.8} style={tw`bg-[#00A54F] py-4 rounded-2xl items-center shadow-md`}>
                      <Text style={tw`text-white font-bold text-base`}>Tutup Detail</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </Animated.View>

        </View>
      </Modal>
      <FloatingAIButton /> 
    </View>
  );
};

export default Home;