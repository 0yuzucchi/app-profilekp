

// // app/facilities/index.jsx
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { 
//     View, 
//     Text, 
//     FlatList, 
//     TouchableOpacity, 
//     TextInput, 
//     Animated 
// } from 'react-native';
// import { Stack } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Image } from 'expo-image'; // Menggunakan expo-image
// import FloatingAIButton from '../../components/FloatingAIButton';
// import tw from 'twrnc';

// // Import hook caching
// import { useCachedData } from '../../hooks/useCachedData';

// const DUMMY_IMAGE = "https://via.placeholder.com/800x400.png/cccccc/969696?text=Fasilitas+Klinik";

// // --- KOMPONEN SKELETON ---
// const FacilitySkeleton = () => {
//     const pulseAnim = useRef(new Animated.Value(0.5)).current;

//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
//                 Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
//             ])
//         ).start();
//     }, []);

//     return (
//         <View style={tw`mb-8 px-4`}>
//             <View style={tw`bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm`}>
//                 <View style={tw`w-full h-52 bg-gray-200 relative`}>
//                     <Animated.View style={[tw`w-full h-full bg-gray-200`, { opacity: pulseAnim }]} />
//                     <Animated.View style={[tw`absolute top-4 left-4 bg-gray-100 px-4 py-1.5 rounded-full w-28 h-6`, { opacity: pulseAnim }]} />
//                 </View>
//                 <View style={tw`p-6`}>
//                     <Animated.View style={[tw`bg-gray-200 h-7 w-3/4 rounded-md mb-6`, { opacity: pulseAnim }]} />
//                     <Animated.View style={[tw`bg-gray-100 h-3 w-32 rounded mb-4`, { opacity: pulseAnim }]} />
//                     <View style={tw`flex-row flex-wrap`}>
//                         {[1, 2, 3].map((i) => (
//                             <Animated.View key={i} style={[tw`bg-gray-100 rounded-full w-24 h-7 mr-2 mb-2`, { opacity: pulseAnim }]} />
//                         ))}
//                     </View>
//                 </View>
//             </View>
//         </View>
//     );
// };

// // --- HELPER & CARD ---
// const extractAmenities = (content) => {
//     if (!content) return [];
//     try {
//         let parsed = typeof content === 'string' ? JSON.parse(content) : content;
//         if (Array.isArray(parsed)) {
//             return parsed.map(item => (typeof item === 'object' ? item.item : item)).filter(Boolean);
//         }
//     } catch (e) { return []; }
//     return [];
// };

// const FacilityCard = ({ item }) => {
//     const amenities = extractAmenities(item.content);
//     const isCare = item.category === 'Fasilitas Perawatan';

//     return (
//         <View style={tw`mb-8 px-4`}>
//             <View style={[
//                 tw`bg-white rounded-[30px] overflow-hidden border border-gray-100`,
//                 { elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }
//             ]}>
//                 <View style={tw`w-full h-52 bg-gray-100 relative`}>
//                     <Image 
//                         source={item.image_url || DUMMY_IMAGE} 
//                         style={tw`w-full h-full`} 
//                         contentFit="cover"
//                         transition={500}
//                     />
//                     <View style={tw`absolute top-4 left-4 bg-white/95 px-4 py-1.5 rounded-full shadow-sm`}>
//                         <Text style={tw`font-bold text-[10px] uppercase ${isCare ? 'text-green-700' : 'text-blue-700'}`}>
//                             {item.category}
//                         </Text>
//                     </View>
//                 </View>

//                 <View style={tw`p-6`}>
//                     <Text style={tw`text-gray-900 text-xl font-extrabold mb-4 tracking-tight leading-7`}>
//                         {item.title}
//                     </Text>
//                     <Text style={tw`text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-3`}>
//                         Fasilitas Tersedia
//                     </Text>
//                     <View style={tw`flex-row flex-wrap`}>
//                         {amenities.length > 0 ? (
//                             amenities.map((amenity, index) => (
//                                 <View key={index} style={tw`flex-row items-center bg-green-50 border border-green-100 rounded-full pl-1 pr-3 py-1 mr-2 mb-2`}>
//                                     <View style={tw`bg-green-600 rounded-full w-4 h-4 items-center justify-center mr-2`}>
//                                         <Ionicons name="checkmark" size={10} color="white" />
//                                     </View>
//                                     <Text style={tw`text-green-800 text-[11px] font-bold`}>{amenity}</Text>
//                                 </View>
//                             ))
//                         ) : (
//                             <Text style={tw`text-gray-400 italic text-xs`}>Informasi detail belum tersedia.</Text>
//                         )}
//                     </View>
//                 </View>
//             </View>
//         </View>
//     );
// };

// const FacilitiesPage = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isSearchVisible, setIsSearchVisible] = useState(false);

//     // MENGGUNAKAN HOOK CACHING (Dua rute berbeda)
//     const { data: careData, loading: loadCare, error: errCare } = useCachedData('/facilities/perawatan');
//     const { data: supportData, loading: loadSupport, error: errSupport } = useCachedData('/facilities/penunjang');

//     // Gabungkan data
//     const facilities = useMemo(() => {
//         const care = careData || [];
//         const support = supportData || [];
//         return [...care, ...support];
//     }, [careData, supportData]);

//     const loading = loadCare && loadSupport && facilities.length === 0;
//     const isOffline = errCare || errSupport;

//     const filteredData = useMemo(() => {
//         if (!searchQuery) return facilities;
//         const query = searchQuery.toLowerCase();
//         return facilities.filter(f => 
//             f.title.toLowerCase().includes(query) || 
//             f.category.toLowerCase().includes(query)
//         );
//     }, [facilities, searchQuery]);

//     return (
//         <View style={tw`flex-1 bg-gray-50`}>
//             <Stack.Screen 
//                 options={{ 
//                     title: "Fasilitas Klinik",
//                     headerTitleStyle: tw`font-bold text-gray-800`,
//                     headerShadowVisible: false,
//                     headerStyle: { backgroundColor: '#f9fafb' },
//                     headerRight: () => (
//                         <TouchableOpacity 
//                             onPress={() => {
//                                 setIsSearchVisible(!isSearchVisible);
//                                 if (isSearchVisible) setSearchQuery('');
//                             }}
//                             style={tw`mr-2 p-2 bg-gray-100 rounded-full`}
//                         >
//                             <Ionicons name={isSearchVisible ? "close" : "search"} size={20} color="#374151" />
//                         </TouchableOpacity>
//                     )
//                 }} 
//             />

//             {/* Banner Mode Offline */}
//             {isOffline && facilities.length > 0 && (
//                 <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
//                     <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
//                     <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>
//                         Menampilkan data offline
//                     </Text>
//                 </View>
//             )}

//             {isSearchVisible && (
//                 <View style={[tw`absolute top-2 left-4 right-4 z-50 bg-white flex-row items-center px-4 rounded-2xl border border-gray-200 h-13 shadow-xl`]}>
//                     <Ionicons name="search" size={20} color="#16a34a" style={tw`mr-2`} />
//                     <TextInput
//                         style={tw`flex-1 h-full text-gray-700 text-base font-medium`}
//                         placeholder="Cari fasilitas..."
//                         placeholderTextColor="#9ca3af"
//                         value={searchQuery}
//                         onChangeText={setSearchQuery}
//                         autoFocus
//                     />
//                 </View>
//             )}

//             {loading ? (
//                 <FlatList
//                     data={[1, 2]}
//                     renderItem={() => <FacilitySkeleton />}
//                     keyExtractor={(item) => item.toString()}
//                     contentContainerStyle={tw`pt-6 pb-10`}
//                 />
//             ) : (
//                 <FlatList
//                     data={filteredData}
//                     keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                     renderItem={({ item }) => <FacilityCard item={item} />}
//                     contentContainerStyle={tw`pt-6 pb-10`}
//                     showsVerticalScrollIndicator={false}
//                     ListEmptyComponent={() => (
//                         <View style={tw`flex-1 items-center justify-center mt-20 px-10`}>
//                             <Ionicons name="business-outline" size={40} color="#d1d5db" />
//                             <Text style={tw`text-gray-400 text-center text-sm mt-2`}>
//                                 Fasilitas tidak ditemukan atau gagal memuat data.
//                             </Text>
//                         </View>
//                     )}
//                 />
//             )}
            
//             <FloatingAIButton /> 
//         </View>
//     );
// };

// export default FacilitiesPage;

// app/facilities/index.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    TextInput, 
    Animated,
    StyleSheet
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import FloatingAIButton from '../../components/FloatingAIButton';
import tw from 'twrnc';

import { useCachedData } from '../../hooks/useCachedData';

const DUMMY_IMAGE = "https://via.placeholder.com/800x400.png/cccccc/969696?text=Fasilitas+Klinik";

// --- KOMPONEN SKELETON (Tidak ada perubahan) ---
const FacilitySkeleton = () => {
    // ... (kode skeleton tetap sama)
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
        <View style={tw`mb-8 px-4`}>
            <View style={tw`bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm`}>
                <View style={tw`w-full h-52 bg-gray-200 relative`}>
                    <Animated.View style={[tw`w-full h-full bg-gray-200`, { opacity: pulseAnim }]} />
                    <Animated.View style={[tw`absolute top-4 left-4 bg-gray-100 px-4 py-1.5 rounded-full w-28 h-6`, { opacity: pulseAnim }]} />
                </View>
                <View style={tw`p-6`}>
                    <Animated.View style={[tw`bg-gray-200 h-7 w-3/4 rounded-md mb-6`, { opacity: pulseAnim }]} />
                    <Animated.View style={[tw`bg-gray-100 h-3 w-32 rounded mb-4`, { opacity: pulseAnim }]} />
                    <View style={tw`flex-row flex-wrap`}>
                        {[1, 2, 3].map((i) => (
                            <Animated.View key={i} style={[tw`bg-gray-100 rounded-full w-24 h-7 mr-2 mb-2`, { opacity: pulseAnim }]} />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

// --- HELPER & CARD (Tidak ada perubahan) ---
const extractAmenities = (content) => {
    // ... (kode helper tetap sama)
    if (!content) return [];
    try {
        let parsed = typeof content === 'string' ? JSON.parse(content) : content;
        if (Array.isArray(parsed)) {
            return parsed.map(item => (typeof item === 'object' ? item.item : item)).filter(Boolean);
        }
    } catch (e) { return []; }
    return [];
};

const FacilityCard = ({ item }) => {
    // ... (kode card tetap sama)
    const amenities = extractAmenities(item.content);
    const isCare = item.category === 'Fasilitas Perawatan';

    return (
        <View style={tw`mb-8 px-4`}>
            <View style={[
                tw`bg-white rounded-[30px] overflow-hidden border border-gray-100`,
                { elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }
            ]}>
                <View style={tw`w-full h-52 bg-gray-100 relative`}>
                    <Image 
                        source={item.image_url || DUMMY_IMAGE} 
                        style={tw`w-full h-full`} 
                        contentFit="cover"
                        transition={500}
                    />
                    <View style={tw`absolute top-4 left-4 bg-white/95 px-4 py-1.5 rounded-full shadow-sm`}>
                        <Text style={tw`font-bold text-[10px] uppercase ${isCare ? 'text-green-700' : 'text-blue-700'}`}>
                            {item.category}
                        </Text>
                    </View>
                </View>

                <View style={tw`p-6`}>
                    <Text style={tw`text-gray-900 text-xl font-extrabold mb-4 tracking-tight leading-7`}>
                        {item.title}
                    </Text>
                    <Text style={tw`text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-3`}>
                        Fasilitas Tersedia
                    </Text>
                    <View style={tw`flex-row flex-wrap`}>
                        {amenities.length > 0 ? (
                            amenities.map((amenity, index) => (
                                <View key={index} style={tw`flex-row items-center bg-green-50 border border-green-100 rounded-full pl-1 pr-3 py-1 mr-2 mb-2`}>
                                    <View style={tw`bg-green-600 rounded-full w-4 h-4 items-center justify-center mr-2`}>
                                        <Ionicons name="checkmark" size={10} color="white" />
                                    </View>
                                    <Text style={tw`text-green-800 text-[11px] font-bold`}>{amenity}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={tw`text-gray-400 italic text-xs`}>Informasi detail belum tersedia.</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};


// --- PERUBAHAN KUNCI: Komponen Header dipindah ke luar ---
// Ini mencegahnya dibuat ulang pada setiap render dari parent, sehingga keyboard tidak tertutup.
// --- PERUBAHAN KUNCI: Komponen Header dipindah ke luar ---
// Ini mencegahnya dibuat ulang pada setiap render dari parent, sehingga keyboard tidak tertutup.
const AnimatedHeaderTitle = ({ searchAnim, searchInputRef, searchQuery, setSearchQuery }) => {
    // Opacity untuk judul "Fasilitas Klinik" (menghilang saat search aktif)
    const titleOpacity = searchAnim.interpolate({
        inputRange: [0, 0.5],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    // Opacity untuk search bar (muncul setelah judul menghilang)
    const searchOpacity = searchAnim.interpolate({
        inputRange: [0.5, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    
    // Lebar search bar yang dianimasikan
    const searchWidth = searchAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={tw`flex-1 h-10 justify-center`}>
            {/* Judul Halaman yang dianimasikan */}
            <Animated.Text 
                // --- PERUBAHAN DI SINI: dari text-lg menjadi text-xl ---
                style={[tw`font-bold text-gray-800 text-xl`, styles.headerTitle, { opacity: titleOpacity }]}
                numberOfLines={1}
            >
                Fasilitas Klinik
            </Animated.Text>

            {/* Search Bar yang dianimasikan */}
            <Animated.View style={[tw`absolute right-0 flex-row items-center bg-gray-100 rounded-full h-full`, { width: searchWidth, opacity: searchOpacity }]}>
                <Ionicons name="search" size={20} color="#9ca3af" style={tw`pl-3 pr-2`} />
                <TextInput
                    ref={searchInputRef}
                    style={tw`flex-1 h-full text-gray-700 font-medium`}
                    placeholder="Cari fasilitas..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </Animated.View>
        </View>
    );
};


const FacilitiesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const searchInputRef = useRef(null);
    const searchAnim = useRef(new Animated.Value(0)).current;

    const { data: careData, loading: loadCare, error: errCare } = useCachedData('/facilities/perawatan');
    const { data: supportData, loading: loadSupport, error: errSupport } = useCachedData('/facilities/penunjang');

    const facilities = useMemo(() => {
        const care = careData || [];
        const support = supportData || [];
        return [...care, ...support];
    }, [careData, supportData]);

    const loading = loadCare && loadSupport && facilities.length === 0;
    const isOffline = errCare || errSupport;

    const filteredData = useMemo(() => {
        if (!searchQuery) return facilities;
        const query = searchQuery.toLowerCase();
        return facilities.filter(f => 
            f.title.toLowerCase().includes(query) || 
            f.category.toLowerCase().includes(query)
        );
    }, [facilities, searchQuery]);

    useEffect(() => {
        Animated.timing(searchAnim, {
            toValue: isSearchVisible ? 1 : 0,
            duration: 350,
            useNativeDriver: false,
        }).start(() => {
            if (isSearchVisible) {
                searchInputRef.current?.focus();
            } else {
                searchInputRef.current?.blur();
            }
        });
    }, [isSearchVisible]);

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Stack.Screen 
                options={{ 
                    headerTitleAlign: 'left',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f9fafb' },
                    // --- PERUBAHAN KUNCI: Me-render komponen yang sudah didefinisikan di luar ---
                    headerTitle: () => (
                        <AnimatedHeaderTitle 
                            searchAnim={searchAnim}
                            searchInputRef={searchInputRef}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    ),
                    headerRight: () => (
                        <TouchableOpacity 
                            onPress={() => {
                                setIsSearchVisible(!isSearchVisible);
                                if (isSearchVisible) setSearchQuery('');
                            }}
                            style={tw`mr-2 p-2`}
                        >
                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            rotate: searchAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '90deg'],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <Ionicons name={isSearchVisible ? "close" : "search"} size={22} color="#374151" />
                            </Animated.View>
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* Banner Mode Offline (Tidak ada perubahan) */}
            {isOffline && facilities.length > 0 && (
                <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
                    <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
                    <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>
                        Menampilkan data offline
                    </Text>
                </View>
            )}

            {loading ? (
                <FlatList
                    data={[1, 2]}
                    renderItem={() => <FacilitySkeleton />}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={tw`pt-4 pb-6`}
                />
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={({ item }) => <FacilityCard item={item} />}
                    contentContainerStyle={tw`pt-4 pb-6`}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={tw`flex-1 items-center justify-center mt-20 px-10`}>
                            <Ionicons name="business-outline" size={40} color="#d1d5db" />
                            <Text style={tw`text-gray-400 text-center text-sm mt-2`}>
                                Fasilitas tidak ditemukan atau gagal memuat data.
                            </Text>
                        </View>
                    )}
                />
            )}
            
            <FloatingAIButton /> 
        </View>
    );
};

const styles = StyleSheet.create({
    headerTitle: {
        position: 'absolute',
        left: 0,
        // Kita perlu memastikan judul ini tidak menutupi search bar yang muncul
        // Dengan menempatkan search bar dengan `absolute right-0` di komponennya, masalah ini teratasi
    }
});

export default FacilitiesPage;