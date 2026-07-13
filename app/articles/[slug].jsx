// import React, { useState, useEffect, useRef } from 'react';
// import { 
//     View, 
//     Text, 
//     ActivityIndicator, 
//     Image, 
//     ScrollView, 
//     useWindowDimensions, 
//     TextInput, 
//     TouchableOpacity, 
//     Alert,
//     Animated 
// } from 'react-native';
// import { useLocalSearchParams, Stack, Link } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import RenderHTML from 'react-native-render-html';
// import tw from 'twrnc'; 

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
// const DUMMY_IMAGE = "https://via.placeholder.com/400x250.png/cccccc/969696?text=Image+Not+Found";

// // --- KOMPONEN SKELETON SCREEN ---
// const ArticleSkeleton = () => {
//     const pulseAnim = useRef(new Animated.Value(0.5)).current;

//     useEffect(() => {
//         const sharedAnimation = Animated.sequence([
//             Animated.timing(pulseAnim, {
//                 toValue: 1,
//                 duration: 1000,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(pulseAnim, {
//                 toValue: 0.5,
//                 duration: 1000,
//                 useNativeDriver: true,
//             }),
//         ]);

//         Animated.loop(sharedAnimation).start();
//     }, []);

//     return (
//         <ScrollView style={tw`flex-1 bg-gray-50`}>
//             <View style={tw`px-4 py-6 max-w-3xl self-center w-full`}>
//                 {/* Header Skeleton */}
//                 <Animated.View style={[tw`bg-gray-200 h-8 w-3/4 rounded-md mb-3`, { opacity: pulseAnim }]} />
//                 <View style={tw`flex-row items-center mb-5`}>
//                     <Animated.View style={[tw`bg-gray-200 h-4 w-20 rounded-md mr-3`, { opacity: pulseAnim }]} />
//                     <Animated.View style={[tw`bg-gray-200 h-4 w-24 rounded-md`, { opacity: pulseAnim }]} />
//                 </View>

//                 {/* Image Skeleton */}
//                 <Animated.View style={[tw`bg-gray-200 w-full h-56 rounded-2xl mb-6`, { opacity: pulseAnim }]} />

//                 {/* Content Skeleton */}
//                 <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded-md mb-3`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded-md mb-3`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-200 h-4 w-5/6 rounded-md mb-3`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded-md mb-3`, { opacity: pulseAnim }]} />
//                 <Animated.View style={[tw`bg-gray-200 h-4 w-2/3 rounded-md mb-8`, { opacity: pulseAnim }]} />

//                 {/* Section Header Skeleton */}
//                 <View style={tw`border-b border-gray-200 pb-2 mb-4`}>
//                     <Animated.View style={[tw`bg-gray-200 h-5 w-32 rounded-md`, { opacity: pulseAnim }]} />
//                 </View>

//                 {/* Other Articles Skeleton */}
//                 {[1, 2].map((i) => (
//                     <View key={i} style={tw`flex-row gap-3 mb-4 bg-white p-3 rounded-xl`}>
//                         <Animated.View style={[tw`bg-gray-200 w-24 h-20 rounded-lg`, { opacity: pulseAnim }]} />
//                         <View style={tw`flex-1 justify-center`}>
//                             <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded-md mb-2`, { opacity: pulseAnim }]} />
//                             <Animated.View style={[tw`bg-gray-200 h-3 w-1/2 rounded-md`, { opacity: pulseAnim }]} />
//                         </View>
//                     </View>
//                 ))}
//             </View>
//         </ScrollView>
//     );
// };

// // --- Gaya untuk RenderHTML ---
// const getRenderHTMLTagsStyles = (width) => ({
//     p: tw`text-gray-700 text-base leading-relaxed mb-6`,
//     h1: tw`text-2xl font-bold text-gray-900 mb-3`,
//     h2: tw`text-xl font-bold text-gray-900 mb-2`,
//     ul: tw`my-4 ml-5`,
//     li: tw`text-base text-gray-700 leading-relaxed mb-3`,
//     img: tw`rounded-lg my-5 w-full h-auto object-cover`,
//     figure: tw`my-8 w-full flex flex-col items-center`,
//     figcaption: tw`mt-2 text-center text-sm text-gray-500 italic px-4`,
//     strong: tw`font-bold`,
//     em: tw`italic`,
// });


// const EMOJI_OPTIONS = ['😄', '🙂', '😐', '🙁', '😠', '😢'];

// const ArticleDetail = () => {
//     const { slug } = useLocalSearchParams();
//     const { width } = useWindowDimensions();

//     // States untuk Data
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // States untuk Form Review
//     const [reviewName, setReviewName] = useState('');
//     const [reviewComment, setReviewComment] = useState('');
//     const [reviewReaction, setReviewReaction] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const fetchArticleDetail = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const url = `${API_BASE_URL}/articles/${slug}`;
//             console.log("Fetching from:", url);

//             const response = await fetch(url);
//             if (!response.ok) {
//                 let errorMessage = 'Artikel tidak ditemukan.';
//                 try {
//                     const errorData = await response.json();
//                     errorMessage = errorData.message || errorData.error || errorMessage;
//                 } catch (e) {
//                     errorMessage = `Gagal memuat artikel (Status: ${response.status}).`;
//                 }
//                 throw new Error(errorMessage);
//             }
//             const result = await response.json();
//             setData(result);
//         } catch (e) {
//             console.error("Fetch Error:", e);
//             setError(e.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (slug) fetchArticleDetail();
//     }, [slug]);

//     // Fungsi Kirim Review
//     const submitReview = async () => {
//         if (!reviewComment && !reviewReaction) {
//             Alert.alert("Oops!", "Mohon berikan reaksi atau komentar.");
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const url = `${API_BASE_URL}/articles/${slug}/reviews`;
//             console.log("Submitting review to:", url);

//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     name: reviewName,
//                     comment: reviewComment,
//                     reaction: reviewReaction
//                 })
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 Alert.alert("Berhasil", "Terima kasih atas ulasan Anda!");
//                 setReviewName('');
//                 setReviewComment('');
//                 setReviewReaction('');
//                 fetchArticleDetail();
//             } else {
//                 const errorMessage = result.message || result.error || "Gagal mengirim ulasan.";
//                 Alert.alert("Gagal", errorMessage);
//             }
//         } catch (error) {
//             console.error("Submit Review Error:", error);
//             Alert.alert("Error", "Terjadi kesalahan jaringan.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // --- Loading State Menggunakan Skeleton ---
//     if (loading) return <ArticleSkeleton />;

//     // --- Error State ---
//     if (error || !data) return (
//         <View style={tw`flex-1 justify-center items-center p-5 bg-gray-50`}>
//             <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
//             <Text style={tw`text-base text-gray-600 mt-2.5 text-center px-5`}>{error || "Artikel tidak ditemukan."}</Text>
//             <TouchableOpacity onPress={fetchArticleDetail} style={tw`mt-5 bg-green-600 py-2.5 px-5 rounded-full`}>
//                 <Text style={tw`text-white font-bold`}>Coba Lagi</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     const { article, otherArticles, reviews, reactionCounts } = data;

//     const renderHTMLContentWidth = width - 32;

//     const parseContentToHTML = (content) => {
//         if (!content) return '';
//         if (typeof content === 'string') return content;
//         if (Array.isArray(content)) {
//             return content.map(block => {
//                 if (block.type === 'paragraph') {
//                     return block.data.content;
//                 }
//                 if (block.type === 'image' || block.type === 'image_banner') {
//                     return `<img src="${block.data.url}" />`;
//                 }
//                 return '';
//             }).join('');
//         }
//         return '';
//     };

//     return (
//         <ScrollView style={tw`flex-1 bg-gray-50`}>
//             <Stack.Screen options={{ title: 'Artikel' }} />

//             <View style={tw`px-4 py-6 max-w-3xl self-center w-full`}>

//                 {/* ===== HEADER ===== */}
//                 <View style={tw`mb-5`}>
//                     <Text style={tw`text-2xl font-extrabold text-gray-900 leading-snug`}>
//                         {article.title}
//                     </Text>

//                     <View style={tw`flex-row items-center mt-2`}>
//                         <Text style={tw`text-xs text-gray-500`}>
//                             {article.date}
//                         </Text>
//                         <Text style={tw`mx-1 text-gray-400`}>•</Text>
//                         <Text style={tw`text-xs text-gray-500`}>
//                             {article.author || 'Admin'}
//                         </Text>
//                     </View>
//                 </View>

//                 {/* ===== IMAGE ===== */}
//                 <View style={tw`rounded-2xl overflow-hidden mb-6`}>
//                     <Image
//                         source={{ uri: article.image_url || DUMMY_IMAGE }}
//                         style={tw`w-full h-56`}
//                         resizeMode="cover"
//                     />
//                 </View>

//                 {/* ===== CONTENT ===== */}
//                 <View style={tw`mb-8`}>
//                     <RenderHTML
//                         contentWidth={renderHTMLContentWidth}
//                         source={{ html: parseContentToHTML(article.content) }}
//                         tagsStyles={{
//                             p: tw`text-gray-700 text-[15px] leading-7 mb-5`,
//                             h1: tw`text-xl font-bold mb-3`,
//                             h2: tw`text-lg font-bold mb-2`,
//                             img: tw`rounded-xl my-6`,
//                         }}
//                     />
//                 </View>

//                 {/* ===== ARTIKEL LAIN ===== */}
//                 {otherArticles.length > 0 && (
//                     <View style={tw`mb-8`}>
                        
//                         <View style={tw`flex-row justify-between items-center mb-4 border-b border-gray-200 pb-2`}>
    
//     <Text style={tw`font-bold text-gray-900 text-base`}>
//         ARTIKEL LAIN
//     </Text>

//     <Link href="/articles" asChild>
//         <TouchableOpacity style={tw`p-1`}>
//             <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
//         </TouchableOpacity>
//     </Link>

// </View>

//                         {otherArticles.map((oa) => (
//                             <Link key={oa.id} href={`/articles/${oa.slug}`} asChild>
//                                 <TouchableOpacity style={tw`flex-row gap-3 mb-4 bg-white p-3 rounded-xl shadow-sm`}>
//                                     <Image
//                                         source={{ uri: oa.image_url }}
//                                         style={tw`w-24 h-20 rounded-lg`}
//                                     />
//                                     <View style={tw`flex-1 justify-between`}>
//                                         <Text
//                                             style={tw`font-semibold text-sm text-gray-800`}
//                                             numberOfLines={3}
//                                         >
//                                             {oa.title}
//                                         </Text>
//                                         <View style={tw`flex-row justify-between items-center mt-1`}>
//                                             <Text style={tw`text-xs text-gray-500`} numberOfLines={1}>
//                                                 By {oa.author || 'Admin'}
//                                             </Text>
//                                             <View style={tw`flex-row items-center`}>
//                                                 <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
//                                                 <Text style={tw`text-xs text-gray-400 ml-1`}>
//                                                     {oa.date}
//                                                 </Text>
//                                             </View>
//                                         </View>
//                                     </View>
//                                 </TouchableOpacity>
//                             </Link>
//                         ))}
//                     </View>
//                 )}


//                 {/* ===== FORM KOMENTAR ===== */}
//                 <View style={tw`mb-10`}>
//                     <View style={tw`flex-row justify-between items-center mb-4 border-b border-gray-200 pb-2`}>
//                         <Text style={tw`font-bold text-gray-900 text-base`}>
//                             ULASAN ARTIKEL
//                         </Text>
//                     </View>

//                     <View style={tw`flex-row justify-between mb-3`}>
//                         {EMOJI_OPTIONS.map((emoji) => (
//                             <TouchableOpacity
//                                 key={emoji}
//                                 onPress={() => setReviewReaction(reviewReaction === emoji ? null : emoji)}
//                                 style={tw`flex-1 items-center ${reviewReaction === emoji ? 'scale-110' : 'opacity-60'
//                                     }`}
//                             >
//                                 <Text style={{ fontSize: 24 }}>
//                                     {emoji}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>

//                     <TextInput
//                         style={tw`bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3`}
//                         placeholder="Tulis komentar..."
//                         multiline
//                         value={reviewComment}
//                         onChangeText={setReviewComment}
//                     />

//                     {reviewComment.length > 0 && (
//                         <TextInput
//                             style={tw`bg-white border border-gray-200 rounded-xl px-4 py-2 mb-3 text-xs`}
//                             placeholder="Nama Anda (Opsional)"
//                             value={reviewName}
//                             onChangeText={setReviewName}
//                         />
//                     )}

//                     <TouchableOpacity
//                         style={tw`bg-green-600 py-3 rounded-xl items-center`}
//                         onPress={submitReview}
//                     >
//                         <Text style={tw`text-white font-bold`}>
//                             Kirim
//                         </Text>
//                     </TouchableOpacity>
//                 </View>


//                 {/* ===== REACTIONS ===== */}
//                 <View style={tw`mb-8`}>
//                     <Text style={tw`font-bold text-gray-900 mb-3`}>
//                         Reaksi Pembaca
//                     </Text>

//                     {(() => {
//                         const reactions = [
//                             { emoji: '😄', count: reactionCounts?.grinning || 0 },
//                             { emoji: '🙂', count: reactionCounts?.smiling || 0 },
//                             { emoji: '😐', count: reactionCounts?.neutral || 0 },
//                             { emoji: '🙁', count: reactionCounts?.frowning || 0 },
//                             { emoji: '😠', count: reactionCounts?.angry || 0 },
//                             { emoji: '😢', count: reactionCounts?.crying || 0 },
//                         ];

//                         return (
//                             <View style={tw`flex-row justify-between px-2`}>
//                                 {reactions.map((item, index) => (
//                                     <View key={index} style={tw`items-center`}>
//                                         <Text style={tw`text-2xl mb-1`}>
//                                             {item.emoji}
//                                         </Text>
//                                         <Text style={tw`text-sm text-gray-600 font-medium`}>
//                                             {item.count}
//                                         </Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     })()}
//                 </View>

//                 {/* ===== KOMENTAR ===== */}
//                 <View style={tw`mb-10`}>
//                     <Text style={tw`font-bold text-gray-900 mb-4`}>
//                         Komentar ({reviews?.length || 0})
//                     </Text>

//                     {reviews?.length === 0 ? (
//                         <Text style={tw`text-gray-400 italic`}>
//                             Belum ada komentar
//                         </Text>
//                     ) : (
//                         reviews?.map((rev) => (
//                             <View key={rev.id} style={tw`mb-5 pb-4 border-b border-gray-100`}>
//                                 <View style={tw`flex-row gap-3`}>
//                                     <View style={tw`w-9 h-9 rounded-full bg-[#ff6b6b] items-center justify-center`}>
//                                         <Text style={tw`text-white font-bold`}>
//                                             {rev.name ? rev.name[0] : 'A'}
//                                         </Text>
//                                     </View>

//                                     <View style={tw`flex-1`}>
//                                         <Text style={tw`font-bold text-sm`}>
//                                             {rev.name || 'User'}
//                                         </Text>

//                                         {rev.reaction && (
//                                             <Text style={tw`text-sm mt-1`}>
//                                                 {rev.reaction}
//                                             </Text>
//                                         )}

//                                         <Text style={tw`text-gray-600 text-sm mt-1 leading-relaxed`}>
//                                             {rev.comment}
//                                         </Text>

//                                         <Text style={tw`text-gray-400 text-xs mt-1`}>
//                                             {rev.date}
//                                         </Text>
//                                     </View>
//                                 </View>
//                             </View>
//                         ))
//                     )}
//                 </View>

//             </View>
//         </ScrollView>
//     );
// };

// export default ArticleDetail;

import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    useWindowDimensions, 
    TextInput, 
    TouchableOpacity, 
    Alert,
    Animated 
} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import tw from 'twrnc'; 
import { Image } from 'expo-image'; // Optimasi gambar
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import hook caching
import { useCachedData } from '../../hooks/useCachedData'; 

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const DUMMY_IMAGE = "https://via.placeholder.com/400x250.png/cccccc/969696?text=Image+Not+Found";

// --- KOMPONEN SKELETON SCREEN ---
const ArticleSkeleton = () => {
    const pulseAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        const sharedAnimation = Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        ]);
        Animated.loop(sharedAnimation).start();
    }, []);

    return (
        <ScrollView style={tw`flex-1 bg-gray-50`}>
            <View style={tw`px-4 py-6 max-w-3xl self-center w-full`}>
                <Animated.View style={[tw`bg-gray-200 h-8 w-3/4 rounded-md mb-3`, { opacity: pulseAnim }]} />
                <View style={tw`flex-row items-center mb-5`}>
                    <Animated.View style={[tw`bg-gray-200 h-4 w-20 rounded-md mr-3`, { opacity: pulseAnim }]} />
                    <Animated.View style={[tw`bg-gray-200 h-4 w-24 rounded-md`, { opacity: pulseAnim }]} />
                </View>
                <Animated.View style={[tw`bg-gray-200 w-full h-56 rounded-2xl mb-6`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded-md mb-3`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-200 h-4 w-full rounded-md mb-3`, { opacity: pulseAnim }]} />
                <Animated.View style={[tw`bg-gray-200 h-4 w-2/3 rounded-md mb-8`, { opacity: pulseAnim }]} />
            </View>
        </ScrollView>
    );
};

const EMOJI_OPTIONS = ['😄', '🙂', '😐', '🙁', '😠', '😢'];

const ArticleDetail = () => {
    const { slug } = useLocalSearchParams();
    const { width } = useWindowDimensions();

    // 1. MENGGUNAKAN HOOK CACHING
    const { data: cachedData, loading: isLoadingCache, error: cacheError } = useCachedData(`/articles/${slug}`);

    // State Lokal untuk sinkronisasi data cache dan update instan (setelah review)
    const [data, setData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form Review States
    const [reviewName, setReviewName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [reviewReaction, setReviewReaction] = useState('');

    // Sinkronkan data saat cache tersedia
    useEffect(() => {
        if (cachedData) setData(cachedData);
    }, [cachedData]);

    // Fungsi refresh manual khusus setelah kirim review agar komentar baru muncul
    const refreshDataManual = async () => {
        try {
            const url = `${API_BASE_URL}/articles/${slug}`;
            const response = await fetch(url);
            if (response.ok) {
                const freshData = await response.json();
                setData(freshData);
                // Update cache secara manual agar saat kembali datanya tetap terbaru
                const cacheKey = `@cache__articles_${slug.replace(/[^a-zA-Z0-9]/g, '_')}`;
                await AsyncStorage.setItem(cacheKey, JSON.stringify(freshData));
            }
        } catch (e) {
            console.error("Refresh manual error:", e);
        }
    };

    const submitReview = async () => {
        if (!reviewComment && !reviewReaction) {
            Alert.alert("Oops!", "Mohon berikan reaksi atau komentar.");
            return;
        }

        setIsSubmitting(true);
        try {
            const url = `${API_BASE_URL}/articles/${slug}/reviews`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: reviewName,
                    comment: reviewComment,
                    reaction: reviewReaction
                })
            });

            if (response.ok) {
                Alert.alert("Berhasil", "Terima kasih atas ulasan Anda!");
                setReviewName('');
                setReviewComment('');
                setReviewReaction('');
                refreshDataManual(); // Panggil refresh setelah POST berhasil
            } else {
                const result = await response.json();
                Alert.alert("Gagal", result.message || "Gagal mengirim ulasan.");
            }
        } catch (error) {
            Alert.alert("Error", "Terjadi kesalahan jaringan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Loading & Error State ---
    // Gunakan Skeleton jika data benar-benar belum ada
    if (isLoadingCache && !data) return <ArticleSkeleton />;

    if ((cacheError || !data) && !isLoadingCache) return (
        <View style={tw`flex-1 justify-center items-center p-5 bg-gray-50`}>
            <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
            <Text style={tw`text-base text-gray-600 mt-2.5 text-center px-5`}>
                {cacheError || "Artikel tidak ditemukan."}
            </Text>
            <TouchableOpacity onPress={refreshDataManual} style={tw`mt-5 bg-green-600 py-2.5 px-5 rounded-full`}>
                <Text style={tw`text-white font-bold`}>Coba Lagi</Text>
            </TouchableOpacity>
        </View>
    );

    const { article, otherArticles, reviews, reactionCounts } = data;
    const renderHTMLContentWidth = width - 32;

    const parseContentToHTML = (content) => {
        if (!content) return '';
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) {
            return content.map(block => {
                if (block.type === 'paragraph') return block.data.content;
                if (block.type === 'image' || block.type === 'image_banner') {
                    return `<img src="${block.data.url}" />`;
                }
                return '';
            }).join('');
        }
        return '';
    };

    return (
        <ScrollView style={tw`flex-1 bg-gray-50`}>
            <Stack.Screen options={{ title: 'Artikel',
                                   headerTitleStyle: tw`font-bold text-gray-800`,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f9fafb' },
             }} />

            {/* Indikator Offline (Jika error API tapi ada data cache) */}
            {cacheError && data && (
                <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
                    <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
                    <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>Mode Offline: Menampilkan versi cache</Text>
                </View>
            )}

            <View style={tw`px-4 py-6 max-w-3xl self-center w-full`}>

                {/* ===== HEADER ===== */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-2xl font-extrabold text-gray-900 leading-snug`}>
                        {article.title}
                    </Text>

                    <View style={tw`flex-row items-center mt-2`}>
                        <Text style={tw`text-xs text-gray-500`}>{article.date}</Text>
                        <Text style={tw`mx-1 text-gray-400`}>•</Text>
                        <Text style={tw`text-xs text-gray-500`}>{article.author || 'Admin'}</Text>
                    </View>
                </View>

                {/* ===== IMAGE (Optimized with expo-image) ===== */}
                <View style={tw`rounded-2xl overflow-hidden mb-6 bg-gray-200`}>
                    <Image
                        source={article.image_url || DUMMY_IMAGE}
                        style={tw`w-full h-56`}
                        contentFit="cover"
                        transition={500}
                    />
                </View>

                {/* ===== CONTENT ===== */}
                <View style={tw`mb-8`}>
                    <RenderHTML
                        contentWidth={renderHTMLContentWidth}
                        source={{ html: parseContentToHTML(article.content) }}
                        tagsStyles={{
                            p: tw`text-gray-700 text-[15px] leading-7 mb-5`,
                            h1: tw`text-xl font-bold mb-3`,
                            h2: tw`text-lg font-bold mb-2`,
                            img: tw`rounded-xl my-6`,
                        }}
                    />
                </View>

                {/* ===== ARTIKEL LAIN ===== */}
                {otherArticles && otherArticles.length > 0 && (
                    <View style={tw`mb-8`}>
                        <View style={tw`flex-row justify-between items-center mb-4 border-b border-gray-200 pb-2`}>
                            <Text style={tw`font-bold text-gray-900 text-base`}>ARTIKEL LAIN</Text>
                            <Link href="/articles" asChild>
                                <TouchableOpacity style={tw`p-1`}>
                                    <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </Link>
                        </View>

                        {otherArticles.map((oa) => (
                            <Link key={oa.id} href={`/articles/${oa.slug}`} asChild>
                                <TouchableOpacity style={tw`flex-row gap-3 mb-4 bg-white p-3 rounded-xl shadow-sm`}>
                                    <Image
                                        source={oa.image_url}
                                        style={tw`w-24 h-20 rounded-lg bg-gray-100`}
                                        contentFit="cover"
                                        transition={300}
                                    />
                                    <View style={tw`flex-1 justify-between`}>
                                        <Text style={tw`font-semibold text-sm text-gray-800`} numberOfLines={3}>
                                            {oa.title}
                                        </Text>
                                        <View style={tw`flex-row justify-between items-center mt-1`}>
                                            <Text style={tw`text-xs text-gray-500`} numberOfLines={1}>
                                                By {oa.author || 'Admin'}
                                            </Text>
                                            <View style={tw`flex-row items-center`}>
                                                <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                                                <Text style={tw`text-xs text-gray-400 ml-1`}>{oa.date}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </View>
                )}

                {/* ===== FORM KOMENTAR ===== */}
                <View style={tw`mb-10`}>
                    <View style={tw`flex-row justify-between items-center mb-4 border-b border-gray-200 pb-2`}>
                        <Text style={tw`font-bold text-gray-900 text-base`}>ULASAN ARTIKEL</Text>
                    </View>

                    <View style={tw`flex-row justify-between mb-3`}>
                        {EMOJI_OPTIONS.map((emoji) => (
                            <TouchableOpacity
                                key={emoji}
                                onPress={() => setReviewReaction(reviewReaction === emoji ? null : emoji)}
                                style={tw`flex-1 items-center ${reviewReaction === emoji ? 'scale-110' : 'opacity-60'}`}
                            >
                                <Text style={{ fontSize: 24 }}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={tw`bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3`}
                        placeholder="Tulis komentar..."
                        multiline
                        value={reviewComment}
                        onChangeText={setReviewComment}
                    />

                    {reviewComment.length > 0 && (
                        <TextInput
                            style={tw`bg-white border border-gray-200 rounded-xl px-4 py-2 mb-3 text-xs`}
                            placeholder="Nama Anda (Opsional)"
                            value={reviewName}
                            onChangeText={setReviewName}
                        />
                    )}

                    <TouchableOpacity
                        style={tw`${isSubmitting ? 'bg-gray-400' : 'bg-green-600'} py-3 rounded-xl items-center`}
                        onPress={submitReview}
                        disabled={isSubmitting}
                    >
                        <Text style={tw`text-white font-bold`}>
                            {isSubmitting ? 'Mengirim...' : 'Kirim'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ===== REACTIONS ===== */}
                <View style={tw`mb-8`}>
                    <Text style={tw`font-bold text-gray-900 mb-3`}>Reaksi Pembaca</Text>
                    <View style={tw`flex-row justify-between px-2`}>
                        {[
                            { emoji: '😄', count: reactionCounts?.grinning || 0 },
                            { emoji: '🙂', count: reactionCounts?.smiling || 0 },
                            { emoji: '😐', count: reactionCounts?.neutral || 0 },
                            { emoji: '🙁', count: reactionCounts?.frowning || 0 },
                            { emoji: '😠', count: reactionCounts?.angry || 0 },
                            { emoji: '😢', count: reactionCounts?.crying || 0 },
                        ].map((item, index) => (
                            <View key={index} style={tw`items-center`}>
                                <Text style={tw`text-2xl mb-1`}>{item.emoji}</Text>
                                <Text style={tw`text-sm text-gray-600 font-medium`}>{item.count}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ===== KOMENTAR ===== */}
                <View style={tw`mb-10`}>
                    <Text style={tw`font-bold text-gray-900 mb-4`}>
                        Komentar ({reviews?.length || 0})
                    </Text>

                    {reviews?.length === 0 ? (
                        <Text style={tw`text-gray-400 italic`}>Belum ada komentar</Text>
                    ) : (
                        reviews?.map((rev) => (
                            <View key={rev.id} style={tw`mb-5 pb-4 border-b border-gray-100`}>
                                <View style={tw`flex-row gap-3`}>
                                    <View style={tw`w-9 h-9 rounded-full bg-[#ff6b6b] items-center justify-center`}>
                                        <Text style={tw`text-white font-bold`}>
                                            {rev.name ? rev.name[0] : 'A'}
                                        </Text>
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`font-bold text-sm`}>{rev.name || 'User'}</Text>
                                        {rev.reaction && <Text style={tw`text-sm mt-1`}>{rev.reaction}</Text>}
                                        <Text style={tw`text-gray-600 text-sm mt-1 leading-relaxed`}>{rev.comment}</Text>
                                        <Text style={tw`text-gray-400 text-xs mt-1`}>{rev.date}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>

            </View>
        </ScrollView>
    );
};

export default ArticleDetail;