import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    useWindowDimensions, 
    TouchableOpacity, 
    TextInput,
    Animated 
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter, Link } from 'expo-router';
import RenderHTML from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image'; // Menggunakan expo-image untuk caching gambar
import tw from 'twrnc';

// Import hook caching buatan kita
import { useCachedData } from '../../hooks/useCachedData';

// --- KOMPONEN SKELETON DETAIL ---
const DetailSkeleton = () => {
    const pulseAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <View style={tw`p-5 pt-8`}>
                <Animated.View style={[tw`bg-gray-200 h-4 w-32 rounded-full mb-4`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-200 h-8 w-full rounded-md mb-2`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-200 h-8 w-2/3 rounded-md mb-6`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-200 w-full h-60 rounded-2xl mb-8`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded mb-3`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded mb-3`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-4 w-3/4 rounded mb-3`, { opacity: pulseAnim }]} />
            </View>
        </ScrollView>
    );
};

// --- KOMPONEN CONTENT RENDERER (DENGAN LOGIKA BLOCK & STRING) ---
const ContentRenderer = ({ content, width }) => {
    if (!content) return null;

    // 1. Jika konten berupa HTML String biasa
    if (typeof content === 'string') {
        return (
            <RenderHTML
                contentWidth={width}
                source={{ html: content }}
                tagsStyles={{
                    p: tw`text-gray-700 text-[16px] leading-7 mb-5 text-justify`, // mb-5 memberikan jarak satu enter antar paragraf
                    ul: tw`mb-5`,
                    li: tw`text-gray-700 text-[16px] mb-2`,
                    strong: tw`font-bold text-gray-900`, // Styling agar tag <strong> terlihat tebal
                }}
            />
        );
    }

    // 2. Jika konten berupa Array (Tipe Block/CMS)
    if (Array.isArray(content)) {
        return (
            <View style={tw`mt-2`}>
                {content.map((block, index) => {
                    switch (block.type) {
                        case 'paragraph':
                            const htmlContent = typeof block.data.content === 'string' 
                                ? block.data.content 
                                : block.data.content?.value;

                            if (!htmlContent) return null;

                            return (
                                <View key={index} style={tw`mb-4`}>
                                    <RenderHTML
                                        contentWidth={width}
                                        source={{ html: htmlContent }}
                                        tagsStyles={{
                                            p: tw`text-gray-700 text-[16px] leading-7 text-justify mb-5`, // Menambahkan mb-5 untuk memberikan spasi satu enter antar paragraf
                                            strong: tw`font-bold text-gray-900`, // Memastikan tag <strong> ter-render dengan gaya tebal
                                        }}
                                    />
                                </View>
                            );
                        case 'image_banner':
                            // Pengaman: Jika URL gambar null atau tidak ada, lewati proses render
                            if (!block.data.url) return null;

                            return (
                                <View key={index} style={tw`my-6`}>
                                    <Image 
                                        source={block.data.url} 
                                        style={[tw`w-full rounded-2xl`, { aspectRatio: 16 / 9 }]} 
                                        contentFit="cover"
                                        transition={500}
                                    />
                                    {block.data.caption && (
                                        <Text style={tw`text-center text-xs italic text-gray-500 mt-2`}>
                                            {block.data.caption}
                                        </Text>
                                    )}
                                </View>
                            );
                        default:
                            return null;
                    }
                })}
            </View>
        );
    }
    return null;
};

export default function AnnouncementDetail() {
    const { slug } = useLocalSearchParams();
    const { width } = useWindowDimensions();
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState('');

    // MENGGUNAKAN HOOK CACHING
    const { data, loading, error } = useCachedData(`/announcements/${slug}`);

    // FUNGSI SEARCH: Diarahkan kembali ke index dengan parameter keyword
    const handleSearch = () => {
        if (searchKeyword.trim() !== '') {
            router.push({
                pathname: '/notifications',
                params: { search: searchKeyword }
            });
        }
    };

    // Tampilkan skeleton jika sedang loading pertama kali dan belum ada data cache
    if (loading && !data) return <DetailSkeleton />;

    // Jika terjadi error dan benar-benar tidak ada data (baik cache maupun API)
    if (error && !data) {
        return (
            <View style={tw`flex-1 justify-center items-center p-10`}>
                <Ionicons name="cloud-offline-outline" size={50} color="#d1d5db" />
                <Text style={tw`text-gray-500 mt-4 text-center`}>Gagal memuat detail pengumuman. Periksa koneksi Anda.</Text>
                <TouchableOpacity onPress={() => router.back()} style={tw`mt-6 bg-green-600 px-6 py-2 rounded-full`}>
                    <Text style={tw`text-white font-bold`}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!data) return null;

    const { announcement, otherAnnouncements } = data;

    return (
        <ScrollView style={tw`flex-1 bg-gray-50`} showsVerticalScrollIndicator={false}>
            <Stack.Screen 
                options={{ 
                    title: 'Detail Pengumuman',
                    headerTitleStyle: tw`font-bold text-gray-800`,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f9fafb' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
                            <Ionicons name="arrow-back" size={24} color="#374151" />
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* Banner Indikator Offline */}
            {error && data && (
                <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
                    <Ionicons name="alert-circle" size={14} color="#92400e" />
                    <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>
                        Mode Offline: Menampilkan versi yang disimpan sebelumnya.
                    </Text>
                </View>
            )}

            <View style={tw`p-5 pt-2`}>
                {/* META */}
                <View style={tw`flex-row items-center mb-4`}>
                    <View style={tw`bg-green-100 px-3 py-1 rounded-xl mr-3`}>
                        <Text style={tw`text-green-700 text-[10px] font-bold uppercase`}>PENGUMUMAN</Text>
                    </View>
                    <Text style={tw`text-gray-400 text-xs font-medium`}>{announcement?.date}</Text>
                </View>

                {/* JUDUL */}
                <Text style={tw`text-2xl font-bold text-gray-900 leading-tight mb-6`}>
                    {announcement?.title}
                </Text>

                {/* GAMBAR UTAMA */}
                {announcement?.image_url && (
                    <View style={tw`mb-8 rounded-2xl overflow-hidden border border-gray-100`}>
                        <Image 
                            source={announcement.image_url} 
                            style={[tw`w-full`, { height: 240 }]} 
                            contentFit="cover"
                            transition={500}
                        />
                    </View>
                )}

                {/* BODY KONTEN */}
                <ContentRenderer content={announcement?.content} width={width - 40} />

                {/* --- LAINNYA --- */}
                {otherAnnouncements?.length > 0 && (
                    <View style={tw`mt-2 bg-white p-5 rounded-2xl border border-gray-100 mb-6 shadow-sm`}>
                        <View style={tw`border-l-4 border-green-500 pl-3 mb-6`}>
                            <Text style={tw`font-bold text-base text-gray-800`}>Pengumuman Lainnya</Text>
                        </View>
                        
                        {otherAnnouncements.map((item) => (
                            <Link key={item.id} href={`/notifications/${item.slug}`} replace asChild>
                                <TouchableOpacity style={tw`mb-6`}>
                                    <Text style={tw`text-[10px] text-gray-400 font-medium mb-1`}>{item.date}</Text>
                                    <Text style={tw`text-sm font-bold text-gray-800 leading-5`}>{item.title}</Text>
                                </TouchableOpacity>
                            </Link>
                        ))}

                        <TouchableOpacity 
                            onPress={() => router.push('/notifications')}
                            style={tw`mt-2 w-full py-3 border border-gray-300 rounded-xl items-center bg-white shadow-sm`}
                        >
                            <Text style={tw`text-gray-600 font-bold text-xs tracking-widest`}>LIHAT SEMUA</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}