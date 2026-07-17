

// // app/registration.jsx
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, Linking, Alert, AppState } from 'react-native';
// import { Stack, useNavigation } from 'expo-router';
// import { useFocusEffect } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import tw from 'twrnc';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Kunci unik untuk menyimpan data di AsyncStorage
// const DRAFT_KEY = '@RegistrationFormDraft';

// export default function RegistrationIndex() {
//     const navigation = useNavigation();
//     const WHATSAPP_NUMBER = '6289675873994';
//     const hasSubmitted = useRef(false); // Ref untuk menandai jika form sudah disubmit

//     const [formData, setFormData] = useState({
//         kategori: 'Pasien Baru',
//         nama: '',
//         noBpjs: '',
//         alamat: '',
//         noHp: '',
//         keluhan: ''
//     });

//     // --- FUNGSI UNTUK DRAFT ---

//     // Fungsi untuk memuat draft dari penyimpanan
//     const loadDraft = async () => {
//         try {
//             const draftJson = await AsyncStorage.getItem(DRAFT_KEY);
//             if (draftJson) {
//                 setFormData(JSON.parse(draftJson));
//             }
//         } catch (e) {
//             console.error("Gagal memuat draft:", e);
//         }
//     };

//     // Fungsi untuk menyimpan draft ke penyimpanan
//     const saveDraft = async (data) => {
//         try {
//             await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(data));
//         } catch (e) {
//             console.error("Gagal menyimpan draft:", e);
//         }
//     };

//     // Fungsi untuk membersihkan draft
//     const clearDraft = async () => {
//         try {
//             await AsyncStorage.removeItem(DRAFT_KEY);
//         } catch (e) {
//             console.error("Gagal membersihkan draft:", e);
//         }
//     };

//     // --- EFEK LIFECYCLE ---

//     // 1. Muat draft saat komponen pertama kali dibuka
//     useEffect(() => {
//         loadDraft();
//     }, []);

//     // 2. Simpan draft setiap kali ada perubahan pada form (setelah 1 detik)
//     useEffect(() => {
//         // Cek apakah ada data yang perlu disimpan
//         const hasData = formData.nama || formData.noHp || formData.keluhan;
//         if (!hasData) return;

//         // Debounce: Tunda penyimpanan selama 1 detik setelah user berhenti mengetik
//         const handler = setTimeout(() => {
//             saveDraft(formData);
//         }, 1000);

//         // Cleanup function untuk membatalkan timeout jika user terus mengetik
//         return () => clearTimeout(handler);
//     }, [formData]);


//     // 3. Logika untuk konfirmasi keluar halaman
//     useFocusEffect(
//         useCallback(() => {
//             // Reset status submit setiap kali halaman menjadi fokus
//             hasSubmitted.current = false;

//             const onBeforeRemove = (e) => {
//                 // Cek apakah ada data yang belum disimpan
//                 const hasUnsavedChanges = formData.nama || formData.noHp || formData.alamat || formData.keluhan;
                
//                 // Jika tidak ada perubahan atau form sudah disubmit, izinkan keluar
//                 if (!hasUnsavedChanges || hasSubmitted.current) {
//                     return;
//                 }

//                 // Mencegah aksi kembali (back) default
//                 e.preventDefault();

//                 // Tampilkan Alert konfirmasi
//                 Alert.alert(
//                     'Tinggalkan Halaman?',
//                     'Anda memiliki isian yang belum terkirim. Apa yang ingin Anda lakukan?',
//                     [
//                         { 
//                             text: 'Tetap di Sini', 
//                             style: 'cancel', 
//                             onPress: () => {} 
//                         },
//                         {
//                             text: 'Keluar Saja',
//                             style: 'destructive',
//                             onPress: async () => {
//                                 await clearDraft(); // Hapus draft
//                                 navigation.dispatch(e.data.action); // Lanjutkan aksi keluar
//                             },
//                         },
//                         {
//                             text: 'Simpan & Keluar',
//                             style: 'default',
//                             onPress: async () => {
//                                 await saveDraft(formData); // Pastikan data terakhir tersimpan
//                                 navigation.dispatch(e.data.action); // Lanjutkan aksi keluar
//                             },
//                         },
//                     ]
//                 );
//             };

//             // Tambahkan event listener saat screen fokus
//             navigation.addListener('beforeRemove', onBeforeRemove);

//             // Hapus event listener saat screen tidak lagi fokus
//             return () => navigation.removeListener('beforeRemove', onBeforeRemove);

//         }, [navigation, formData]) // Dependency: re-run jika formData berubah
//     );


//     // --- HANDLER ---

//     const handleChange = (name, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async () => {
//         if (!formData.nama || !formData.noHp || !formData.alamat || !formData.keluhan) {
//             Alert.alert("Data Tidak Lengkap", "Mohon lengkapi kolom yang wajib diisi (*)");
//             return;
//         }

//         const message = `*PENDAFTARAN ONLINE KLINIK PRATAMA UNIMUS*
// ----------------------------------------
// Halo Admin, saya ingin mendaftar dengan data berikut:

// *Kategori:* ${formData.kategori}
// *Nama Pasien:* ${formData.nama}
// *Nomor BPJS:* ${formData.noBpjs || '-'}
// *Alamat:* ${formData.alamat}
// *No. HP/WA:* ${formData.noHp}

// *Keluhan:* 
// ${formData.keluhan}

// Mohon konfirmasinya, Terima kasih.`;
//         const encodedMessage = encodeURIComponent(message);
//         const waUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

//         try {
//             const supported = await Linking.canOpenURL(waUrl);
//             hasSubmitted.current = true; // Tandai form akan disubmit
//             await clearDraft(); // Hapus draft karena sudah berhasil dikirim
            
//             if (supported) {
//                 await Linking.openURL(waUrl);
//             } else {
//                 await Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`);
//             }
//         } catch (err) {
//             hasSubmitted.current = false; // Batalkan status submit jika gagal
//             Alert.alert("Error", "Gagal membuka WhatsApp. Pastikan aplikasi terinstal.");
//             console.error(err);
//         }
//     };


//     return (
//         <ScrollView style={tw`flex-1 bg-gray-100`} showsVerticalScrollIndicator={false}>
//             <Stack.Screen options={{ title: 'Form Pendaftaran' }} />

//             {/* HEADER SECTION */}
//             <ImageBackground 
//                 source={{ uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp' }}
//                 style={tw`w-full pt-10 pb-16 bg-[#00a651]`}
//                 imageStyle={{ opacity: 0.2 }}
//             >
//                 <View style={tw`px-5 items-center`}>
//                     <Text style={tw`text-2xl font-bold text-white mb-2`}>Pendaftaran Pasien</Text>
//                     <Text style={tw`text-xs text-white/90 text-center leading-5`}>
//                         Silakan lengkapi formulir di bawah ini. Data akan otomatis terformat ke WhatsApp Admin.
//                     </Text>
//                 </View>
//             </ImageBackground>

//             {/* FORM SECTION */}
//             <View style={tw`bg-white rounded-t-3xl -mt-8 p-6 pb-12 shadow-lg`}>
                
//                 {/* 1. Kategori Pasien */}
//                 <View style={tw`mb-5`}>
//                     <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
//                         Kategori Pasien <Text style={tw`text-red-500`}>*</Text>
//                     </Text>
//                     <View style={tw`flex-row justify-between gap-3`}>
//                         {['Pasien Baru', 'Pasien Lama'].map((type) => (
//                             <TouchableOpacity
//                                 key={type}
//                                 style={tw`flex-1 border py-3 rounded-lg items-center ${
//                                     formData.kategori === type ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'
//                                 }`}
//                                 onPress={() => handleChange('kategori', type)}
//                             >
//                                 <Text style={tw`text-sm font-semibold ${
//                                     formData.kategori === type ? 'text-green-700' : 'text-gray-600'
//                                 }`}>
//                                     {type}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>

//                 {/* 2. Nama Lengkap */}
//                 <View style={tw`mb-5`}>
//                     <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
//                         Nama Lengkap <Text style={tw`text-red-500`}>*</Text>
//                     </Text>
//                     <TextInput
//                         style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800`}
//                         placeholder="Sesuai KTP/Identitas"
//                         placeholderTextColor="#9ca3af" // Mengunci warna placeholder (abu-abu)
//                         value={formData.nama}
//                         onChangeText={(text) => handleChange('nama', text)}
//                     />
//                 </View>

//                 {/* 3. Nomor BPJS */}
//                 <View style={tw`mb-5`}>
//                     <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
//                         Nomor BPJS <Text style={tw`text-xs font-normal text-gray-400`}>(Opsional)</Text>
//                     </Text>
//                     <TextInput
//                         style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800`}
//                         placeholder="13 digit nomor kartu"
//                         placeholderTextColor="#9ca3af" // Mengunci warna placeholder (abu-abu)
//                         keyboardType="numeric"
//                         value={formData.noBpjs}
//                         onChangeText={(text) => handleChange('noBpjs', text)}
//                     />
//                 </View>

//                 {/* 4. Nomor WhatsApp */}
//                 <View style={tw`mb-5`}>
//                     <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
//                         Nomor WhatsApp/HP <Text style={tw`text-red-500`}>*</Text>
//                     </Text>
//                     <TextInput
//                         style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800`}
//                         placeholder="08xxxxxxxxxx"
//                         placeholderTextColor="#9ca3af" // Mengunci warna placeholder (abu-abu)
//                         keyboardType="phone-pad"
//                         value={formData.noHp}
//                         onChangeText={(text) => handleChange('noHp', text)}
//                     />
//                 </View>

//                 {/* 5. Alamat */}
//                 <View style={tw`mb-5`}>
//                     <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
//                         Alamat Domisili <Text style={tw`text-red-500`}>*</Text>
//                     </Text>
//                     <TextInput
//                         style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800 h-20`}
//                         placeholder="Jalan, RT/RW, Kelurahan..."
//                         placeholderTextColor="#9ca3af" // Mengunci warna placeholder (abu-abu)
//                         multiline
//                         numberOfLines={2}
//                         textAlignVertical="top"
//                         value={formData.alamat}
//                         onChangeText={(text) => handleChange('alamat', text)}
//                     />
//                 </View>

//                 {/* 6. Keluhan Utama */}
//                 <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6`}>
//                     <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
//                         Keluhan Utama <Text style={tw`text-red-500`}>*</Text>
//                     </Text>
//                     <TextInput
//                         style={tw`bg-white border border-gray-200 rounded-lg p-4 text-base text-gray-800 h-32`}
//                         placeholder="Ceritakan gejala yang dirasakan..."
//                         placeholderTextColor="#9ca3af" // Mengunci warna placeholder (abu-abu)
//                         multiline
//                         numberOfLines={5}
//                         textAlignVertical="top"
//                         value={formData.keluhan}
//                         onChangeText={(text) => handleChange('keluhan', text)}
//                     />
//                 </View>

//                 {/* Tombol Submit */}
//                 <TouchableOpacity style={tw`bg-[#00a651] flex-row justify-center items-center py-4 rounded-xl shadow-md`} onPress={handleSubmit}>
//                     <Text style={tw`text-white text-base font-bold`}>KIRIM VIA WHATSAPP</Text>
//                     <Ionicons name="logo-whatsapp" size={20} color="white" style={{ marginLeft: 8 }} />
//                 </TouchableOpacity>

//                 <Text style={tw`text-center text-xs text-gray-400 mt-4`}>
//                     Privasi Anda aman. Data hanya terkirim ke Whatsapp Resmi Klinik.
//                 </Text>

//             </View>
//         </ScrollView>
//     );
// }

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    ImageBackground, 
    Linking, 
    Alert, 
    Platform, 
    Modal 
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// Kunci unik untuk menyimpan data di AsyncStorage
const DRAFT_KEY = '@RegistrationFormDraft';

export default function RegistrationIndex() {
    const navigation = useNavigation();
    const WHATSAPP_NUMBER = '6289675873994';
    const hasSubmitted = useRef(false); // Ref untuk menandai jika form sudah disubmit

    const [formData, setFormData] = useState({
        kategori: 'Pasien Baru',
        nama: '',
        nik: '',
        tanggalLahir: '',
        alamat: '',
        noHp: '',
        keluhan: ''
    });

    // State untuk kontrol Date Picker
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());

    // --- FUNGSI UNTUK DRAFT ---

    // Fungsi untuk memuat draft dari penyimpanan
    const loadDraft = async () => {
        try {
            const draftJson = await AsyncStorage.getItem(DRAFT_KEY);
            if (draftJson) {
                const parsedData = JSON.parse(draftJson);
                setFormData(parsedData);
                
                // Jika draft memiliki tanggal lahir, sesuaikan state objek Date internal
                if (parsedData.tanggalLahir) {
                    const parts = parsedData.tanggalLahir.split('-');
                    if (parts.length === 3) {
                        const parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                        setTempDate(parsedDate);
                    }
                }
            }
        } catch (e) {
            console.error("Gagal memuat draft:", e);
        }
    };

    // Fungsi untuk menyimpan draft ke penyimpanan
    const saveDraft = async (data) => {
        try {
            await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Gagal menyimpan draft:", e);
        }
    };

    // Fungsi untuk membersihkan draft
    const clearDraft = async () => {
        try {
            await AsyncStorage.removeItem(DRAFT_KEY);
        } catch (e) {
            console.error("Gagal membersihkan draft:", e);
        }
    };

    // --- EFEK LIFECYCLE ---

    // 1. Muat draft saat komponen pertama kali dibuka
    useEffect(() => {
        loadDraft();
    }, []);

    // 2. Simpan draft setiap kali ada perubahan pada form (setelah 1 detik)
    useEffect(() => {
        const hasData = formData.nama || formData.nik || formData.tanggalLahir || formData.noHp || formData.keluhan || formData.alamat;
        if (!hasData) return;

        // Debounce: Tunda penyimpanan selama 1 detik setelah user berhenti mengetik
        const handler = setTimeout(() => {
            saveDraft(formData);
        }, 1000);

        return () => clearTimeout(handler);
    }, [formData]);


    // 3. Logika untuk konfirmasi keluar halaman
    useFocusEffect(
        useCallback(() => {
            hasSubmitted.current = false;

            const onBeforeRemove = (e) => {
                const hasUnsavedChanges = formData.nama || formData.nik || formData.tanggalLahir || formData.noHp || formData.alamat || formData.keluhan;
                
                if (!hasUnsavedChanges || hasSubmitted.current) {
                    return;
                }

                e.preventDefault();

                Alert.alert(
                    'Tinggalkan Halaman?',
                    'Anda memiliki isian yang belum terkirim. Apa yang ingin Anda lakukan?',
                    [
                        { 
                            text: 'Tetap di Sini', 
                            style: 'cancel', 
                            onPress: () => {} 
                        },
                        {
                            text: 'Keluar Saja',
                            style: 'destructive',
                            onPress: async () => {
                                await clearDraft();
                                navigation.dispatch(e.data.action);
                            },
                        },
                        {
                            text: 'Simpan & Keluar',
                            style: 'default',
                            onPress: async () => {
                                await saveDraft(formData);
                                navigation.dispatch(e.data.action);
                            },
                        },
                    ]
                );
            };

            navigation.addListener('beforeRemove', onBeforeRemove);
            return () => navigation.removeListener('beforeRemove', onBeforeRemove);

        }, [navigation, formData])
    );


    // --- HANDLER ---

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler untuk perubahan tanggal pada DatePicker
    const onChangeDate = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            if (selectedDate) {
                setTempDate(selectedDate);
                formatAndSetDate(selectedDate);
            }
        } else {
            // Pada iOS, biarkan pengguna memutar spinner tanpa langsung menutup modal
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    // Konversi objek Date ke format DD-MM-YYYY
    const formatAndSetDate = (dateObj) => {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        handleChange('tanggalLahir', formattedDate);
    };

    // Handler konfirmasi khusus untuk iOS
    const handleConfirmIOS = () => {
        formatAndSetDate(tempDate);
        setShowDatePicker(false);
    };

    const handleSubmit = async () => {
        if (!formData.nama || !formData.nik || !formData.tanggalLahir || !formData.noHp || !formData.alamat || !formData.keluhan) {
            Alert.alert("Data Tidak Lengkap", "Mohon lengkapi kolom yang wajib diisi (*)");
            return;
        }

        if (formData.nik.length !== 16) {
            Alert.alert("Data Tidak Valid", "Nomor NIK harus berjumlah 16 digit");
            return;
        }

        const message = `*PENDAFTARAN ONLINE KLINIK PRATAMA UNIMUS*
----------------------------------------
Halo Admin, saya ingin mendaftar dengan data berikut:

*Kategori:* ${formData.kategori}
*Nama Pasien:* ${formData.nama}
*NIK:* ${formData.nik}
*Tanggal Lahir:* ${formData.tanggalLahir}
*Alamat:* ${formData.alamat}
*No. HP/WA:* ${formData.noHp}

*Keluhan:* 
${formData.keluhan}

Mohon konfirmasinya, Terima kasih.`;
        const encodedMessage = encodeURIComponent(message);
        
        // Menggunakan tautan universal wa.me agar andal di perangkat rilis/build produksi
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        try {
            hasSubmitted.current = true;
            await clearDraft();
            await Linking.openURL(waUrl);
        } catch (err) {
            hasSubmitted.current = false;
            Alert.alert("Error", "Gagal membuka WhatsApp. Pastikan aplikasi terinstal.");
            console.error(err);
        }
    };


    return (
        <ScrollView style={tw`flex-1 bg-gray-100`} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ title: 'Form Pendaftaran' }} />

            {/* HEADER SECTION */}
            <ImageBackground 
                source={{ uri: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp' }}
                style={tw`w-full pt-10 pb-16 bg-[#00a651]`}
                imageStyle={{ opacity: 0.2 }}
            >
                <View style={tw`px-5 items-center`}>
                    <Text style={tw`text-2xl font-bold text-white mb-2`}>Pendaftaran Pasien</Text>
                    <Text style={tw`text-xs text-white/90 text-center leading-5`}>
                        Silakan lengkapi formulir di bawah ini. Data akan otomatis terformat ke WhatsApp Admin.
                    </Text>
                </View>
            </ImageBackground>

            {/* FORM SECTION */}
            <View style={tw`bg-white rounded-t-3xl -mt-8 p-6 pb-12 shadow-lg`}>
                
                {/* 1. Kategori Pasien */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
                        Kategori Pasien <Text style={tw`text-red-500`}>*</Text>
                    </Text>
                    <View style={tw`flex-row justify-between gap-3`}>
                        {['Pasien Baru', 'Pasien Lama'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={tw`flex-1 border py-3 rounded-lg items-center ${
                                    formData.kategori === type ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'
                                }`}
                                onPress={() => handleChange('kategori', type)}
                            >
                                <Text style={tw`text-sm font-semibold ${
                                    formData.kategori === type ? 'text-green-700' : 'text-gray-600'
                                }`}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 2. Nama Lengkap */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
                        Nama Lengkap <Text style={tw`text-red-500`}>*</Text>
                    </Text>
                    <TextInput
                        style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800`}
                        placeholder="Sesuai KTP/Identitas"
                        placeholderTextColor="#9ca3af"
                        value={formData.nama}
                        onChangeText={(text) => handleChange('nama', text)}
                    />
                </View>

                {/* 3. NIK */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
                        NIK (Nomor Induk Kependudukan) <Text style={tw`text-red-500`}>*</Text>
                    </Text>
                    <TextInput
                        style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800`}
                        placeholder="16 digit nomor NIK"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                        maxLength={16}
                        value={formData.nik}
                        onChangeText={(text) => handleChange('nik', text)}
                    />
                </View>

                {/* 4. Tanggal Lahir (Dengan Fitur Pick a Date) */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
                        Tanggal Lahir <Text style={tw`text-red-500`}>*</Text>
                    </Text>
                    
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={tw`bg-gray-100 rounded-lg px-4 py-3.5 flex-row justify-between items-center`}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={tw`text-base ${formData.tanggalLahir ? 'text-gray-800' : 'text-gray-400'}`}>
                            {formData.tanggalLahir || "Pilih tanggal lahir"}
                        </Text>
                        <Ionicons name="calendar" size={20} color="#00a651" />
                    </TouchableOpacity>

                    {/* RENDER DATE PICKER BERDASARKAN OS */}
                    {Platform.OS === 'ios' ? (
                        <Modal visible={showDatePicker} transparent animationType="fade">
                            <View style={tw`flex-1 bg-black/50 justify-end`}>
                                <View style={tw`bg-white p-4 rounded-t-3xl pb-8`}>
                                    <View style={tw`flex-row justify-between items-center mb-4 border-b border-gray-100 pb-3`}>
                                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                            <Text style={tw`text-gray-500 font-semibold text-base`}>Batal</Text>
                                        </TouchableOpacity>
                                        <Text style={tw`text-base font-bold text-gray-800`}>Pilih Tanggal Lahir</Text>
                                        <TouchableOpacity onPress={handleConfirmIOS}>
                                            <Text style={tw`text-[#00a651] font-bold text-base`}>Selesai</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <DateTimePicker
                                        value={tempDate}
                                        mode="date"
                                        display="spinner"
                                        maximumDate={new Date()}
                                        onChange={onChangeDate}
                                    />
                                </View>
                            </View>
                        </Modal>
                    ) : (
                        showDatePicker && (
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="default"
                                maximumDate={new Date()}
                                onChange={onChangeDate}
                            />
                        )
                    )}
                </View>

                {/* 5. Nomor WhatsApp */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
                        Nomor WhatsApp/HP <Text style={tw`text-red-500`}>*</Text>
                    </Text>
                    <TextInput
                        style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800`}
                        placeholder="08xxxxxxxxxx"
                        placeholderTextColor="#9ca3af"
                        keyboardType="phone-pad"
                        value={formData.noHp}
                        onChangeText={(text) => handleChange('noHp', text)}
                    />
                </View>

                {/* 6. Alamat */}
                <View style={tw`mb-5`}>
                    <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
                        Alamat Domisili <Text style={tw`text-red-500`}>*</Text>
                    </Text>
                    <TextInput
                        style={tw`bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800 h-20`}
                        placeholder="Jalan, RT/RW, Kelurahan..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={2}
                        textAlignVertical="top"
                        value={formData.alamat}
                        onChangeText={(text) => handleChange('alamat', text)}
                    />
                </View>

                {/* 7. Keluhan Utama */}
                <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6`}>
                    <Text style={tw`text-sm font-bold text-gray-800 mb-2`}>
                        Keluhan Utama <Text style={tw`text-red-500`}>*</Text>
                    </Text>
                    <TextInput
                        style={tw`bg-white border border-gray-200 rounded-lg p-4 text-base text-gray-800 h-32`}
                        placeholder="Ceritakan gejala yang dirasakan..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={formData.keluhan}
                        onChangeText={(text) => handleChange('keluhan', text)}
                    />
                </View>

                {/* Tombol Submit */}
                <TouchableOpacity style={tw`bg-[#00a651] flex-row justify-center items-center py-4 rounded-xl shadow-md`} onPress={handleSubmit}>
                    <Text style={tw`text-white text-base font-bold`}>KIRIM VIA WHATSAPP</Text>
                    <Ionicons name="logo-whatsapp" size={20} color="white" style={{ marginLeft: 8 }} />
                </TouchableOpacity>

                <Text style={tw`text-center text-xs text-gray-400 mt-4`}>
                    Privasi Anda aman. Data hanya terkirim ke Whatsapp Resmi Klinik.
                </Text>

            </View>
        </ScrollView>
    );
}