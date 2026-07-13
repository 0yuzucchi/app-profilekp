

// // app/services/index.jsx (misalnya)
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   Pressable, 
//   TextInput, 
//   Animated, 
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   useWindowDimensions,
//   StyleSheet
// } from 'react-native';
// import { Stack } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import RenderHTML from 'react-native-render-html';
// import { Image } from 'expo-image';
// import FloatingAIButton from '../../components/FloatingAIButton';
// import tw from 'twrnc';

// import { useCachedData } from '../../hooks/useCachedData';

// const DUMMY_IMAGE = "https://via.placeholder.com/400x250.png/cccccc/969696?text=Image+Not+Found";

// // --- Helper & Styles (Tidak ada perubahan) ---
// const stripHtml = (html) => {
//     if (!html) return '';
//     return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
// };

// const htmlTagsStyles = {
//     p: tw`text-gray-600 text-base mb-4 leading-6`,
//     h1: tw`text-green-800 text-2xl font-bold mb-3`,
//     h2: tw`text-green-800 text-xl font-bold mb-2`,
//     ul: tw`mb-4 ml-2`,
//     li: tw`text-gray-600 text-base mb-2`,
//     strong: tw`text-gray-800 font-bold`,
// };

// // --- KOMPONEN SKELETON (Tidak ada perubahan) ---
// const ServiceSkeleton = () => {
//     // ... (kode skeleton tetap sama)
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
//         <View style={tw`mb-6 px-4`}>
//             <View style={tw`bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm`}>
//                 <Animated.View style={[tw`bg-gray-200 w-full`, { aspectRatio: 486 / 333, opacity: pulseAnim }]} />
//                 <View style={tw`p-5 pb-6`}>
//                     <Animated.View style={[tw`bg-gray-200 h-6 w-3/4 rounded-md mb-3`, { opacity: pulseAnim }]} />
//                     <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded-md mb-2`, { opacity: pulseAnim }]} />
//                     <Animated.View style={[tw`bg-gray-100 h-4 w-1/2 rounded-md`, { opacity: pulseAnim }]} />
//                 </View>
//             </View>
//         </View>
//     );
// };

// // --- KOMPONEN SERVICE CARD (Tidak ada perubahan) ---
// const ServiceCard = ({ service, onOpen }) => {
//     // ... (kode card tetap sama)
//     const isFeatured = service.is_featured === 1 || service.is_featured === true;
//     const description = service.excerpt || stripHtml(service.content);

//     return (
//         <Pressable onPress={() => onOpen(service)}>
//             {({ pressed }) => (
//                 <Animated.View 
//                     style={[
//                         tw`mb-6 px-4`,
//                         {
//                             transform: [{ scale: pressed ? 0.98 : 1 }],
//                             opacity: pressed ? 0.9 : 1
//                         }
//                     ]}
//                 >
//                     <View style={[
//                         tw`bg-white rounded-[30px] overflow-hidden border border-gray-100`,
//                         { elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 }
//                     ]}>
//                         <View style={[tw`relative w-full`, { aspectRatio: 486 / 333 }]}>
//                             <Image 
//                                 source={service.image_path || service.image_url || DUMMY_IMAGE} 
//                                 style={tw`w-full h-full bg-gray-100`}
//                                 contentFit="cover"
//                                 transition={500}
//                             />
//                             {isFeatured && (
//                                 <View style={tw`absolute top-5 right-0 bg-green-600 py-1.5 px-4 rounded-l-full shadow-md`}>
//                                     <Text style={tw`text-white text-[10px] font-bold text-center leading-[12px]`}>
//                                         LAYANAN{"\n"}UNGGULAN
//                                     </Text>
//                                 </View>
//                             )}
//                         </View>

//                         <View style={tw`p-5 pb-6`}>
//                             <Text style={tw`text-green-800 font-bold text-lg mb-2`} numberOfLines={2}>
//                                 {service.title}
//                             </Text>
//                             <Text style={tw`text-gray-500 text-sm leading-relaxed mb-4`} numberOfLines={3}>
//                                 {description}
//                             </Text>
//                             <View style={tw`flex-row items-center`}>
//                                 <Text style={tw`text-green-600 font-bold text-xs mr-1`}>Baca Selengkapnya</Text>
//                                 <Ionicons name="add-circle-outline" size={16} color="#16a34a" />
//                             </View>
//                         </View>
//                     </View>
//                 </Animated.View>
//             )}
//         </Pressable>
//     );
// };

// // --- BARU: Komponen Header Animasi (didefinisikan di luar) ---
// const AnimatedHeaderTitle = ({ searchAnim, searchInputRef, searchQuery, setSearchQuery }) => {
//     const titleOpacity = searchAnim.interpolate({
//         inputRange: [0, 0.5],
//         outputRange: [1, 0],
//         extrapolate: 'clamp',
//     });

//     const searchOpacity = searchAnim.interpolate({
//         inputRange: [0.5, 1],
//         outputRange: [0, 1],
//         extrapolate: 'clamp',
//     });
    
//     const searchWidth = searchAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0%', '100%'],
//     });

//     return (
//         <View style={tw`flex-1 h-10 justify-center`}>
//             <Animated.Text 
//                 style={[tw`font-bold text-gray-800 text-xl`, styles.headerTitle, { opacity: titleOpacity }]}
//                 numberOfLines={1}
//             >
//                 Layanan Klinik
//             </Animated.Text>

//             <Animated.View style={[tw`absolute right-0 flex-row items-center bg-gray-100 rounded-full h-full`, { width: searchWidth, opacity: searchOpacity }]}>
//                 <Ionicons name="search" size={20} color="#9ca3af" style={tw`pl-3 pr-2`} />
//                 <TextInput
//                     ref={searchInputRef}
//                     style={tw`flex-1 h-full text-gray-700 font-medium`}
//                     placeholder="Cari layanan..."
//                     placeholderTextColor="#9ca3af"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//             </Animated.View>
//         </View>
//     );
// };

// // --- KOMPONEN UTAMA (Dengan Perubahan) ---
// const ServicesList = () => {
//     const { width } = useWindowDimensions();
//     const [selectedService, setSelectedService] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isSearchVisible, setIsSearchVisible] = useState(false);
    
//     // --- BARU: Refs untuk animasi dan input ---
//     const searchInputRef = useRef(null);
//     const searchAnim = useRef(new Animated.Value(0)).current;

//     const { data: services, loading, error } = useCachedData('/services');

//     const filteredServices = useMemo(() => {
//         if (!services) return [];
//         const dataArray = Array.isArray(services) ? services : (services.data || []);
        
//         if (!searchQuery) return dataArray;
//         return dataArray.filter(s => 
//             s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
//             stripHtml(s.content).toLowerCase().includes(searchQuery.toLowerCase())
//         );
//     }, [services, searchQuery]);

//     // --- BARU: Effect untuk animasi search bar ---
//     useEffect(() => {
//         Animated.timing(searchAnim, {
//             toValue: isSearchVisible ? 1 : 0,
//             duration: 350,
//             useNativeDriver: false,
//         }).start(() => {
//             if (isSearchVisible) {
//                 searchInputRef.current?.focus();
//             } else {
//                 searchInputRef.current?.blur();
//             }
//         });
//     }, [isSearchVisible]);

//     return (
//         <View style={tw`flex-1 bg-gray-50`}>
//             <Stack.Screen 
//                 options={{ 
//                     // --- PERUBAHAN PADA HEADER ---
//                     headerTitleAlign: 'left',
//                     headerShadowVisible: false,
//                     headerStyle: { backgroundColor: '#f9fafb' },
//                     headerTitle: () => (
//                         <AnimatedHeaderTitle 
//                             searchAnim={searchAnim}
//                             searchInputRef={searchInputRef}
//                             searchQuery={searchQuery}
//                             setSearchQuery={setSearchQuery}
//                         />
//                     ),
//                     headerRight: () => (
//                         <TouchableOpacity 
//                             onPress={() => {
//                                 setIsSearchVisible(!isSearchVisible);
//                                 if (isSearchVisible) setSearchQuery('');
//                             }}
//                             style={tw`mr-2 p-2`}
//                         >
//                             <Animated.View
//                                 style={{
//                                     transform: [{
//                                         rotate: searchAnim.interpolate({
//                                             inputRange: [0, 1],
//                                             outputRange: ['0deg', '90deg'],
//                                         }),
//                                     }],
//                                 }}
//                             >
//                                 <Ionicons name={isSearchVisible ? "close" : "search"} size={22} color="#374151" />
//                             </Animated.View>
//                         </TouchableOpacity>
//                     )
//                 }} 
//             />

//             {error && services && (
//                 <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
//                     <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
//                     <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>
//                         Menampilkan data terakhir (Mode Offline)
//                     </Text>
//                 </View>
//             )}

//             {/* --- DIHAPUS: Search bar lama sudah tidak diperlukan --- */}

//             {loading && !services ? (
//                 <FlatList
//                     data={[1, 2, 3]}
//                     renderItem={() => <ServiceSkeleton />}
//                     keyExtractor={(item) => item.toString()}
//                     // --- PERUBAHAN PADDING ---
//                     contentContainerStyle={tw`pt-4 pb-6`} 
//                 />
//             ) : (
//                 <FlatList
//                     data={filteredServices}
//                     renderItem={({ item }) => <ServiceCard service={item} onOpen={setSelectedService} />}
//                     keyExtractor={(item) => item.id.toString()}
//                     // --- PERUBAHAN PADDING ---
//                     contentContainerStyle={tw`pt-4 pb-6`}
//                     showsVerticalScrollIndicator={false}
//                     ListEmptyComponent={() => (
//                         <View style={tw`flex-1 items-center justify-center mt-20`}>
//                             {error && !services ? (
//                                 <>
//                                     <Ionicons name="wifi-outline" size={40} color="#d1d5db" />
//                                     <Text style={tw`text-gray-400 mt-2 text-center px-10`}>
//                                         Gagal memuat data. Pastikan internet aktif untuk memuat data pertama kali.
//                                     </Text>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Ionicons name="search-outline" size={40} color="#d1d5db" />
//                                     <Text style={tw`text-gray-400 mt-2`}>Tidak ada hasil ditemukan.</Text>
//                                 </>
//                             )}
//                         </View>
//                     )}
//                 />
//             )}

//             {/* --- MODAL POPUP (Tidak ada perubahan) --- */}
//             <Modal
//                 visible={!!selectedService}
//                 animationType="fade"
//                 transparent={true}
//                 onRequestClose={() => setSelectedService(null)}
//             >
//                 {/* ... (kode modal tetap sama) ... */}
//                 <View style={tw`flex-1 bg-black/60 justify-center items-center p-5`}>
//                     <Pressable style={tw`absolute inset-0`} onPress={() => setSelectedService(null)} />
                    
//                     <View style={[
//                         tw`bg-white w-full max-h-[85%] rounded-[35px] overflow-hidden shadow-2xl`,
//                         { maxWidth: 500 }
//                     ]}>
//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {selectedService && (
//                                 <>
//                                     <Image 
//                                         source={selectedService.image_path || selectedService.image_url || DUMMY_IMAGE} 
//                                         style={[tw`w-full`, { aspectRatio: 486 / 333 }]}
//                                         contentFit="cover"
//                                         transition={300}
//                                     />
                                    
//                                     <View style={tw`p-6 pt-8`}>
//                                         <Text style={tw`text-2xl text-green-700 font-extrabold mb-4 border-b border-gray-100 pb-3`}>
//                                             {selectedService.title}
//                                         </Text>

//                                         <RenderHTML
//                                             contentWidth={width - 80}
//                                             source={{ html: selectedService.content }}
//                                             tagsStyles={htmlTagsStyles}
//                                         />
                                        
//                                         <View style={tw`h-6`} />
                                        
//                                         <TouchableOpacity 
//                                             onPress={() => setSelectedService(null)}
//                                             style={tw`bg-green-600 py-4 rounded-2xl items-center shadow-md`}
//                                         >
//                                             <Text style={tw`text-white font-bold text-base`}>Tutup Detail</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </>
//                             )}
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>
            
//             <FloatingAIButton /> 
//         </View>
//     );
// };

// // --- BARU: Stylesheet untuk header ---
// const styles = StyleSheet.create({
//     headerTitle: {
//         position: 'absolute',
//         left: 0,
//     }
// });

// export default ServicesList;



import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Pressable, 
  TextInput, 
  Animated, 
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  TouchableWithoutFeedback // BARU: Untuk menutup modal tanpa feedback kotak
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import { Image } from 'expo-image';
import FloatingAIButton from '../../components/FloatingAIButton';
import tw from 'twrnc';

import { useCachedData } from '../../hooks/useCachedData';

const DUMMY_IMAGE = "https://via.placeholder.com/400x250.png/cccccc/969696?text=Image+Not+Found";

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
};

const htmlTagsStyles = {
    p: tw`text-gray-600 text-base mb-4 leading-6`,
    h1: tw`text-green-800 text-2xl font-bold mb-3`,
    h2: tw`text-green-800 text-xl font-bold mb-2`,
    ul: tw`mb-4 ml-2`,
    li: tw`text-gray-600 text-base mb-2`,
    strong: tw`text-gray-800 font-bold`,
};

// --- KOMPONEN SKELETON ---
const ServiceSkeleton = () => {
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
        <View style={tw`mb-6 px-4`}>
            <View style={tw`bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm`}>
                <Animated.View style={[tw`bg-gray-200 w-full`, { aspectRatio: 486 / 333, opacity: pulseAnim }]} />
                <View style={tw`p-5 pb-6`}>
                    <Animated.View style={[tw`bg-gray-200 h-6 w-3/4 rounded-md mb-3`, { opacity: pulseAnim }]} />
                    <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded-md mb-2`, { opacity: pulseAnim }]} />
                    <Animated.View style={[tw`bg-gray-100 h-4 w-1/2 rounded-md`, { opacity: pulseAnim }]} />
                </View>
            </View>
        </View>
    );
};

// --- KOMPONEN SERVICE CARD ---
const ServiceCard = ({ service, onOpen }) => {
    const isFeatured = service.is_featured === 1 || service.is_featured === true;
    const description = service.excerpt || stripHtml(service.content);

    return (
        <Pressable 
            onPress={() => onOpen(service)}
            // Memindahkan margin & rounded ke Pressable agar area klik terkunci rapi sesuai bentuk kartu
            style={({ pressed }) => [
                tw`mb-6 mx-4 rounded-[30px] overflow-hidden bg-white`,
                {
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1
                }
            ]}
        >
            <View style={tw`border border-gray-100 rounded-[30px] overflow-hidden`}>
                <View style={[tw`relative w-full`, { aspectRatio: 486 / 333 }]}>
                    <Image 
                        source={service.image_path || service.image_url || DUMMY_IMAGE} 
                        style={tw`w-full h-full bg-gray-100`}
                        contentFit="cover"
                        transition={500}
                    />
                    {isFeatured && (
                        <View style={tw`absolute top-5 right-0 bg-green-600 py-1.5 px-4 rounded-l-full shadow-md`}>
                            <Text style={tw`text-white text-[10px] font-bold text-center leading-[12px]`}>
                                LAYANAN{"\n"}UNGGULAN
                            </Text>
                        </View>
                    )}
                </View>

                <View style={tw`p-5 pb-6`}>
                    <Text style={tw`text-green-800 font-bold text-lg mb-2`} numberOfLines={2}>
                        {service.title}
                    </Text>
                    <Text style={tw`text-gray-500 text-sm leading-relaxed mb-4`} numberOfLines={3}>
                        {description}
                    </Text>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-green-600 font-bold text-xs mr-1`}>Klik Untuk Selengkapnya</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

// --- Komponen Header Animasi ---
const AnimatedHeaderTitle = ({ searchAnim, searchInputRef, searchQuery, setSearchQuery }) => {
    const titleOpacity = searchAnim.interpolate({
        inputRange: [0, 0.5],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const searchOpacity = searchAnim.interpolate({
        inputRange: [0.5, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    
    const searchWidth = searchAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={tw`flex-1 h-10 justify-center`}>
            <Animated.Text 
                style={[tw`font-bold text-gray-800 text-xl`, styles.headerTitle, { opacity: titleOpacity }]}
                numberOfLines={1}
            >
                Layanan Klinik
            </Animated.Text>

            <Animated.View style={[tw`absolute right-0 flex-row items-center bg-gray-100 rounded-full h-full`, { width: searchWidth, opacity: searchOpacity }]}>
                <Ionicons name="search" size={20} color="#9ca3af" style={tw`pl-3 pr-2`} />
                <TextInput
                    ref={searchInputRef}
                    style={tw`flex-1 h-full text-gray-700 font-medium`}
                    placeholder="Cari layanan..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </Animated.View>
        </View>
    );
};

// --- KOMPONEN UTAMA ---
const ServicesList = () => {
    const { width } = useWindowDimensions();
    
    // --- STATE ANIMASI MODAL KUSTOM ---
    const [activeService, setActiveService] = useState(null); 
    const [modalVisible, setModalVisible] = useState(false);
    const modalAnim = useRef(new Animated.Value(0)).current;

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const searchInputRef = useRef(null);
    const searchAnim = useRef(new Animated.Value(0)).current;

    const { data: services, loading, error } = useCachedData('/services');

    const filteredServices = useMemo(() => {
        if (!services) return [];
        const dataArray = Array.isArray(services) ? services : (services.data || []);
        
        if (!searchQuery) return dataArray;
        return dataArray.filter(s => 
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            stripHtml(s.content).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [services, searchQuery]);

    // Fungsi membuka modal dengan animasi spring yang halus
    const openModal = (service) => {
        setActiveService(service);
        setModalVisible(true);
        Animated.spring(modalAnim, {
            toValue: 1,
            tension: 65,
            friction: 10,
            useNativeDriver: true,
        }).start();
    };

    // Fungsi menutup modal dengan transisi ke bawah sebelum mereset data
    const closeModal = () => {
        Animated.timing(modalAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setActiveService(null);
        });
    };

    // Efek transisi search bar header
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

    // Interpolasi animasi modal
    const backdropOpacity = modalAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.6],
    });

    const modalScale = modalAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.92, 1],
    });

    const modalTranslateY = modalAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [60, 0],
    });

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Stack.Screen 
                options={{ 
                    headerTitleAlign: 'left',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f9fafb' },
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
                                    transform: [{
                                        rotate: searchAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '90deg'],
                                        }),
                                    }],
                                }}
                            >
                                <Ionicons name={isSearchVisible ? "close" : "search"} size={22} color="#374151" />
                            </Animated.View>
                        </TouchableOpacity>
                    )
                }} 
            />

            {error && services && (
                <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
                    <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
                    <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>
                        Menampilkan data terakhir (Mode Offline)
                    </Text>
                </View>
            )}

            {loading && !services ? (
                <FlatList
                    data={[1, 2, 3]}
                    renderItem={() => <ServiceSkeleton />}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={tw`pt-4 pb-6`} 
                />
            ) : (
                <FlatList
                    data={filteredServices}
                    renderItem={({ item }) => <ServiceCard service={item} onOpen={openModal} />}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={tw`pt-4 pb-6`}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={tw`flex-1 items-center justify-center mt-20`}>
                            {error && !services ? (
                                <>
                                    <Ionicons name="wifi-outline" size={40} color="#d1d5db" />
                                    <Text style={tw`text-gray-400 mt-2 text-center px-10`}>
                                        Gagal memuat data. Pastikan internet aktif untuk memuat data pertama kali.
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="search-outline" size={40} color="#d1d5db" />
                                    <Text style={tw`text-gray-400 mt-2`}>Tidak ada hasil ditemukan.</Text>
                                </>
                            )}
                        </View>
                    )}
                />
            )}

            {/* --- MODAL POPUP (DENGAN ANIMASI HALUS KUSTOM) --- */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="none" // Kita kontrol transisi manual agar tidak kaku
                onRequestClose={closeModal}
            >
                <View style={tw`flex-1 justify-center items-center p-5`}>
                    
                    {/* Background Gelap Transparan Animasi */}
                    <Animated.View 
                        style={[
                            StyleSheet.absoluteFill, 
                            { 
                                backgroundColor: 'black', 
                                opacity: backdropOpacity 
                            }
                        ]} 
                    />

                    {/* Latar Belakang Interaktif Tanpa Efek Kotak */}
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={StyleSheet.absoluteFill} />
                    </TouchableWithoutFeedback>
                    
                    {/* Kontainer Utama Modal */}
                    <Animated.View style={[
                        tw`bg-white w-full max-h-[85%] rounded-[35px] overflow-hidden shadow-2xl`,
                        { 
                            maxWidth: 500,
                            transform: [
                                { scale: modalScale },
                                { translateY: modalTranslateY }
                            ],
                            opacity: modalAnim
                        }
                    ]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {activeService && (
                                <>
                                    <Image 
                                        source={activeService.image_path || activeService.image_url || DUMMY_IMAGE} 
                                        style={[tw`w-full`, { aspectRatio: 486 / 333 }]}
                                        contentFit="cover"
                                        transition={300}
                                    />
                                    
                                    <View style={tw`p-6 pt-8`}>
                                        <Text style={tw`text-2xl text-green-700 font-extrabold mb-4 border-b border-gray-100 pb-3`}>
                                            {activeService.title}
                                        </Text>

                                        <RenderHTML
                                            contentWidth={width - 80}
                                            source={{ html: activeService.content }}
                                            tagsStyles={htmlTagsStyles}
                                        />
                                        
                                        <View style={tw`h-6`} />
                                        
                                        <TouchableOpacity 
                                            onPress={closeModal}
                                            activeOpacity={0.8}
                                            style={tw`bg-green-600 py-4 rounded-2xl items-center shadow-md`}
                                        >
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

const styles = StyleSheet.create({
    headerTitle: {
        position: 'absolute',
        left: 0,
    }
});

export default ServicesList;