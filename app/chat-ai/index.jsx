import React, { useState, useRef, useEffect } from 'react';
import { 
    View, Text, FlatList, TextInput, TouchableOpacity, 
    Image, Modal, ScrollView, Platform, ActivityIndicator, 
    Keyboard, Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
import tw from 'twrnc';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const KLINIK_LOGO = "https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png";

const SUGGESTION_CATEGORIES = [
    {
        title: "Dokter & Jadwal",
        icon: "calendar-clock",
        items: ["Jadwal dokter hari ini", "Daftar semua dokter", "Dokter yang praktik hari Senin", "Jam operasional klinik"]
    },
    {
        title: "Pendaftaran",
        icon: "clipboard-text-outline",
        items: ["Nomor WhatsApp Pendaftaran", "Bagaimana cara daftar?", "Syarat pendaftaran BPJS"]
    },
    {
        title: "Layanan & Poli",
        icon: "stethoscope",
        items: ["Daftar layanan medis", "Layanan Poli Umum", "Cek Laboratorium", "Layanan KIA & KB"]
    },
    {
        title: "Fasilitas & Lokasi",
        icon: "hospital-building",
        items: ["Alamat lengkap klinik", "Fasilitas di klinik", "Ada ruang rawat inap?"]
    }
];

// --- FUNGSI FORMATTING DAN SANITASI TEKS ---
// Mengubah list dengan tanda bullet (*, -, •) menjadi penomoran, dan menghapus sisa asterisk (*) bold/italic
const cleanAndFormatResponse = (text) => {
    if (!text) return "";
    
    const lines = text.split('\n');
    let listCounter = 1;
    
    let formattedLines = lines.map((line) => {
        const trimmed = line.trim();
        
        // Deteksi jika baris diawali oleh tanda list/bullet
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('+') || trimmed.startsWith('*')) {
            // Hapus penanda bullet di awal baris saja
            let content = trimmed.replace(/^[\-\•\+\*]\s*/, "");
            // Hapus sisa-sisa tanda asterisk (*)
            content = content.replace(/\*/g, "");
            
            const formattedLine = `${listCounter}. ${content}`;
            listCounter++;
            return formattedLine;
        } else {
            // Reset counter jika menjumpai baris kosong agar urutan list berikutnya mulai dari 1 lagi
            if (trimmed === "") {
                listCounter = 1;
            }
            // Hapus sisa-sisa asterisk untuk baris biasa
            return line.replace(/\*/g, "");
        }
    });

    return formattedLines.join('\n');
};

// --- DATABASE GEJALA & SISTEM TRIAGE LOKAL ---
// Berfungsi memberikan diagnosis administratif/triage awal yang detail dan to-the-point
const checkLocalTriage = (queryText) => {
    const text = queryText.toLowerCase();

    // 1. Kasus Gigi dan Mulut
    if (text.includes('gigi') || text.includes('gusi') || text.includes('geraham') || 
        text.includes('karang gigi') || text.includes('tambal') || text.includes('cabut') || 
        text.includes('scaling') || text.includes('behel')) {
        return `Untuk keluhan atau pemeriksaan kesehatan gigi dan mulut, Anda disarankan untuk melakukan pemeriksaan di Poli Gigi Klinik Pratama UNIMUS.\n\nDokter Gigi yang bertugas di klinik kami:\n1. drg. Etny Dyah Harniati, MDSc\n2. Didukung oleh Tim Dokter Gigi Spesialis dari RSGM UNIMUS\n\nLayanan di Poli Gigi meliputi:\n1. Pembersihan karang gigi (scaling)\n2. Penambalan gigi berlubang\n3. Pencabutan gigi\n4. Perawatan saluran akar dan gusi`;
    }

    // 2. Kasus KIA, Kehamilan, KB & Anak
    if (text.includes('hamil') || text.includes('kandungan') || text.includes('suntik kb') || 
        text.includes('pil kb') || text.includes('iud') || text.includes('imunisasi') || 
        text.includes('kia') || text.includes('reproduksi') || text.includes('bidan') || 
        text.includes('melahirkan') || text.includes('anak sakit') || text.includes('balita')) {
        return `Untuk pemeriksaan kehamilan, program KB, imunisasi bayi, maupun kesehatan anak, Anda disarankan langsung mengunjungi Poli Kesehatan Ibu dan Anak (KIA) & KB.\n\nLayanan ini ditangani langsung oleh Bidan Profesional Klinik Pratama UNIMUS.\n\nLayanan yang tersedia:\n1. Pemeriksaan kehamilan rutin (ANC)\n2. Pelayanan KB lengkap (Suntik KB, Pil KB, Implan, IUD)\n3. Imunisasi dasar lengkap untuk bayi dan balita\n4. Konsultasi kesehatan reproduksi`;
    }

    // 3. Kasus Fisik Umum (Pusing, mual, demam, maag, tensi, dll.)
    const generalKeywords = [
        'pusing', 'mual', 'muntah', 'demam', 'panas', 'batuk', 'pilek', 'flu', 
        'diare', 'mencret', 'lemas', 'sakit perut', 'nyeri', 'lambung', 'maag', 
        'sesak', 'tensi', 'dokter umum', 'poli umum', 'siapa dokter', 'dokter apa'
    ];
    
    if (generalKeywords.some(keyword => text.includes(keyword))) {
        return `Untuk keluhan fisik umum seperti pusing, mual, demam, maag, atau pemeriksaan tensi, Anda disarankan untuk memeriksakan diri ke Poli Umum.\n\nDokter Umum profesional yang bertugas di Klinik Pratama UNIMUS:\n1. dr. Chamim Faizin, M.M.R. (Direktur Klinik)\n2. dr. Rochman Basuki\n3. dr. Hamim\n\nJadwal operasional Poli Umum:\n1. Hari pelayanan: Senin sampai Sabtu\n2. Sesi Pagi: Jam 08.00 - 12.00 WIB\n3. Sesi Sore: Jam 16.00 - 20.00 WIB\n\nSilakan datang langsung ke klinik atau lakukan pendaftaran agar kami dapat segera membantu menangani keluhan Anda.`;
    }

    return null;
};

// --- SISTEM FALLBACK RESPON ---
// Digunakan apabila pertanyaan tidak relevan atau terjadi kegagalan sistem/API
const getFallbackResponse = (queryText) => {
    return `Maaf, saya tidak dapat menemukan informasi spesifik mengenai "${queryText}" di database admin kami saat ini.\n\nAgar Anda mendapatkan bantuan yang tepat, silakan hubungi kontak atau layanan resmi kami berikut:\n\n1. Layanan WhatsApp Pendaftaran Klinik Pratama UNIMUS: 0878-5758-0214\n2. Alamat Klinik langsung: Jl. Petek No. 2, Dadapsari, Semarang Utara\n3. Sesi Poli Umum: Senin - Sabtu pukul 08.00 - 20.00 WIB\n4. Sesi Poli Gigi: Beroperasi dengan sistem janji temu berkala\n\nSilakan ajukan pertanyaan lain seputar Jadwal Dokter, Syarat Pendaftaran BPJS, atau Fasilitas Klinik.`;
};

export default function ChatAIInterface() {
    const router = useRouter();
    const [messages, setMessages] = useState([
        { 
            from: 'ai', 
            text: "Assalamu'alaikum! 👋\nSaya asisten virtual Klinik Pratama UNIMUS.\n\nSaya siap membantu memberikan informasi terkait Jadwal Dokter, Layanan Medis, dan Fasilitas.\n\nAda yang bisa saya bantu hari ini?",
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [disclaimerVisible, setDisclaimerVisible] = useState(true);
    const [showFullMenu, setShowFullMenu] = useState(false); 
    const [isOffline, setIsOffline] = useState(false);
    
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const flatListRef = useRef();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const onKeyboardShow = (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        };
        
        const onKeyboardHide = () => {
            setKeyboardHeight(0);
        };

        const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
        const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const scrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    const submitQuery = async (queryText) => {
        if (isOffline) {
            Alert.alert("Koneksi Terputus", "Mohon periksa internet Anda untuk menggunakan layanan Chat AI.");
            return;
        }

        const textToSend = queryText || input;
        if (!textToSend.trim() || isLoading) return;

        setShowFullMenu(false);
        const userMessage = { from: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');

        // 1. Cek sistem triage & gejala lokal terlebih dahulu untuk akurasi data internal klinik
        const localResponse = checkLocalTriage(textToSend);

        if (localResponse) {
            setTimeout(() => {
                setMessages(prev => [...prev, { from: 'ai', text: cleanAndFormatResponse(localResponse) }]);
                setIsLoading(false);
                scrollToBottom();
            }, 800); // Simulasi jeda respon AI
            return;
        }

        // 2. Kirim ke API eksternal jika pertanyaan tidak masuk kategori triage lokal
        try {
            const response = await fetch(`${API_BASE_URL}/clinic-ai/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: textToSend }),
            });
            
            if (!response.ok) throw new Error("Gagal mengambil data dari server");
            
            const data = await response.json();
            const rawReply = data?.reply?.text || data?.text || "";

            if (rawReply.trim()) {
                setMessages(prev => [...prev, { from: 'ai', text: cleanAndFormatResponse(rawReply) }]);
            } else {
                setMessages(prev => [...prev, { from: 'ai', text: getFallbackResponse(textToSend) }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { from: 'ai', text: getFallbackResponse(textToSend) }]);
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* --- OVERLAY OFFLINE --- */}
            {isOffline && (
                <View style={[tw`absolute inset-0 z-100 flex-1 justify-center items-center px-10`, { backgroundColor: 'rgba(249, 250, 251, 0.95)' }]}>
                    <Ionicons name="cloud-offline-outline" size={80} color="#d1d5db" />
                    <Text style={tw`text-xl font-bold text-gray-800 mt-5 text-center`}>Tidak Ada Koneksi</Text>
                    <Text style={tw`text-sm text-gray-500 mt-2 text-center leading-5`}>
                        Layanan Chat AI memerlukan koneksi internet aktif. Halaman akan terbuka otomatis saat Anda kembali online.
                    </Text>
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        style={tw`mt-8 border border-gray-300 px-8 py-2 rounded-full`}
                    >
                        <Text style={tw`text-gray-600 font-bold`}>KEMBALI</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* --- MODAL DISCLAIMER --- */}
            <Modal visible={disclaimerVisible} transparent animationType="fade">
                <View style={[tw`flex-1 justify-center items-center px-6`, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <View style={tw`bg-white rounded-3xl w-full overflow-hidden shadow-2xl`}>
                        <View style={tw`bg-green-600 p-4`}>
                            <Text style={tw`text-white font-bold text-center uppercase tracking-widest`}>Disclaimer</Text>
                        </View>
                        <View style={tw`p-6`}>
                            <Text style={tw`text-gray-800 font-bold mb-3`}>Harap perhatikan:</Text>
                            <Text style={tw`text-gray-600 text-sm leading-5 mb-2`}>• AI ini HANYA untuk informasi administratif.</Text>
                            <Text style={tw`text-gray-600 text-sm leading-5 mb-2`}>• AI TIDAK DAPAT memberikan diagnosis medis.</Text>
                            <Text style={tw`text-gray-600 text-sm leading-5 mb-6`}>• Untuk darurat, hubungi IGD terdekat.</Text>
                            <TouchableOpacity 
                                onPress={() => setDisclaimerVisible(false)}
                                style={tw`bg-green-600 py-3 rounded-full shadow-md`}
                            >
                                <Text style={tw`text-white text-center font-bold`}>SAYA SETUJU</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* --- HEADER --- */}
            <LinearGradient colors={['#064e3b', '#00b050']} style={tw`pt-12 pb-4 px-4 shadow-lg`}>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={() => router.back()} style={tw`p-2 bg-black/20 rounded-full mr-3`}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={tw`w-10 h-10 bg-white rounded-full mr-3`}>
                        <Image source={{ uri: KLINIK_LOGO }} style={tw`w-full h-full`} resizeMode="contain" />
                    </View>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-white font-bold text-base`}>AI Assistant</Text>
                        <Text style={tw`text-green-100 text-[10px]`}>Klinik Pratama Unimus</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowFullMenu(true)} style={tw`p-2`}>
                        <Ionicons name="apps" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* --- CHAT AREA --- */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                style={tw`flex-1`}
                contentContainerStyle={tw`p-4 pb-6`}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
                renderItem={({ item }) => (
                    <View style={tw`mb-5 ${item.from === 'user' ? 'items-end' : 'items-start'}`}>
                        <View style={tw`flex-row ${item.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <View style={tw`w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center`}>
                                {item.from === 'user' ? 
                                    <Ionicons name="person" size={16} color="#9ca3af" /> : 
                                    <Image source={{ uri: KLINIK_LOGO }} style={tw`w-7 h-7`} resizeMode="contain" />
                                }
                            </View>
                            <View style={[
                                tw`max-w-[80%] mx-2 p-3 rounded-2xl shadow-sm`,
                                item.from === 'user' ? tw`bg-green-600 rounded-tr-none` : tw`bg-white rounded-tl-none border border-gray-200`
                            ]}>
                                <Text style={tw`${item.from === 'user' ? 'text-white' : 'text-gray-800'} text-[14px] leading-5`}>
                                    {item.text}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                ListFooterComponent={isLoading && (
                    <View style={tw`flex-row ml-2 mb-4 items-center`}>
                        <ActivityIndicator color="#00b050" size="small" />
                        <Text style={tw`text-gray-400 text-xs ml-2 italic`}>AI sedang mengetik...</Text>
                    </View>
                )}
            />

            {/* --- INPUT & CHIPS AREA --- */}
            <View style={tw`bg-white border-t border-gray-200`}>
                {!isLoading && (
                    <View style={tw`bg-gray-50/50 border-b border-gray-100`}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-4 py-3 items-center`}>
                            <MaterialCommunityIcons name="lightbulb-on" size={18} color="#eab308" style={tw`mr-2`} />
                            {SUGGESTION_CATEGORIES[0].items.concat(SUGGESTION_CATEGORIES[1].items.slice(0,2)).map((q, i) => (
                                <TouchableOpacity 
                                    key={i} 
                                    onPress={() => submitQuery(q)}
                                    style={tw`bg-white border border-green-200 px-4 py-1.5 rounded-full mr-2 shadow-sm`}
                                >
                                    <Text style={tw`text-green-700 text-[11px] font-bold`}>{q}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={[
                    tw`flex-row items-center p-3`,
                    { paddingBottom: keyboardHeight > 0 ? 12 : 24 }
                ]}> 
                    <TextInput
                        style={tw`flex-1 bg-gray-100 rounded-full px-5 py-3 text-gray-800 text-sm min-h-12`}
                        placeholder={isOffline ? "Sedang offline..." : "Ketik pertanyaan Anda..."}
                        value={input}
                        onChangeText={setInput}
                        editable={!isLoading && !isOffline}
                    />
                    <TouchableOpacity 
                        onPress={() => submitQuery()}
                        disabled={isLoading || !input.trim() || isOffline}
                        style={tw`ml-2 w-12 h-12 bg-green-600 rounded-full items-center justify-center shadow-md ${( !input.trim() || isLoading || isOffline) ? 'opacity-30' : 'opacity-100'}`}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- PHYSICAL KEYBOARD SPACER --- */}
            <View style={{ height: keyboardHeight }} />

            {/* --- FULL MENU MODAL --- */}
            <Modal visible={showFullMenu} animationType="slide" transparent>
                <View style={tw`flex-1 justify-end`}>
                    <TouchableOpacity style={tw`flex-1 bg-black/50`} onPress={() => setShowFullMenu(false)} />
                    <View style={tw`bg-white rounded-t-3xl h-[75%] p-6`}>
                        <View style={tw`flex-row justify-between items-center mb-6`}>
                            <Text style={tw`text-lg font-bold text-gray-800`}>Pilih Topik Pertanyaan</Text>
                            <TouchableOpacity onPress={() => setShowFullMenu(false)}>
                                <Ionicons name="close-circle" size={28} color="#d1d5db" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {SUGGESTION_CATEGORIES.map((cat, i) => (
                                <View key={i} style={tw`mb-6`}>
                                    <View style={tw`flex-row items-center mb-3`}>
                                        <MaterialCommunityIcons name={cat.icon} size={20} color="#00b050" />
                                        <Text style={tw`ml-2 text-sm font-black text-green-800 uppercase tracking-widest`}>{cat.title}</Text>
                                    </View>
                                    <View style={tw`flex-row flex-wrap`}>
                                        {cat.items.map((q, idx) => (
                                            <TouchableOpacity 
                                                key={idx} 
                                                onPress={() => submitQuery(q)}
                                                style={tw`bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl mr-2 mb-2`}
                                            >
                                                <Text style={tw`text-gray-700 text-xs`}>{q}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}