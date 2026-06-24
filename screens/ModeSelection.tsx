import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ModeSelection() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ImageBackground
      source={require('../assets/background_2.png')} // ← VOTRE IMAGE ICI
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay sombre pour meilleure lisibilité */}
      <LinearGradient
        colors={['rgba(15,12,41,0.7)', 'rgba(48,43,99,0.6)']}
        style={styles.overlay}
      >
        <StatusBar style="light" />
        
        <View style={styles.content}>
          <Text style={styles.emoji}>🚙</Text>
          <Text style={styles.appName}>YC-DriveSafe</Text>
          <Text style={styles.subtitle}>Sécurité routière intelligente</Text>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Conducteur')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#667eea', '#03202127']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>🚙 Plan particulier</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Admin')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#06d243ae', '#086b1c09']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>🏢 Plan entreprise </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footer}>© 2026 YC-DriveSafe</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily:'Arial' ,
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  buttonGradient: {
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 30,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});