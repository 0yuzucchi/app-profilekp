// // app/notifications/index.jsx
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { 
//     View, Text, FlatList, TouchableOpacity, 
//     TextInput, Animated, Pressable, StyleSheet,
//     Keyboard 
// } from 'react-native';
// import { Link, Stack, useLocalSearchParams } from 'expo-router';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { Image } from 'expo-image'; 
// import tw from 'twrnc';

// // Import hook caching
// import { useCachedData } from '../../hooks/useCachedData';

// const formatDate = (dateString) => {
//     if (!dateString) return "";
//     if (dateString.includes('Januari') || dateString.includes('Mei')) return dateString;
//     try {
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return dateString;
//         return new Intl.DateTimeFormat('id-ID', {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric',
//         }).format(date);
//     } catch (e) {
//         return dateString;
//     }
// };

// // --- KOMPONEN SKELETON ---
// const NotificationSkeleton = ({ type }) => {
//     const pulseAnim = useRef(new Animated.Value(0.5)).current;
//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
//                 Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
//             ])
//         ).start();
//     }, []);

//     if (type === 'announcement') {
//         return (
//             <View style={tw`flex-row bg-white rounded-2xl mb-4 overflow-hidden border border-gray-100 mx-4 shadow-sm`}>
//                 <Animated.View style={[tw`w-28 h-28 bg-gray-200`, { opacity: pulseAnim }]} />
//                 <View style={tw`flex-1 p-4 justify-center`}>
//                     <Animated.View style={[tw`bg-gray-100 h-3 w-16 rounded mb-2`, { opacity: pulseAnim }]} />
//                     <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded mb-2`, { opacity: pulseAnim }]} />
//                     <Animated.View style={[tw`bg-gray-200 h-4 w-2/3 rounded`, { opacity: pulseAnim }]} />
//                 </View>
//             </View>
//         );
//     }
//     return (
//         <View style={tw`bg-white rounded-2xl mb-4 border border-gray-100 mx-4 p-4 shadow-sm flex-row`}>
//             <Animated.View style={[tw`w-16 h-16 bg-gray-200 rounded-xl mr-4`, { opacity: pulseAnim }]} />
//             <View style={tw`flex-1`}>
//                 <Animated.View style={[tw`bg-gray-200 h-5 w-3/4 rounded mb-2`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-100 h-3 w-1/2 rounded mb-3`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-100 h-3 w-1/3 rounded`, { opacity: pulseAnim }]} />
//             </View>
//         </View>
//     );
// };

// // --- KOMPONEN HEADER ANIMASI ---
// const AnimatedHeaderTitle = ({ searchAnim, searchInputRef, searchQuery, setSearchQuery, title }) => {
//     const titleOpacity = searchAnim.interpolate({
//         inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp',
//     });
//     const searchOpacity = searchAnim.interpolate({
//         inputRange: [0.5, 1], outputRange: [0, 1], extrapolate: 'clamp',
//     });
//     const searchWidth = searchAnim.interpolate({
//         inputRange: [0, 1], outputRange: ['0%', '100%'],
//     });

//     return (
//         <View style={tw`flex-1 h-10 justify-center`}>
//             <Animated.Text 
//                 style={[tw`font-bold text-gray-800 text-xl`, styles.headerTitle, { opacity: titleOpacity }]}
//                 numberOfLines={1}
//             >
//                 {title}
//             </Animated.Text>
//             <Animated.View style={[tw`absolute right-0 flex-row items-center bg-gray-100 rounded-full h-full`, { width: searchWidth, opacity: searchOpacity }]}>
//                 <Ionicons name="search" size={20} color="#9ca3af" style={tw`pl-3 pr-2`} />
//                 <TextInput
//                     ref={searchInputRef}
//                     style={tw`flex-1 h-full text-gray-700 font-medium`}
//                     placeholder="Cari..."
//                     placeholderTextColor="#9ca3af"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//             </Animated.View>
//         </View>
//     );
// };

// export default function NotificationsIndex() {
//     const params = useLocalSearchParams(); 
//     const [activeTab, setActiveTab] = useState('announcement');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isSearchVisible, setIsSearchVisible] = useState(false);

//     const searchInputRef = useRef(null);
//     const searchAnim = useRef(new Animated.Value(0)).current;

//     const { data: announcements, loading: loadingAnn, error: errAnn } = useCachedData('/announcements');
//     const { data: jobs, loading: loadingJobs, error: errJobs } = useCachedData('/job-vacancies');

//     const loading = activeTab === 'announcement' ? loadingAnn : loadingJobs;
//     const error = activeTab === 'announcement' ? errAnn : errJobs;
//     const currentData = activeTab === 'announcement' ? announcements : jobs;

//     useEffect(() => {
//         if (params.search) {
//             setSearchQuery(params.search);
//             setIsSearchVisible(true);
//             setActiveTab('announcement');
//         }
//     }, [params.search]);

//     useEffect(() => {
//         Animated.timing(searchAnim, {
//             toValue: isSearchVisible ? 1 : 0,
//             duration: 350,
//             useNativeDriver: false,
//         }).start(() => {
//             if (isSearchVisible) {
//                 searchInputRef.current?.focus();
//             } else {
//                 Keyboard.dismiss();
//                 searchInputRef.current?.blur();
//             }
//         });
//     }, [isSearchVisible]);

//     const filteredData = useMemo(() => {
//         if (!currentData) return [];
//         const dataArray = Array.isArray(currentData) ? currentData : (currentData.data || []);

//         if (!searchQuery) return dataArray;
//         return dataArray.filter(item => {
//             const title = activeTab === 'announcement' ? item.title : item.profession;
//             return title?.toLowerCase().includes(searchQuery.toLowerCase());
//         });
//     }, [currentData, searchQuery, activeTab]);

//     // --- CARD COMPONENTS ---
//     const JobCard = ({ item }) => (
//         <Link href={`/notifications/job/${item.id}`} asChild>
//             <Pressable style={tw`bg-white rounded-2xl mb-4 border border-gray-100 mx-4 shadow-sm overflow-hidden`}>
//                 <View style={tw`flex-row p-4`}>
//                     <View style={tw`w-16 h-16 bg-green-50 rounded-xl items-center justify-center mr-4`}>
//                         <MaterialCommunityIcons name="briefcase-variant" size={30} color="#16a34a" />
//                     </View>
//                     <View style={tw`flex-1`}>
//                         <View style={tw`flex-row justify-between items-start`}>
//                             <Text style={tw`text-gray-800 font-bold text-base flex-1 mr-2`}>{item.profession}</Text>
//                             <View style={tw`px-2 py-0.5 rounded-md ${item.status ? 'bg-green-100' : 'bg-red-100'}`}>
//                                 <Text style={tw`text-[9px] font-bold ${item.status ? 'text-green-700' : 'text-red-700'}`}>
//                                     {item.status ? 'OPEN' : 'CLOSED'}
//                                 </Text>
//                             </View>
//                         </View>
//                         <Text style={tw`text-gray-500 text-xs mt-1`}>{item.location || 'Semarang, Jawa Tengah'}</Text>
//                         <View style={tw`flex-row items-center mt-3`}>
//                             <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
//                             <Text style={tw`text-gray-400 text-[11px] ml-1`}>Batas: {item.open_until_date}</Text>
//                         </View>
//                     </View>
//                 </View>
//             </Pressable>
//         </Link>
//     );

//     const AnnouncementCard = ({ item }) => (
//         <Link href={`/notifications/${item.slug}`} asChild>
//             <Pressable style={tw`flex-row bg-white rounded-2xl mb-4 overflow-hidden border border-gray-100 mx-4 shadow-sm`}>
//                 <Image 
//                     source={item.image_url} 
//                     style={tw`w-28 h-28 bg-gray-100`}
//                     contentFit="cover"
//                     transition={500}
//                 />
//                 <View style={tw`flex-1 p-4 justify-center`}>
//                     <Text style={tw`text-green-600 text-[10px] font-bold uppercase mb-1`}>
//                         {formatDate(item.date || item.published_at)}
//                     </Text>
//                     <Text style={tw`text-gray-800 font-extrabold text-base leading-5`} numberOfLines={2}>
//                         {item.title}
//                     </Text>
//                     <View style={tw`flex-row items-center mt-2`}>
//                         <Text style={tw`text-gray-400 text-[10px] font-bold mr-1`}>Baca Selengkapnya</Text>
//                         <Ionicons name="chevron-forward" size={10} color="#9ca3af" />
//                     </View>
//                 </View>
//             </Pressable>
//         </Link>
//     );

//     return (
//         <View style={tw`flex-1 bg-gray-50`}>
//             <Stack.Screen options={{ 
//                 headerTitleAlign: 'left',
//                 headerShadowVisible: false,
//                 headerStyle: { backgroundColor: '#f9fafb' },
//                 headerTitle: () => (
//                     <AnimatedHeaderTitle 
//                         searchAnim={searchAnim} 
//                         searchInputRef={searchInputRef} 
//                         searchQuery={searchQuery} 
//                         setSearchQuery={setSearchQuery}
//                         title={activeTab === 'announcement' ? "Pengumuman" : "Lowongan Kerja"}
//                     />
//                 ),
//                 headerRight: () => (
//                     <TouchableOpacity onPress={() => {
//                         setIsSearchVisible(!isSearchVisible);
//                         if (isSearchVisible) setSearchQuery('');
//                     }} style={tw`mr-2 p-2`}>
//                         <Animated.View style={{
//                             transform: [{
//                                 rotate: searchAnim.interpolate({
//                                     inputRange: [0, 1], outputRange: ['0deg', '90deg']
//                                 })
//                             }]
//                         }}>
//                             <Ionicons name={isSearchVisible ? "close" : "search"} size={22} color="#374151" />
//                         </Animated.View>
//                     </TouchableOpacity>
//                 )
//             }} />

//             {/* Banner Mode Offline */}
//             {error && currentData && (
//                 <View style={tw`bg-amber-100 py-1.5 items-center`}>
//                     <Text style={tw`text-[10px] text-amber-800 font-medium`}>Mode Offline: Menampilkan data terakhir</Text>
//                 </View>
//             )}

//             {/* TAB SWITCHER */}
//             <View style={tw`flex-row px-4 bg-gray-50 border-b border-gray-200`}>
//                 <TouchableOpacity 
//                     onPress={() => setActiveTab('announcement')}
//                     style={tw`flex-1 py-3 items-center ${activeTab === 'announcement' ? 'border-b-2 border-green-600' : ''}`}
//                 >
//                     <Text style={tw`font-bold text-sm ${activeTab === 'announcement' ? 'text-green-600' : 'text-gray-400'}`}>PENGUMUMAN</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                     onPress={() => setActiveTab('job')}
//                     style={tw`flex-1 py-3 items-center ${activeTab === 'job' ? 'border-b-2 border-green-600' : ''}`}
//                 >
//                     <Text style={tw`font-bold text-sm ${activeTab === 'job' ? 'text-green-600' : 'text-gray-400'}`}>LOWONGAN</Text>
//                 </TouchableOpacity>
//             </View>

//             {loading && !currentData ? (
//                 <FlatList
//                     data={[1, 2, 3]}
//                     keyExtractor={(item) => item.toString()}
//                     contentContainerStyle={tw`pt-4 pb-10`}
//                     renderItem={() => <NotificationSkeleton type={activeTab} />}
//                 />
//             ) : (
//                 <FlatList
//                     data={filteredData}
//                     keyExtractor={(item) => item.id.toString()}
//                     contentContainerStyle={tw`pt-4 pb-10`}
//                     showsVerticalScrollIndicator={false}
//                     renderItem={({ item }) => activeTab === 'announcement' ? <AnnouncementCard item={item} /> : <JobCard item={item} />}
//                     ListEmptyComponent={
//                         <View style={tw`mt-20 items-center px-10`}>
//                             <Ionicons name="search-outline" size={40} color="#d1d5db" />
//                             <Text style={tw`text-gray-400 text-center text-sm mt-2`}>
//                                 Tidak ditemukan.
//                             </Text>
//                         </View>
//                     }
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     headerTitle: { position: 'absolute', left: 0 }
// });
// app/notifications/index.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    View, Text, FlatList, TouchableOpacity, 
    TextInput, Animated, Pressable, StyleSheet,
    Keyboard 
} from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image'; 
import tw from 'twrnc';

// Import hook caching
import { useCachedData } from '../../hooks/useCachedData';

const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes('Januari') || dateString.includes('Mei')) return dateString;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    } catch (e) {
        return dateString;
    }
};

// --- KOMPONEN SKELETON ---
const NotificationSkeleton = ({ type }) => {
    const pulseAnim = useRef(new Animated.Value(0.5)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    if (type === 'announcement') {
        return (
            <View style={tw`flex-row bg-white rounded-2xl mb-4 overflow-hidden border border-gray-100 mx-4 shadow-sm`}>
                <Animated.View style={[tw`w-28 h-28 bg-gray-200`, { opacity: pulseAnim }]} />
                <View style={tw`flex-1 p-4 justify-center`}>
                    <Animated.View style={[tw`bg-gray-100 h-3 w-16 rounded mb-2`, { opacity: pulseAnim }]} />
                    <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded mb-2`, { opacity: pulseAnim }]} />
                    <Animated.View style={[tw`bg-gray-200 h-4 w-2/3 rounded`, { opacity: pulseAnim }]} />
                </View>
            </View>
        );
    }
    return (
        <View style={tw`bg-white rounded-2xl mb-4 border border-gray-100 mx-4 p-4 shadow-sm flex-row`}>
            <Animated.View style={[tw`w-16 h-16 bg-gray-200 rounded-xl mr-4`, { opacity: pulseAnim }]} />
            <View style={tw`flex-1`}>
                <Animated.View style={[tw`bg-gray-200 h-5 w-3/4 rounded mb-2`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-3 w-1/2 rounded mb-3`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-3 w-1/3 rounded`, { opacity: pulseAnim }]} />
            </View>
        </View>
    );
};

// --- KOMPONEN HEADER ANIMASI ---
const AnimatedHeaderTitle = ({ searchAnim, searchInputRef, searchQuery, setSearchQuery, title }) => {
    const titleOpacity = searchAnim.interpolate({
        inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp',
    });
    const searchOpacity = searchAnim.interpolate({
        inputRange: [0.5, 1], outputRange: [0, 1], extrapolate: 'clamp',
    });
    const searchWidth = searchAnim.interpolate({
        inputRange: [0, 1], outputRange: ['0%', '100%'],
    });

    return (
        <View style={tw`flex-1 h-10 justify-center`}>
            <Animated.Text 
                style={[tw`font-bold text-gray-800 text-xl`, styles.headerTitle, { opacity: titleOpacity }]}
                numberOfLines={1}
            >
                {title}
            </Animated.Text>
            <Animated.View style={[tw`absolute right-0 flex-row items-center bg-gray-100 rounded-full h-full`, { width: searchWidth, opacity: searchOpacity }]}>
                <Ionicons name="search" size={20} color="#9ca3af" style={tw`pl-3 pr-2`} />
                <TextInput
                    ref={searchInputRef}
                    style={tw`flex-1 h-full text-gray-700 font-medium`}
                    placeholder="Cari..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </Animated.View>
        </View>
    );
};

export default function NotificationsIndex() {
    const params = useLocalSearchParams(); 
    const [activeTab, setActiveTab] = useState('announcement');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const searchInputRef = useRef(null);
    const searchAnim = useRef(new Animated.Value(0)).current;

    const { data: announcements, loading: loadingAnn, error: errAnn } = useCachedData('/announcements');
    const { data: jobs, loading: loadingJobs, error: errJobs } = useCachedData('/job-vacancies');

    const loading = activeTab === 'announcement' ? loadingAnn : loadingJobs;
    const error = activeTab === 'announcement' ? errAnn : errJobs;
    const currentData = activeTab === 'announcement' ? announcements : jobs;

    useEffect(() => {
        if (params.search) {
            setSearchQuery(params.search);
            setIsSearchVisible(true);
            setActiveTab('announcement');
        }
    }, [params.search]);

    useEffect(() => {
        Animated.timing(searchAnim, {
            toValue: isSearchVisible ? 1 : 0,
            duration: 350,
            useNativeDriver: false,
        }).start(() => {
            if (isSearchVisible) {
                searchInputRef.current?.focus();
            } else {
                Keyboard.dismiss();
                searchInputRef.current?.blur();
            }
        });
    }, [isSearchVisible]);

    const filteredData = useMemo(() => {
        if (!currentData) return [];
        const dataArray = Array.isArray(currentData) ? currentData : (currentData.data || []);

        if (!searchQuery) return dataArray;
        return dataArray.filter(item => {
            const title = activeTab === 'announcement' ? item.title : item.profession;
            return title?.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [currentData, searchQuery, activeTab]);

    // --- CARD COMPONENTS ---
    const JobCard = ({ item }) => {
        // Karena backend menjamin nilai boolean pada 'is_open', 
        // kita dapat langsung menggunakannya secara presisi.
        const isClosed = item.is_open === false;

        // Antisipasi jika open_until_type dikirim sebagai Enum Object atau string biasa
        const openUntilType = typeof item.open_until_type === 'object' && item.open_until_type !== null
            ? item.open_until_type.value
            : item.open_until_type;

        // Logika Batas Waktu berdasarkan referensi backend
        const deadlineText = openUntilType === 'date' 
            ? formatDate(item.open_until_date)
            : 'Sampai Terisi';

        return (
            <Link href={`/notifications/job/${item.id}`} asChild>
                <Pressable style={tw`bg-white rounded-2xl mb-4 border border-gray-100 mx-4 shadow-sm overflow-hidden`}>
                    <View style={tw`flex-row p-4`}>
                        <View style={tw`w-16 h-16 bg-green-50 rounded-xl items-center justify-center mr-4`}>
                            <MaterialCommunityIcons name="briefcase-variant" size={30} color="#16a34a" />
                        </View>
                        <View style={tw`flex-1`}>
                            <View style={tw`flex-row justify-between items-start`}>
                                <Text style={tw`text-gray-800 font-bold text-base flex-1 mr-2`}>{item.profession}</Text>
                                <View style={tw`px-2 py-0.5 rounded-md border ${
                                    isClosed 
                                        ? 'border-gray-300 bg-gray-50' 
                                        : 'border-green-500 bg-green-50'
                                }`}>
                                    <Text style={tw`text-[9px] font-bold ${
                                        isClosed ? 'text-gray-500' : 'text-green-600'
                                    }`}>
                                        {isClosed ? 'DITUTUP' : 'DIBUKA'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={tw`text-gray-500 text-xs mt-1`}>{item.location || 'Semarang, Jawa Tengah'}</Text>
                            <View style={tw`flex-row items-center mt-3`}>
                                <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
                                <Text style={tw`text-gray-400 text-[11px] ml-1`}>Batas: {deadlineText}</Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Link>
        );
    };

    const AnnouncementCard = ({ item }) => (
        <Link href={`/notifications/${item.slug}`} asChild>
            <Pressable style={tw`flex-row bg-white rounded-2xl mb-4 overflow-hidden border border-gray-100 mx-4 shadow-sm`}>
                <Image 
                    source={item.image_url} 
                    style={tw`w-28 h-28 bg-gray-100`}
                    contentFit="cover"
                    transition={500}
                />
                <View style={tw`flex-1 p-4 justify-center`}>
                    <Text style={tw`text-green-600 text-[10px] font-bold uppercase mb-1`}>
                        {formatDate(item.date || item.published_at)}
                    </Text>
                    <Text style={tw`text-gray-800 font-extrabold text-base leading-5`} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View style={tw`flex-row items-center mt-2`}>
                        <Text style={tw`text-gray-400 text-[10px] font-bold mr-1`}>Baca Selengkapnya</Text>
                        <Ionicons name="chevron-forward" size={10} color="#9ca3af" />
                    </View>
                </View>
            </Pressable>
        </Link>
    );

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Stack.Screen options={{ 
                headerTitleAlign: 'left',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#f9fafb' },
                headerTitle: () => (
                    <AnimatedHeaderTitle 
                        searchAnim={searchAnim} 
                        searchInputRef={searchInputRef} 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery}
                        title={activeTab === 'announcement' ? "Pengumuman" : "Lowongan Kerja"}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => {
                        setIsSearchVisible(!isSearchVisible);
                        if (isSearchVisible) setSearchQuery('');
                    }} style={tw`mr-2 p-2`}>
                        <Animated.View style={{
                            transform: [{
                                rotate: searchAnim.interpolate({
                                    inputRange: [0, 1], outputRange: ['0deg', '90deg']
                                })
                            }]
                        }}>
                            <Ionicons name={isSearchVisible ? "close" : "search"} size={22} color="#374151" />
                        </Animated.View>
                    </TouchableOpacity>
                )
            }} />

            {/* Banner Mode Offline */}
            {error && currentData && (
                <View style={tw`bg-amber-100 py-1.5 items-center`}>
                    <Text style={tw`text-[10px] text-amber-800 font-medium`}>Mode Offline: Menampilkan data terakhir</Text>
                </View>
            )}

            {/* TAB SWITCHER */}
            <View style={tw`flex-row px-4 bg-gray-50 border-b border-gray-200`}>
                <TouchableOpacity 
                    onPress={() => setActiveTab('announcement')}
                    style={tw`flex-1 py-3 items-center ${activeTab === 'announcement' ? 'border-b-2 border-green-600' : ''}`}
                >
                    <Text style={tw`font-bold text-sm ${activeTab === 'announcement' ? 'text-green-600' : 'text-gray-400'}`}>PENGUMUMAN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setActiveTab('job')}
                    style={tw`flex-1 py-3 items-center ${activeTab === 'job' ? 'border-b-2 border-green-600' : ''}`}
                >
                    <Text style={tw`font-bold text-sm ${activeTab === 'job' ? 'text-green-600' : 'text-gray-400'}`}>LOWONGAN</Text>
                </TouchableOpacity>
            </View>

            {loading && !currentData ? (
                <FlatList
                    data={[1, 2, 3]}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={tw`pt-4 pb-10`}
                    renderItem={() => <NotificationSkeleton type={activeTab} />}
                />
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={tw`pt-4 pb-10`}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => activeTab === 'announcement' ? <AnnouncementCard item={item} /> : <JobCard item={item} />}
                    ListEmptyComponent={
                        <View style={tw`mt-20 items-center px-10`}>
                            <Ionicons name="search-outline" size={40} color="#d1d5db" />
                            <Text style={tw`text-gray-400 text-center text-sm mt-2`}>
                                Tidak ditemukan.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerTitle: { position: 'absolute', left: 0 }
});