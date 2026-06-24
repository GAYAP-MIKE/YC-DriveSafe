import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { getHistorique, clearHistorique, Alerte } from '../../services/storage';
import AlerteCard from '../../components/AlerteCard';

export default function Historique() {
  const navigation = useNavigation();
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    chargerHistorique();
  }, []);

  const chargerHistorique = async () => {
    const data = await getHistorique();
    setAlertes(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await chargerHistorique();
    setRefreshing(false);
  };

  const viderHistorique = async () => {
    await clearHistorique();
    await chargerHistorique();
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
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>📜 Historique</Text>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={viderHistorique}
            >
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {alertes.length} alerte(s) enregistrée(s)
          </Text>

          {alertes.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="checkmark-circle-outline" size={80} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>Aucune alerte</Text>
              <Text style={styles.emptySubText}>Vous êtes en sécurité ! 🎉</Text>
            </View>
          ) : (
            <FlatList
              data={alertes}
              renderItem={({ item }) => <AlerteCard {...item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#fff"
                />
              }
            />
          )}
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
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244,67,54,0.2)',
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 20,
  },
  emptySubText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
  },
});