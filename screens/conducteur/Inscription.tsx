import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { inscrireConducteur } from '../../services/apiLocal';
import { faceDetection } from '../../services/faceDetection';

export default function Inscription() {
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // Initialiser les services
  useEffect(() => {
    const initServices = async () => {
      try {
        await faceDetection.initialize();
        console.log('✅ Services initialisés');
      } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        Alert.alert('Erreur', 'Impossible d\'initialiser les services de détection');
      }
    };
    initServices();

    return () => {
      faceDetection.close();
    };
  }, []);

  // Prendre une photo et détecter le visage
  const prendrePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Erreur', 'Permission caméra refusée');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        setFaceDetected(false);
        
        // Détecter le visage
        await detectFace(imageUri);
      }
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  // Détecter le visage avec MediaPipe
  const detectFace = async (imageUri: string) => {
    setIsDetecting(true);
    try {
      // Convertir l'image en format compatible
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      
      const faceResult = await faceDetection.detectFace(imageBitmap);
      
      if (!faceResult) {
        Alert.alert(
          'Aucun visage détecté',
          'Veuillez prendre une photo de votre visage en pleine lumière et de face.'
        );
        setImage(null);
        return;
      }

      const isValid = faceDetection.isFaceValid(faceResult.landmarks);
      if (!isValid) {
        Alert.alert(
          'Visage mal positionné',
          'Veuillez vous placer face à la caméra, les yeux bien visibles.'
        );
        setImage(null);
        return;
      }

      setFaceDetected(true);
      Alert.alert(
        '✅ Visage détecté',
        'Votre visage a été détecté avec succès !'
      );

    } catch (error) {
      console.error('Erreur détection:', error);
      Alert.alert('Erreur', 'Erreur lors de la détection du visage');
    } finally {
      setIsDetecting(false);
    }
  };

  // Enrôler le conducteur
  const enregistrer = async () => {
    if (!nom || !prenom) {
      Alert.alert('Erreur', 'Veuillez saisir le nom et prénom');
      return;
    }

    if (!image) {
      Alert.alert('Erreur', 'Veuillez prendre une photo');
      return;
    }

    if (!faceDetected) {
      Alert.alert('Erreur', 'Aucun visage valide détecté');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler un embedding (à remplacer par l'extraction réelle)
      const embeddingSimule = Array.from({ length: 128 }, () => Math.random());
      
      const result = await inscrireConducteur(
        `${nom} ${prenom}`,
        embeddingSimule
      );
      
      Alert.alert(
        '🎉 Succès',
        `Conducteur ${nom} ${prenom} enrôlé avec succès !\nID: ${result.id}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erreur enrôlement:', error);
      Alert.alert('Erreur', 'Impossible d\'enrôler le conducteur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
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

          <Text style={styles.title}>📸 Enrôlement facial</Text>
          <Text style={styles.subtitle}>
            Prenez une photo de votre visage pour l'identification
          </Text>

          <TouchableOpacity 
            style={[styles.photoContainer, faceDetected && styles.photoDetected]} 
            onPress={prendrePhoto}
            disabled={isLoading || isDetecting}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={60} color="rgba(255,255,255,0.5)" />
                <Text style={styles.photoText}>
                  Appuyez pour prendre une photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {isDetecting && (
            <View style={styles.detectingContainer}>
              <ActivityIndicator color="#667eea" size="small" />
              <Text style={styles.detectingText}>Détection du visage en cours...</Text>
            </View>
          )}

          {faceDetected && (
            <View style={styles.faceDetectedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.faceDetectedText}>Visage détecté ✅</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={22} color="rgba(255,255,255,0.6)" />
              <TextInput
                style={styles.input}
                placeholder="Nom"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={nom}
                onChangeText={setNom}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={22} color="rgba(255,255,255,0.6)" />
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={prenom}
                onChangeText={setPrenom}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={enregistrer}
              disabled={isLoading || !faceDetected}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Enrôler</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {!faceDetected && image && (
              <Text style={styles.warningText}>
                ⚠️ Veuillez prendre une photo avec un visage visible
              </Text>
            )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 30,
  },
  photoContainer: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
  },
  photoDetected: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 10,
  },
  detectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  detectingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  faceDetectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(76,175,80,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  faceDetectedText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
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
  warningText: {
    color: '#FFC107',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
});