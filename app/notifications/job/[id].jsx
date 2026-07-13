
// // app/notifications/job/[id].jsx
// import React, { useState, useRef, useEffect } from 'react';
// import {
//     View,
//     Text,
//     ScrollView,
//     useWindowDimensions,
//     Linking,
//     Modal,
//     Pressable,
//     TouchableOpacity,
//     Animated
// } from 'react-native';
// import { useLocalSearchParams, Stack } from 'expo-router';
// import RenderHTML from 'react-native-render-html';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { Image } from 'expo-image'; // Menggunakan expo-image untuk caching
// import tw from 'twrnc';

// // Import hook caching
// import { useCachedData } from '../../../hooks/useCachedData';

// // --- KOMPONEN SKELETON DETAIL LOWONGAN ---
// const JobDetailSkeleton = () => {
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
//         <ScrollView style={tw`flex-1 bg-white`}>
//             <View style={tw`p-6`}>
//                 <Animated.View style={[tw`bg-gray-200 h-8 w-3/4 rounded-md mb-4`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-100 h-6 w-24 rounded-full mb-8`, { opacity: pulseAnim }]} />
//                 <View style={tw`h-[1px] bg-gray-100 w-full mb-8`} />
//                 <Animated.View style={[tw`bg-gray-200 h-6 w-1/2 rounded mb-4`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded mb-2`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded mb-2`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-100 h-4 w-2/3 rounded mb-10`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-200 w-full aspect-[3/4] rounded-2xl`, { opacity: pulseAnim }]} />
//             </View>
//         </ScrollView>
//     );
// };

// export default function JobDetail() {
//     const { id } = useLocalSearchParams();
//     const { width } = useWindowDimensions();
//     const [isImageModalVisible, setImageModalVisible] = useState(false);

//     // MENGGUNAKAN HOOK CACHING
//     const { data: vacancy, loading, error } = useCachedData(`/job-vacancies/${id}`);

//     // Loading State
//     if (loading && !vacancy) return <JobDetailSkeleton />;

//     // Error State (Jika tidak ada data sama sekali)
//     if (error && !vacancy) {
//         return (
//             <View style={tw`flex-1 justify-center items-center bg-white p-10`}>
//                 <Ionicons name="alert-circle-outline" size={60} color="#d1d5db" />
//                 <Text style={tw`text-gray-500 mt-4 text-center`}>Gagal memuat lowongan. Silakan coba lagi nanti.</Text>
//             </View>
//         );
//     }

//     if (!vacancy) return null;

//     console.log(
//         'VACANCY:',
//         JSON.stringify(vacancy, null, 2)
//     );

//     console.log(
//         'REQUIREMENTS:',
//         JSON.stringify(vacancy.requirements, null, 2)
//     );

//     const isClosed = !vacancy.is_open;
//     const availableChannels = (vacancy.submission_channels || []).filter(ch =>
//         ['email', 'whatsapp'].includes(ch.type) && ch.value
//     );

//     const handleApply = (type, value) => {
//         if (isClosed) return;
//         let url = '';
//         if (type === 'whatsapp') {
//             const phone = value.replace(/\D/g, '');
//             url = `whatsapp://send?phone=${phone.startsWith('0') ? '62' + phone.slice(1) : phone}&text=Halo, saya ingin melamar pekerjaan ${vacancy.profession}`;
//         } else if (type === 'email') {
//             url = `mailto:${value}?subject=Lamaran Pekerjaan: ${vacancy.profession}`;
//         }

//         if (url) {
//             Linking.canOpenURL(url).then(supported => {
//                 if (supported) Linking.openURL(url);
//                 else alert("Aplikasi tidak tersedia");
//             });
//         }
//     };

//     const validRequirements =
//         (vacancy.requirements || []).filter(
//             item => item?.requirement_text
//         );

//     const validDocuments =
//         (vacancy.required_documents || []).filter(
//             item => item?.document_name
//         );

//     return (
//         <View style={tw`flex-1 bg-gray-50`}>
//             <Stack.Screen options={{
//                 title: 'Detail Lowongan',
//                 headerTitleStyle: tw`font-bold text-gray-800`,
//                 headerShadowVisible: false,
//                 headerStyle: { backgroundColor: '#f9fafb' },
//             }} />

//             {/* Banner Offline Indicator */}
//             {error && vacancy && (
//                 <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
//                     <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
//                     <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>Mode Offline: Menampilkan data terakhir</Text>
//                 </View>
//             )}

//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-28`}>

//                 {/* Header Section */}
//                 <View style={tw`p-6`}>
//                     <Text style={tw`text-2xl font-black text-black mb-3`}>
//                         {vacancy.profession}
//                     </Text>

//                     <View style={tw`flex-row mb-6`}>
//                         {isClosed ? (
//                             <View style={tw`border border-gray-300 bg-gray-100 px-3 py-1 rounded-full`}>
//                                 <Text style={tw`text-gray-500 text-[10px] font-bold uppercase`}>TUTUP</Text>
//                             </View>
//                         ) : (
//                             <View style={tw`border border-[#00C06A] bg-[#E6F9F0] px-4 py-1 rounded-full`}>
//                                 <Text style={tw`text-[#00C06A] text-[10px] font-bold uppercase`}>BUKA</Text>
//                             </View>
//                         )}
//                     </View>

//                     <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

//                     {/* Deskripsi Pekerjaan */}
//                     <View style={tw`mb-10`}>
//                         <Text style={tw`text-xl font-bold text-black mb-4`}>Deskripsi Pekerjaan</Text>
//                         <RenderHTML
//                             contentWidth={width - 48}
//                             source={{ html: vacancy.description }}
//                             tagsStyles={{
//                                 p: tw`text-gray-700 leading-6 text-justify text-base mb-4`,
//                                 ul: tw`mt-2 ml-2`,
//                                 li: tw`text-gray-700 mb-1 text-base`
//                             }}
//                         />
//                     </View>

//                     {/* Persyaratan */}
//                     {validRequirements.length > 0 ? (
//                         <View style={tw`mb-10`}>
//                             <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

//                             <Text style={tw`text-xl font-bold text-black mb-6`}>
//                                 Persyaratan
//                             </Text>

//                             {validRequirements.map((req, index) => (
//                                 <View
//                                     key={index}
//                                     style={tw`flex-row items-start mb-4`}
//                                 >
//                                     <Ionicons
//                                         name="checkmark-circle"
//                                         size={22}
//                                         color="#00C06A"
//                                         style={tw`mr-3 mt-0.5`}
//                                     />

//                                     <Text
//                                         style={tw`text-gray-600 font-medium text-base flex-1 leading-relaxed`}
//                                     >
//                                         {req.requirement_text}
//                                     </Text>
//                                 </View>
//                             ))}
//                         </View>
//                     ) : (
//                         <View style={tw`mb-10`}>
//                             <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

//                             <Text style={tw`text-xl font-bold text-black mb-4`}>
//                                 Persyaratan
//                             </Text>

//                             <View style={tw`bg-blue-50 border border-blue-100 rounded-xl p-4`}>
//                                 <Text style={tw`text-blue-700`}>
//                                     Persyaratan pelamar mengikuti informasi yang tercantum pada poster lowongan.
//                                 </Text>
//                             </View>
//                         </View>
//                     )}
                    
//                     {/* Dokumen Pendukung */}
//                     {validDocuments.length > 0 ? (
//                         <View style={tw`mb-10`}>
//                             <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

//                             <Text style={tw`text-xl font-bold text-black mb-4`}>
//                                 Dokumen Pendukung
//                             </Text>

//                             {validDocuments.map((doc, index) => (
//                                 <View
//                                     key={index}
//                                     style={tw`flex-row items-center mb-2 ml-2`}
//                                 >
//                                     <View
//                                         style={tw`w-1.5 h-1.5 rounded-full bg-gray-400 mr-3`}
//                                     />

//                                     <Text style={tw`text-gray-700 text-base`}>
//                                         {doc.document_name}
//                                     </Text>
//                                 </View>
//                             ))}
//                         </View>
//                     ) : (
//                         <View style={tw`mb-10`}>
//                             <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

//                             <Text style={tw`text-xl font-bold text-black mb-4`}>
//                                 Dokumen Pendukung
//                             </Text>

//                             <View style={tw`bg-amber-50 border border-amber-100 rounded-xl p-4`}>
//                                 <Text style={tw`text-amber-700`}>
//                                     Dokumen pendukung yang diperlukan mengikuti ketentuan pada poster lowongan.
//                                 </Text>
//                             </View>
//                         </View>
//                     )}

//                     {/* Poster Image (Optimized with expo-image) */}
//                     <View style={tw`mt-4 shadow-xl`}>
//                         <TouchableOpacity
//                             activeOpacity={0.9}
//                             onPress={() => vacancy.poster_image && setImageModalVisible(true)}
//                             style={tw`bg-white rounded-xl overflow-hidden border border-gray-100 relative`}
//                         >
//                             {vacancy.poster_image ? (
//                                 <View>
//                                     <Image
//                                         source={vacancy.poster_image}
//                                         style={[tw`w-full`, { aspectRatio: 3 / 4 }]}
//                                         contentFit="cover"
//                                         transition={500}
//                                     />
//                                     <View style={tw`absolute inset-0 bg-black/10 items-center justify-center`}>
//                                         <View style={tw`bg-white/90 rounded-full p-3 shadow-md`}>
//                                             <Ionicons name="search" size={24} color="#333" />
//                                         </View>
//                                     </View>
//                                 </View>
//                             ) : (
//                                 <View style={tw`aspect-[3/4] items-center justify-center bg-gray-50`}>
//                                     <Text style={tw`text-gray-400 font-medium`}>Poster belum tersedia</Text>
//                                 </View>
//                             )}
//                         </TouchableOpacity>
//                         {vacancy.poster_image && (
//                             <Text style={tw`text-center text-xs text-gray-400 mt-3`}>
//                                 Klik gambar untuk memperbesar
//                             </Text>
//                         )}
//                     </View>
//                 </View>
//             </ScrollView>

//             {/* Bottom Apply Buttons */}
//             <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 shadow-2xl`}>
//                 {isClosed ? (
//                     <View style={tw`w-full py-4 bg-gray-300 rounded-xl items-center`}>
//                         <Text style={tw`text-white font-black text-lg tracking-widest`}>PENDAFTARAN DITUTUP</Text>
//                     </View>
//                 ) : (
//                     <View style={tw`gap-3`}>
//                         {availableChannels.length > 0 ? (
//                             availableChannels.map((channel, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     onPress={() => handleApply(channel.type, channel.value)}
//                                     style={tw`w-full py-4 bg-[#00C06A] rounded-xl items-center shadow-md`}
//                                 >
//                                     <Text style={tw`text-white font-black text-base tracking-wider uppercase`}>
//                                         LAMAR VIA {channel.type === 'whatsapp' ? 'WHATSAPP' : 'EMAIL'}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))
//                         ) : (
//                             <TouchableOpacity style={tw`w-full py-4 bg-[#00C06A] rounded-xl items-center shadow-md`}>
//                                 <Text style={tw`text-white font-black text-base tracking-wider`}>LAMAR SEKARANG</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 )}
//             </View>

//             {/* Modal Image Preview */}
//             <Modal visible={isImageModalVisible} transparent animationType="fade">
//                 <View style={tw`flex-1 bg-black/95 items-center justify-center p-4`}>
//                     <Pressable
//                         style={tw`absolute top-12 right-6 z-50 p-2 bg-white/20 rounded-full`}
//                         onPress={() => setImageModalVisible(false)}
//                     >
//                         <Ionicons name="close" size={30} color="white" />
//                     </Pressable>

//                     <Pressable style={tw`w-full h-full justify-center`} onPress={() => setImageModalVisible(false)}>
//                         <Image
//                             source={vacancy.poster_image}
//                             style={tw`w-full h-5/6`}
//                             contentFit="contain"
//                         />
//                     </Pressable>
//                 </View>
//             </Modal>
//         </View>
//     );
// }
// app/notifications/job/[id].jsx
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    Linking,
    Modal,
    Pressable,
    TouchableOpacity,
    Animated
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import RenderHTML from 'react-native-render-html';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image'; // Menggunakan expo-image untuk caching
import tw from 'twrnc';

// Import hook caching
import { useCachedData } from '../../../hooks/useCachedData';

// --- KOMPONEN SKELETON DETAIL LOWONGAN ---
const JobDetailSkeleton = () => {
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
            <View style={tw`p-6`}>
                <Animated.View style={[tw`bg-gray-200 h-8 w-3/4 rounded-md mb-4`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-6 w-24 rounded-full mb-8`, { opacity: pulseAnim }]} />
                <View style={tw`h-[1px] bg-gray-100 w-full mb-8`} />
                <Animated.View style={[tw`bg-gray-200 h-6 w-1/2 rounded mb-4`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded mb-2`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-4 w-full rounded mb-2`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-100 h-4 w-2/3 rounded mb-10`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-200 w-full aspect-[3/4] rounded-2xl`, { opacity: pulseAnim }]} />
            </View>
        </ScrollView>
    );
};

export default function JobDetail() {
    const { id } = useLocalSearchParams();
    const { width } = useWindowDimensions();
    const [isImageModalVisible, setImageModalVisible] = useState(false);

    // MENGGUNAKAN HOOK CACHING
    const { data: vacancy, loading, error } = useCachedData(`/job-vacancies/${id}`);

    // Loading State
    if (loading && !vacancy) return <JobDetailSkeleton />;

    // Error State (Jika tidak ada data sama sekali)
    if (error && !vacancy) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white p-10`}>
                <Ionicons name="alert-circle-outline" size={60} color="#d1d5db" />
                <Text style={tw`text-gray-500 mt-4 text-center`}>Gagal memuat lowongan. Silakan coba lagi nanti.</Text>
            </View>
        );
    }

    if (!vacancy) return null;

    console.log(
        'VACANCY:',
        JSON.stringify(vacancy, null, 2)
    );

    console.log(
        'REQUIREMENTS:',
        JSON.stringify(vacancy.requirements, null, 2)
    );

    // Logika Status: Memeriksa properti 'is_open' dari backend dengan dukungan berbagai tipe data.
    // Jika data lama di cache belum memiliki properti 'is_open', sistem akan beralih ke 'status'.
    const isOpen = (vacancy.is_open !== undefined && vacancy.is_open !== null)
        ? (vacancy.is_open === true || vacancy.is_open === 'true' || vacancy.is_open === 1 || vacancy.is_open === '1')
        : (vacancy.status === 'open');

    const isClosed = !isOpen;
    
    const availableChannels = (vacancy.submission_channels || []).filter(ch =>
        ['email', 'whatsapp'].includes(ch.type) && ch.value
    );

    const handleApply = (type, value) => {
        if (isClosed) return;
        let url = '';
        if (type === 'whatsapp') {
            const phone = value.replace(/\D/g, '');
            url = `whatsapp://send?phone=${phone.startsWith('0') ? '62' + phone.slice(1) : phone}&text=Halo, saya ingin melamar pekerjaan ${vacancy.profession}`;
        } else if (type === 'email') {
            url = `mailto:${value}?subject=Lamaran Pekerjaan: ${vacancy.profession}`;
        }

        if (url) {
            Linking.canOpenURL(url).then(supported => {
                if (supported) Linking.openURL(url);
                else alert("Aplikasi tidak tersedia");
            });
        }
    };

    const validRequirements =
        (vacancy.requirements || []).filter(
            item => item?.requirement_text
        );

    const validDocuments =
        (vacancy.required_documents || []).filter(
            item => item?.document_name
        );

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Stack.Screen options={{
                title: 'Detail Lowongan',
                headerTitleStyle: tw`font-bold text-gray-800`,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#f9fafb' },
            }} />

            {/* Banner Offline Indicator */}
            {error && vacancy && (
                <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
                    <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
                    <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>Mode Offline: Menampilkan data terakhir</Text>
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-28`}>

                {/* Header Section */}
                <View style={tw`p-6`}>
                    <Text style={tw`text-2xl font-black text-black mb-3`}>
                        {vacancy.profession}
                    </Text>

                    <View style={tw`flex-row mb-6`}>
                        {isClosed ? (
                            <View style={tw`border border-gray-300 bg-gray-100 px-3 py-1 rounded-full`}>
                                <Text style={tw`text-gray-500 text-[10px] font-bold uppercase`}>TUTUP</Text>
                            </View>
                        ) : (
                            <View style={tw`border border-[#00C06A] bg-[#E6F9F0] px-4 py-1 rounded-full`}>
                                <Text style={tw`text-[#00C06A] text-[10px] font-bold uppercase`}>BUKA</Text>
                            </View>
                        )}
                    </View>

                    <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

                    {/* Deskripsi Pekerjaan */}
                    <View style={tw`mb-10`}>
                        <Text style={tw`text-xl font-bold text-black mb-4`}>Deskripsi Pekerjaan</Text>
                        <RenderHTML
                            contentWidth={width - 48}
                            source={{ html: vacancy.description }}
                            tagsStyles={{
                                p: tw`text-gray-700 leading-6 text-justify text-base mb-4`,
                                ul: tw`mt-2 ml-2`,
                                li: tw`text-gray-700 mb-1 text-base`
                            }}
                        />
                    </View>

                    {/* Persyaratan */}
                    {validRequirements.length > 0 ? (
                        <View style={tw`mb-10`}>
                            <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

                            <Text style={tw`text-xl font-bold text-black mb-6`}>
                                Persyaratan
                            </Text>

                            {validRequirements.map((req, index) => (
                                <View
                                    key={index}
                                    style={tw`flex-row items-start mb-4`}
                                >
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={22}
                                        color="#00C06A"
                                        style={tw`mr-3 mt-0.5`}
                                    />

                                    <Text
                                        style={tw`text-gray-600 font-medium text-base flex-1 leading-relaxed`}
                                    >
                                        {req.requirement_text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={tw`mb-10`}>
                            <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

                            <Text style={tw`text-xl font-bold text-black mb-4`}>
                                Persyaratan
                            </Text>

                            <View style={tw`bg-blue-50 border border-blue-100 rounded-xl p-4`}>
                                <Text style={tw`text-blue-700`}>
                                    Persyaratan pelamar mengikuti informasi yang tercantum pada poster lowongan.
                                </Text>
                            </View>
                        </View>
                    )}
                    
                    {/* Dokumen Pendukung */}
                    {validDocuments.length > 0 ? (
                        <View style={tw`mb-10`}>
                            <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

                            <Text style={tw`text-xl font-bold text-black mb-4`}>
                                Dokumen Pendukung
                            </Text>

                            {validDocuments.map((doc, index) => (
                                <View
                                    key={index}
                                    style={tw`flex-row items-center mb-2 ml-2`}
                                >
                                    <View
                                        style={tw`w-1.5 h-1.5 rounded-full bg-gray-400 mr-3`}
                                    />

                                    <Text style={tw`text-gray-700 text-base`}>
                                        {doc.document_name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={tw`mb-10`}>
                            <View style={tw`h-[1px] bg-gray-200 w-full mb-8`} />

                            <Text style={tw`text-xl font-bold text-black mb-4`}>
                                Dokumen Pendukung
                            </Text>

                            <View style={tw`bg-amber-50 border border-amber-100 rounded-xl p-4`}>
                                <Text style={tw`text-amber-700`}>
                                    Dokumen pendukung yang diperlukan mengikuti ketentuan pada poster lowongan.
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Poster Image (Optimized with expo-image) */}
                    <View style={tw`mt-4 shadow-xl`}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => vacancy.poster_image && setImageModalVisible(true)}
                            style={tw`bg-white rounded-xl overflow-hidden border border-gray-100 relative`}
                        >
                            {vacancy.poster_image ? (
                                <View>
                                    <Image
                                        source={vacancy.poster_image}
                                        style={[tw`w-full`, { aspectRatio: 3 / 4 }]}
                                        contentFit="cover"
                                        transition={500}
                                    />
                                    <View style={tw`absolute inset-0 bg-black/10 items-center justify-center`}>
                                        <View style={tw`bg-white/90 rounded-full p-3 shadow-md`}>
                                            <Ionicons name="search" size={24} color="#333" />
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View style={tw`aspect-[3/4] items-center justify-center bg-gray-50`}>
                                    <Text style={tw`text-gray-400 font-medium`}>Poster belum tersedia</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        {vacancy.poster_image && (
                            <Text style={tw`text-center text-xs text-gray-400 mt-3`}>
                                Klik gambar untuk memperbesar
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Apply Buttons */}
            <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 shadow-2xl`}>
                {isClosed ? (
                    <View style={tw`w-full py-4 bg-gray-300 rounded-xl items-center`}>
                        <Text style={tw`text-white font-black text-lg tracking-widest`}>PENDAFTARAN DITUTUP</Text>
                    </View>
                ) : (
                    <View style={tw`gap-3`}>
                        {availableChannels.length > 0 ? (
                            availableChannels.map((channel, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleApply(channel.type, channel.value)}
                                    style={tw`w-full py-4 bg-[#00C06A] rounded-xl items-center shadow-md`}
                                >
                                    <Text style={tw`text-white font-black text-base tracking-wider uppercase`}>
                                        LAMAR VIA {channel.type === 'whatsapp' ? 'WHATSAPP' : 'EMAIL'}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <TouchableOpacity style={tw`w-full py-4 bg-[#00C06A] rounded-xl items-center shadow-md`}>
                                <Text style={tw`text-white font-black text-base tracking-wider`}>LAMAR SEKARANG</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {/* Modal Image Preview */}
            <Modal visible={isImageModalVisible} transparent animationType="fade">
                <View style={tw`flex-1 bg-black/95 items-center justify-center p-4`}>
                    <Pressable
                        style={tw`absolute top-12 right-6 z-50 p-2 bg-white/20 rounded-full`}
                        onPress={() => setImageModalVisible(false)}
                    >
                        <Ionicons name="close" size={30} color="white" />
                    </Pressable>

                    <Pressable style={tw`w-full h-full justify-center`} onPress={() => setImageModalVisible(false)}>
                        <Image
                            source={vacancy.poster_image}
                            style={tw`w-full h-5/6`}
                            contentFit="contain"
                        />
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
}