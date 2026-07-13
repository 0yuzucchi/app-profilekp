import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    TextInput,
    StyleSheet
} from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import FloatingAIButton from '../../components/FloatingAIButton';
import tw from 'twrnc';

// Import hook caching
import { useCachedData } from '../../hooks/useCachedData';

// --- KOMPONEN SKELETON ---
const ArticleSkeleton = () => {
    const pulseAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const SkeletonBox = ({ style }) => (
        <Animated.View style={[style, tw`bg-gray-200 rounded-lg`, { opacity: pulseAnim }]} />
    );

    return (
        // --- PERUBAHAN: pt-8 menjadi pt-4 ---
        <View style={tw`w-full max-w-6xl self-center px-4 pt-4`}>
            <SkeletonBox style={tw`h-6 w-48 mb-6`} />
            <View style={tw`mb-10`}>
                <SkeletonBox style={tw`w-full aspect-video mb-4`} />
                <SkeletonBox style={tw`h-3 w-20 mb-2`} />
                <SkeletonBox style={tw`h-6 w-full mb-2`} />
                <SkeletonBox style={tw`h-4 w-2/3`} />
            </View>
            <View style={tw`flex-col gap-4 mb-10`}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={tw`flex-row items-start`}>
                        <SkeletonBox style={tw`w-20 h-15 mr-3`} />
                        <View style={tw`flex-1 gap-2`}>
                            <SkeletonBox style={tw`h-4 w-full`} />
                            <SkeletonBox style={tw`h-3 w-16`} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

// --- BARU: Komponen Header Animasi (didefinisikan di luar) ---
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
            {/* Judul Halaman yang dianimasikan - text-xl */}
            <Animated.Text 
                style={[tw`font-bold text-gray-800 text-xl`, styles.headerTitle, { opacity: titleOpacity }]}
                numberOfLines={1}
            >
                Artikel & Berita
            </Animated.Text>

            {/* Search Bar yang dianimasikan */}
            <Animated.View style={[tw`absolute right-0 flex-row items-center bg-gray-100 rounded-full h-full`, { width: searchWidth, opacity: searchOpacity }]}>
                <Ionicons name="search" size={20} color="#9ca3af" style={tw`pl-3 pr-2`} />
                <TextInput
                    ref={searchInputRef}
                    style={tw`flex-1 h-full text-gray-700 font-medium`}
                    placeholder="Cari artikel..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </Animated.View>
        </View>
    );
};

export default function ArticlesList() {
    const { data: cachedArticles, loading, error } = useCachedData('/articles');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

    // --- BARU: Refs untuk animasi dan input ---
    const searchInputRef = useRef(null);
    const searchAnim = useRef(new Animated.Value(0)).current;

    const allArticles = useMemo(() => cachedArticles || [], [cachedArticles]);

    const filteredArticles = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return allArticles;
        return allArticles.filter(article =>
            (article.title || '').toLowerCase().includes(query) ||
            (article.author || '').toLowerCase().includes(query)
        );
    }, [allArticles, searchQuery]);

    // --- BARU: Effect untuk animasi search bar ---
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

    // Logika Pagination (Tetap sama)
    const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
    const subFeaturedArticles = filteredArticles.length > 1 ? filteredArticles.slice(1, 4) : [];
    const rawLatestArticles = filteredArticles.length > 4 ? filteredArticles.slice(4) : [];
    const totalPages = Math.ceil(rawLatestArticles.length / itemsPerPage);
    const displayedLatestArticles = rawLatestArticles.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const paginate = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    if (loading && allArticles.length === 0) {
        return (
            <View style={tw`flex-1 bg-gray-50`}>
                <Stack.Screen options={{ title: "Artikel & Berita" }} />
                <ArticleSkeleton />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Stack.Screen
                options={{
                    // --- PERUBAHAN PADA HEADER ---
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

            {/* Banner Offline */}
            {error && allArticles.length > 0 && (
                <View style={tw`bg-amber-100 py-2 px-4 flex-row items-center justify-center`}>
                    <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
                    <Text style={tw`text-[11px] text-amber-800 ml-2 font-medium`}>Mode Offline: Menampilkan data terakhir</Text>
                </View>
            )}

            {/* --- DIHAPUS: Search bar absolut lama sudah tidak diperlukan --- */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={tw`flex-1`}
                // --- PERUBAHAN: pt-8 menjadi pt-4 ---
                contentContainerStyle={tw`pb-20 pt-4`}
            >
                <View style={tw`w-full max-w-6xl self-center px-4`}>
                    {allArticles.length === 0 && !loading ? (
                        <View style={tw`w-full flex-col items-center justify-center min-h-[400px] bg-white rounded-[30px] border border-dashed border-gray-200 p-8`}>
                            <Ionicons name="newspaper-outline" size={48} color="#9ca3af" />
                            <Text style={tw`text-xl font-bold text-gray-700 mt-4 text-center`}>Belum Ada Artikel</Text>
                        </View>
                    ) : (
                        <>
                            {featuredArticle && (
                                <View>
                                    <Text style={tw`text-xl font-bold text-gray-900 uppercase mb-6 border-l-4 border-green-600 pl-3`}>
                                        ARTIKEL TERBARU
                                    </Text>

                                    <View style={tw`mb-10`}>
                                        <Link href={`/articles/${featuredArticle.slug}`} asChild>
                                            <TouchableOpacity activeOpacity={0.7}>
                                                <View style={tw`w-full aspect-video overflow-hidden rounded-xl mb-4 bg-gray-100 shadow-sm`}>
                                                    <Image 
                                                        source={featuredArticle.image_path} 
                                                        style={tw`w-full h-full`} 
                                                        contentFit="cover"
                                                        transition={500}
                                                    />
                                                </View>
                                                <View style={tw`px-1`}>
                                                    <Text style={tw`text-xs font-semibold text-gray-500 mb-2`}>{featuredArticle.date}</Text>
                                                    <Text style={tw`text-xl font-bold text-gray-900 uppercase mb-2`} numberOfLines={2}>{featuredArticle.title}</Text>
                                                    <Text style={tw`text-sm text-gray-600`} numberOfLines={3}>
                                                        {featuredArticle.excerpt || featuredArticle.content?.substring(0, 180)}...
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </Link>
                                    </View>

                                    {subFeaturedArticles.length > 0 && (
                                        <View style={tw`flex-col gap-4 my-2`}>
                                            {subFeaturedArticles.map((item, index) => (
                                                <Link key={item.id || index} href={`/articles/${item.slug}`} asChild>
                                                    <TouchableOpacity style={tw`w-full flex-row items-start`} activeOpacity={0.7}>
                                                        <View style={tw`w-24 h-18 overflow-hidden rounded-lg mr-3 bg-gray-100`}>
                                                            <Image 
                                                                source={item.image_path} 
                                                                style={tw`w-full h-full`} 
                                                                contentFit="cover"
                                                                transition={500}
                                                            />
                                                        </View>
                                                        <View style={tw`flex-1`}>
                                                            <Text style={tw`font-bold text-gray-900 text-sm mb-1 leading-5`} numberOfLines={2}>{item.title}</Text>
                                                            <Text style={tw`text-gray-400 text-[10px]`}>{item.author || 'Admin Klinik'}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </Link>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={tw`border-t border-gray-200 mt-10 pt-10`}>
                                {rawLatestArticles.length > 0 && (
                                    <>
                                        <Text style={tw`text-xl font-bold text-gray-900 mb-6`}>ARTIKEL LAINNYA</Text>
                                        <View style={tw`flex-col gap-8`}>
                                            {displayedLatestArticles.map((article, index) => (
                                                <Link key={article.id || index} href={`/articles/${article.slug}`} asChild>
                                                    <TouchableOpacity activeOpacity={0.7}>
                                                        <View style={tw`w-full aspect-video overflow-hidden rounded-xl bg-gray-100 mb-4`}>
                                                            <Image 
                                                                source={article.image_path} 
                                                                style={tw`w-full h-full`} 
                                                                contentFit="cover"
                                                                transition={500}
                                                            />
                                                        </View>
                                                        <View style={tw`px-1`}>
                                                            <Text style={tw`text-[10px] text-gray-500 mb-2`}>{article.date}</Text>
                                                            <Text style={tw`text-lg font-bold text-gray-900 mb-2`} numberOfLines={2}>{article.title}</Text>
                                                            <Text style={tw`text-sm text-gray-600`} numberOfLines={3}>
                                                                {article.excerpt || article.content?.substring(0, 150)}...
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </Link>
                                            ))}
                                        </View>

                                        {totalPages > 1 && (
                                            <View style={tw`mt-12 pt-8 border-t border-gray-100 items-center`}>
                                                <View style={tw`flex-row items-center gap-3`}>
                                                    <TouchableOpacity 
                                                        onPress={() => paginate(page - 1)} 
                                                        disabled={page === 1} 
                                                        style={tw`w-10 h-10 items-center justify-center rounded-full ${page === 1 ? 'bg-gray-100' : 'bg-green-600 shadow-sm'}`}
                                                    >
                                                        <Ionicons name="chevron-back" size={20} color={page === 1 ? '#d1d5db' : 'white'} />
                                                    </TouchableOpacity>
                                                    
                                                    <View style={tw`px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm`}>
                                                        <Text style={tw`font-bold text-gray-800`}>{page} <Text style={tw`text-gray-400 font-normal`}>/ {totalPages}</Text></Text>
                                                    </View>

                                                    <TouchableOpacity 
                                                        onPress={() => paginate(page + 1)} 
                                                        disabled={page === totalPages} 
                                                        style={tw`w-10 h-10 items-center justify-center rounded-full ${page === totalPages ? 'bg-gray-100' : 'bg-green-600 shadow-sm'}`}
                                                    >
                                                        <Ionicons name="chevron-forward" size={20} color={page === totalPages ? '#d1d5db' : 'white'} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
            
            <FloatingAIButton /> 
        </View>
    );
}

// --- BARU: Stylesheet untuk header ---
const styles = StyleSheet.create({
    headerTitle: {
        position: 'absolute',
        left: 0,
    }
});