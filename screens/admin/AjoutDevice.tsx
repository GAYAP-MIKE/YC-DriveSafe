import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function AjoutDevice() {
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [description, setDescription] = useState('');

  const ajouter = () => {
    if (!nom || !deviceId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    Alert.alert(
      'Ajout du véhicule',
      `Voulez-vous ajouter le véhicule "${nom}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Ajouter',
          onPress: () => {
            Alert.alert(
              'Succès 🎉',
              `Le véhicule "${nom}" a été ajouté avec succès !`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['rgba(15,12,41,0.88)', 'rgba(48,43,99,0.78)']}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>➕ Ajouter un groupe </Text>
          <Text style={styles.subtitle}>
            Remplissez les informations pour appairer un nouveau véhicule
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="car-outline" size={22} color="rgba(255,255,255,0.6)" />
              <TextInput
                style={styles.input}
                placeholder="Nom du véhicule *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={nom}
                onChangeText={setNom}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="hardware-chip-outline" size={22} color="rgba(255,255,255,0.6)" />
              <TextInput
                style={styles.input}
                placeholder="ID du Raspberry Pi *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={deviceId}
                onChangeText={setDeviceId}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="document-text-outline" size={22} color="rgba(255,255,255,0.6)" />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optionnelle)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#667eea" />
              <Text style={styles.infoText}>
                L'ID du Raspberry Pi est inscrit sur l'étiquette du boîtier
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={ajouter}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Ajouter le véhicule</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    flexGrow: 1,
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
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(102,126,234,0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    flex: 1,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
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