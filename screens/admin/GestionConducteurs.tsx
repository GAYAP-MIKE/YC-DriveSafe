import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function GestionConducteurs() {
  const navigation = useNavigation();
  const [conducteurs, setConducteurs] = useState([
    { id: '1', nom: 'Jean Dupont', statut: 'actif', vehicule: 'Véhicule 001' },
    { id: '2', nom: 'Marie Martin', statut: 'inactif', vehicule: 'Véhicule 002' },
  ]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Ionicons name="person-circle-outline" size={40} color="#667eea" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nom}</Text>
        <Text style={styles.cardSubtitle}>{item.vehicule}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: item.statut === 'actif' ? '#4CAF50' : '#9E9E9E' }]}>
        <Text style={styles.statusText}>{item.statut.toUpperCase()}</Text>
      </View>
    </View>
  );

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
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>👥 Conducteurs</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="person-add-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {conducteurs.length} conducteur(s) enregistré(s)
          </Text>

          <FlatList
            data={conducteurs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 20,
    marginLeft: 8,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    gap: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});