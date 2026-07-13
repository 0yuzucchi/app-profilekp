import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, Animated, StyleSheet, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import Svg, { Path, Rect, G } from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

// PATH DATA (Dipisah secara manual agar bisa dianimasikan tiap bagian)
const PATHS = {
  // Hanya bagian tubuh putih dan bintang (tanpa lubang mata)
  bodyAndStar: "M5645.74 2977.01C5570.64 3060.57 5517.43 3161.46 5490.9 3270.64C5464.36 3379.82 5465.33 3493.87 5493.7 3602.58C5522.07 3711.3 5576.97 3811.27 5653.48 3893.55C5729.99 3975.84 5825.71 4037.86 5932.07 4074.05L6017.77 4103.3C6050.6 4114.49 6080.43 4133.06 6104.95 4157.58C6129.48 4182.11 6148.05 4211.93 6159.24 4244.77L6188.71 4330.46C6224.87 4436.82 6286.87 4532.55 6369.13 4609.06C6451.39 4685.57 6551.35 4740.47 6660.05 4768.85C6768.74 4797.23 6882.79 4798.19 6991.95 4771.65C7101.11 4745.11 7201.98 4691.9 7285.52 4616.79L7285.3 5924.22C7285.3 6224.86 7165.87 6513.18 6953.29 6725.76C6740.71 6938.34 6452.39 7057.76 6151.76 7057.76H2978.07C2917.94 7057.76 2860.28 7033.88 2817.76 6991.36C2775.24 6948.85 2751.36 6891.18 2751.36 6831.06V4110.55C2751.36 3809.92 2870.79 3521.6 3083.37 3309.02C3295.95 3096.44 3584.27 2977.01 3884.9 2977.01H5645.74ZM6832.11 2523.59C6879.4 2523.61 6925.5 2538.42 6963.95 2565.94C7002.41 2593.46 7031.3 2632.32 7046.57 2677.08L7076.04 2762.77C7144.06 2962.05 7300.49 3118.7 7499.99 3186.72L7585.46 3215.96C7630.16 3231.28 7668.96 3260.19 7696.44 3298.64C7723.91 3337.09 7738.67 3383.17 7738.67 3430.43C7738.67 3477.69 7723.91 3523.76 7696.44 3562.21C7668.96 3600.67 7630.16 3629.57 7585.46 3644.89L7499.76 3674.37C7300.49 3742.38 7143.83 3898.81 7075.82 4098.31L7046.57 4183.78C7031.25 4228.49 7002.35 4267.29 6963.89 4294.76C6925.44 4322.23 6879.36 4337 6832.11 4337C6784.85 4337 6738.77 4322.23 6700.32 4294.76C6661.87 4267.29 6632.96 4228.49 6617.64 4183.78L6588.17 4098.08C6554.59 3999.72 6498.92 3910.37 6425.43 3836.88C6351.94 3763.39 6262.58 3707.71 6164.22 3674.14L6078.76 3644.89C6034.05 3629.57 5995.25 3600.67 5967.78 3562.21C5940.31 3523.76 5925.54 3477.69 5925.54 3430.43C5925.54 3383.17 5940.31 3337.09 5967.78 3298.64C5995.25 3260.19 6034.05 3231.28 6078.76 3215.96L6164.45 3186.49C6363.73 3118.48 6520.38 2962.05 6588.39 2762.54L6617.64 2677.08C6632.92 2632.32 6661.8 2593.46 6700.26 2565.94C6738.72 2538.42 6784.82 2523.61 6832.11 2523.59Z",
  // Mata kiri dan kanan
  eyes: "M4338.32 4563.97C4278.19 4563.97 4220.53 4587.86 4178.01 4630.37C4135.49 4672.89 4111.61 4730.55 4111.61 4790.68V5244.1C4111.61 5304.22 4135.49 5361.89 4178.01 5404.4C4220.53 5446.92 4278.19 5470.8 4338.32 5470.8C4398.44 5470.8 4456.11 5446.92 4498.62 5404.4C4541.14 5361.89 4565.02 5304.22 4565.02 5244.1V4790.68C4565.02 4730.55 4541.14 4672.89 4498.62 4630.37C4456.11 4587.86 4398.44 4563.97 4338.32 4563.97ZM5698.57 4563.97C5638.44 4563.97 5580.77 4587.86 5538.26 4630.37C5495.74 4672.89 5471.86 4730.55 5471.86 4790.68V5244.1C5471.86 5304.22 5495.74 5361.89 5538.26 5404.4C5580.77 5446.92 5638.44 5470.8 5698.57 5470.8C5758.69 5470.8 5816.36 5446.92 5858.87 5404.4C5901.39 5361.89 5925.27 5304.22 5925.27 5244.1V4790.68C5925.27 4730.55 5901.39 4672.89 5858.87 4630.37C5816.36 4587.86 5758.69 4563.97 5698.57 4563.97Z"
};

const AILogoSVG = ({ size = 60 }) => {
  const nodAnim = useRef(new Animated.Value(0)).current;
  const eyeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animasi Ngangguk (Naik Turun Cepat)
    Animated.loop(
      Animated.sequence([
        Animated.timing(nodAnim, {
          toValue: 120, // Gerakan turun
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(nodAnim, {
          toValue: 0, // Kembali naik
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animasi Mata (Melirik kiri kanan lebih kontras)
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000), // Waktu diam di tengah sebelum mulai melirik
        
        // Melirik ke KANAN
        Animated.timing(eyeAnim, {
          toValue: 300,       // JARAK: Semakin besar angkanya, semakin jauh lirikannya
          duration: 600,      // DURASI: Kecepatan gerakan (ms). 600ms = sedang & jelas
          easing: Easing.bezier(0.4, 0, 0.2, 1), // Membuat gerakan lebih luwes
          useNativeDriver: true,
        }),
        
        Animated.delay(1200), // Berhenti sebentar di kanan untuk pamer lirikan
        
        // Melirik ke KIRI
        Animated.timing(eyeAnim, {
          toValue: -300,      // JARAK: Ke arah kiri (negatif)
          duration: 600,      // DURASI: Samakan agar seimbang
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        
        Animated.delay(1200), // Berhenti sebentar di kiri
        
        // Kembali ke TENGAH
        Animated.timing(eyeAnim, {
          toValue: 0,
          duration: 400,      // Kembali ke tengah sedikit lebih cepat
          useNativeDriver: true,
        }),
        
        Animated.delay(2000), // Istirahat panjang sebelum mengulang lirik lagi
      ])
    ).start();
  }, []);

  return (
    <Svg width={size} height={size} viewBox="0 0 10036 10036" fill="none">
      {/* Background Lingkaran Hijau */}
      <Rect x="18" y="18" width="10000" height="10000" rx="5000" fill="#00A54F" />
      
      {/* Border Putih */}
      <Rect 
        x="236.5" y="236.5" 
        width="9563" height="9563" 
        rx="4781.5" 
        stroke="white" strokeWidth="450" 
      />

      {/* Group Utama yang Ngangguk */}
      <AnimatedG style={{ transform: [{ translateY: nodAnim }] }}>
        
        {/* Tubuh Robot & Bintang (Warna Hijau dipotong untuk lubang mata otomatis jika pakai path asli) */}
        {/* Disini kita pakai fill white, tapi matanya kita timpa dengan warna hijau agar terlihat bolong */}
        <Path 
          d={PATHS.bodyAndStar}
          fill="white"
        />

        {/* Group Mata yang bergerak kiri kanan */}
        <AnimatedG style={{ transform: [{ translateX: eyeAnim }] }}>
          {/* Kita gambar mata dengan warna hijau di atas tubuh putih */}
          <Path 
            d={PATHS.eyes}
            fill="#00A54F" 
          />
        </AnimatedG>

      </AnimatedG>
    </Svg>
  );
};

const FloatingAIButton = () => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={tw`absolute bottom-5 right-5`}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={() => router.push('/chat-ai')}
          activeOpacity={0.8}
          style={styles.buttonContainer}
        >
          <AILogoSVG size={60} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'transparent',
    shadowColor: '#00A54F',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  }
});

export default FloatingAIButton;