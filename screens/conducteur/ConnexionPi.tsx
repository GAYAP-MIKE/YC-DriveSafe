import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { saveIpPi } from '../../services/storage';
import { ConducteurStackParamList } from '../../navigation/ConducteurStack';

type NavigationProp = NativeStackNavigationProp<ConducteurStackParamList>;

export default function ConnexionPi() {
  const navigation = useNavigation<NavigationProp>();
  const [ip, setIp] = useState('192.168.1.100');
  const [isConnecting, setIsConnecting] = useState(false);

  const connecter = async () => {
    if (!ip) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse IP');
      return;
    }

    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      Alert.alert('Erreur', 'Adresse IP invalide');
      return;
    }

    setIsConnecting(true);
    
    try {
      await saveIpPi(ip);
      
      setTimeout(() => {
        setIsConnecting(false);
        Alert.alert(
          'Succès 🎉',
          'Connecté au Raspberry Pi avec succès !',
          [
            { 
              text: 'Continuer', 
              onPress: () => navigation.navigate('Dashboard')
            }
          ]
        );
      }, 1500);
      
    } catch (error) {
      setIsConnecting(false);
      Alert.alert('Erreur', 'Impossible de se connecter au Raspberry Pi');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundj.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['rgba(15,12,41,0.85)', 'rgba(48,43,99,0.75)']}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.emoji}>📡</Text>
            <Text style={styles.title}>Connexion au véhicule</Text>
            <Text style={styles.subtitle}>
              Entrez l'adresse IP du Raspberry Pi
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="wifi-outline" size={24} color="#667eea" />
              <TextInput
                style={styles.input}
                placeholder="Adresse IP du Raspberry Pi"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={ip}
                onChangeText={setIp}
                keyboardType="decimal-pad"
                editable={!isConnecting}
              />
            </View>

            <View style={styles.infoContainer}>
              <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.4)" />
              <Text style={styles.infoText}>
                Exemple: 192.168.1.100
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={connecter}
              disabled={isConnecting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                {isConnecting ? (
                  <>
                    <Ionicons name="refresh-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Connexion en cours...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="link-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Se connecter</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  input: {
    flex: 1,
    height: 55,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    marginLeft: 8,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});