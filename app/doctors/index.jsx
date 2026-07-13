import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Animated,
  StyleSheet
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import FloatingAIButton from '../../components/FloatingAIButton';
import tw from 'twrnc';

import { useCachedData } from '../../hooks/useCachedData';

const SOFT_DUMMY_ICON = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

// --- KOMPONEN SKELETON ---
const ScheduleBoxSkeleton = ({ opacity }) => (
  <View style={tw`flex-1 min-w-[30%] mb-2 mx-1`}>
    <Animated.View style={[tw`bg-gray-200 rounded-t-lg py-1 h-4`, { opacity }]} />
    <Animated.View style={[tw`bg-gray-100 border border-gray-200 border-t-0 rounded-b-lg py-2 h-10`, { opacity }]} />
  </View>
);

const DoctorSkeleton = () => {
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
    <View style={tw`bg-white rounded-[25px] p-5 mb-6 border border-gray-100 mx-4 shadow-sm`}>
      <View style={tw`flex-row items-center mb-5`}>
        <Animated.View style={[tw`w-20 h-20 rounded-xl bg-gray-200`, { opacity: pulseAnim }]} />
        <View style={tw`ml-4 flex-1`}>
          <Animated.View style={[tw`bg-gray-200 h-5 w-3/4 rounded mb-3`, { opacity: pulseAnim }]} />
          <View style={tw`flex-row`}>
            <Animated.View style={[tw`bg-gray-100 h-4 w-16 rounded-full mr-2`, { opacity: pulseAnim }]} />
            <Animated.View style={[tw`bg-gray-100 h-4 w-20 rounded-full`, { opacity: pulseAnim }]} />
          </View>
        </View>
      </View>
      <View style={tw`border-t border-gray-100 pt-4`}>
        <Animated.View style={[tw`bg-gray-100 h-4 w-24 rounded mb-4`, { opacity: pulseAnim }]} />
        <View style={tw`flex-row flex-wrap -mx-1`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ScheduleBoxSkeleton key={i} opacity={pulseAnim} />
          ))}
        </View>
      </View>
    </View>
  );
};

// --- KOMPONEN KECIL JADWAL ---
const ScheduleBox = ({ day, time }) => (
    <View style={tw`flex-1 min-w-[30%] mb-2 mx-1`}>
        <View style={tw`bg-green-600 rounded-t-lg py-1`}>
            <Text style={tw`text-white text-[10px] font-bold text-center uppercase`}>{day}</Text>
        </View>
        <View style={tw`bg-white border border-gray-200 border-t-0 rounded-b-lg py-2 h-10 justify-center items-center`}>
            <Text style={tw`text-gray-700 text-[10px] font-medium text-center`}>
                {time && time !== "-" ? time : '—'}
            </Text>
        </View>
    </View>
);

// --- KOMPONEN KARTU DOKTER ---
const DoctorCard = ({ doctor }) => {
    const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const specializations = typeof doctor.specialization === 'string'
        ? doctor.specialization.split(',').map(s => s.trim())
        : (Array.isArray(doctor.specialization) ? doctor.specialization : []);
    const schedules = doctor.schedules || {};

    return (
        <View style={[
            tw`bg-green-50 rounded-[25px] p-5 mb-6 border border-green-100 mx-4`,
            { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }
        ]}>
            <View style={tw`flex-row items-center mb-5`}>
                <View style={tw`p-1 bg-white rounded-2xl border-2 border-green-500 shadow-sm`}>
                    <Image
                        source={doctor.photo || SOFT_DUMMY_ICON}
                        style={tw`w-20 h-20 rounded-xl bg-gray-100`}
                        contentFit="cover"
                        transition={500}
                    />
                </View>
                <View style={tw`ml-4 flex-1`}>
                    <Text style={tw`text-green-900 font-extrabold text-lg leading-tight mb-2`}>
                        {doctor.name}
                    </Text>
                    <View style={tw`flex-row flex-wrap`}>
                        {specializations.map((spec, index) => (
                        <View key={index} style={tw`bg-green-600 px-3 py-1 rounded-full mr-1 mb-1`}>
                            <Text style={tw`text-white text-[10px] font-bold`}>{spec}</Text>
                        </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={tw`border-t border-green-100 pt-4`}>
                <View style={tw`flex-row items-center mb-3`}>
                    <Ionicons name="time-outline" size={16} color="#15803d" />
                    <Text numberOfLines={1} style={tw`text-gray-800 font-bold text-sm ml-2 flex-shrink-0`}>
                        Jadwal Praktik
                    </Text>
                </View>
                <View style={tw`flex-row flex-wrap -mx-1`}>
                    {daysOrder.map((day) => (
                        <ScheduleBox key={day} day={day} time={schedules[day.toLowerCase()]} />
                    ))}
                </View>
            </View>
        </View>
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
                Jadwal Dokter
            </Animated.Text>

            <Animated.View style={[tw`absolute right-0 flex-row items-center bg-gray-100 rounded-full h-full`, { width: searchWidth, opacity: searchOpacity }]}>
                <Ionicons name="search" size={20} color="#9ca3af" style={tw`pl-3 pr-2`} />
                <TextInput
                    ref={searchInputRef}
                    style={tw`flex-1 h-full text-gray-700 font-medium`}
                    placeholder="Cari dokter atau spesialis..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </Animated.View>
        </View>
    );
};

// --- KOMPONEN UTAMA ---
const DoctorsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const searchInputRef = useRef(null);
    const searchAnim = useRef(new Animated.Value(0)).current;

    const { data: doctors, loading, error } = useCachedData('/doctors');

    // --- LOGIKA FILTER PENCARIAN YANG DIPERBARUI ---
    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];
        const dataArray = Array.isArray(doctors) ? doctors : (doctors.data || []);
        
        if (!searchQuery) return dataArray;
        const query = searchQuery.toLowerCase();
        
        return dataArray.filter(doc => {
            const matchesName = doc.name ? doc.name.toLowerCase().includes(query) : false;
            
            let matchesSpecialization = false;
            if (typeof doc.specialization === 'string') {
                matchesSpecialization = doc.specialization.toLowerCase().includes(query);
            } else if (Array.isArray(doc.specialization)) {
                matchesSpecialization = doc.specialization.some(spec => 
                    typeof spec === 'string' && spec.toLowerCase().includes(query)
                );
            }
            
            return matchesName || matchesSpecialization;
        });
    }, [doctors, searchQuery]);

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

            {error && doctors && (
                <View style={tw`bg-amber-100 py-1.5 items-center px-4`}>
                    <Text style={tw`text-[11px] text-amber-800 font-medium text-center`}>
                        Mode Offline: Menampilkan jadwal terakhir yang tersimpan
                    </Text>
                </View>
            )}

            {loading && !doctors ? (
                <FlatList
                    data={[1, 2]}
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => <DoctorSkeleton />}
                    contentContainerStyle={tw`pt-4 pb-6`}
                />
            ) : (
                <FlatList
                    data={filteredDoctors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <DoctorCard doctor={item} />}
                    contentContainerStyle={tw`pt-4 pb-6`}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={tw`flex-1 items-center justify-center mt-20 px-10`}>
                            <Ionicons name="people-outline" size={50} color="#d1d5db" />
                            <Text style={tw`text-gray-700 font-bold text-lg mt-4 text-center`}>
                                Data Tidak Ditemukan
                            </Text>
                            <Text style={tw`text-gray-400 text-center text-sm mt-2`}>
                                {searchQuery ? 'Coba kata kunci lain.' : 'Pastikan internet aktif untuk memuat data pertama kali.'}
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
    }
});

export default DoctorsList;