import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

interface Device {
  id: string;
  nom: string;
  statut: 'actif' | 'inactif' | 'alerte';
  conducteur?: string;
  derniere_connexion: string;
  alertes: number;
  version: string;
}

export default function ListeDevices() {
  const navigation = useNavigation();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      nom: 'Véhicule 001 - Berline',
      statut: 'actif',
      conducteur: 'Jean Dupont',
      derniere_connexion: new Date().toISOString(),
      alertes: 2,
      version: '2.1.0',
    },
    {
      id: '2',
      nom: 'Véhicule 002 - SUV',
      statut: 'alerte',
      conducteur: 'Marie Martin',
      derniere_connexion: new Date(Date.now() - 300000).toISOString(),
      alertes: 5,
      version: '2.0.8',
    },
    {
      id: '3',
      nom: 'Véhicule 003 - Camionnette',
      statut: 'inactif',
      conducteur: 'Aucun',
      derniere_connexion: new Date(Date.now() - 86400000).toISOString(),
      alertes: 0,
      version: '2.1.0',
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return '#4CAF50';
      case 'alerte': return '#F44336';
      case 'inactif': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'actif': return 'checkmark-circle';
      case 'alerte': return 'warning';
      case 'inactif': return 'ellipse-outline';
      default: return 'help-circle';
    }
  };

  const supprimerDevice = (id: string) => {
    Alert.alert(
      'Supprimer le véhicule',
      'Êtes-vous sûr de vouloir supprimer ce véhicule ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            setDevices(devices.filter(d => d.id !== id));
          }
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Device }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.deviceInfo}>
          <Ionicons 
            name={getStatutIcon(item.statut)} 
            size={28} 
            color={getStatutColor(item.statut)} 
          />
          <View>
            <Text style={styles.deviceName}>{item.nom}</Text>
            <Text style={styles.deviceVersion}>v{item.version}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatutColor(item.statut) }]}>
          <Text style={styles.statusBadgeText}>{item.statut.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.deviceDetail}>
          <Ionicons name="person-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.deviceDetailText}>
            Conducteur: {item.conducteur || 'Aucun'}
          </Text>
        </View>
        <View style={styles.deviceDetail}>
          <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.deviceDetailText}>
            Dernière connexion: {new Date(item.derniere_connexion).toLocaleString()}
          </Text>
        </View>
        <View style={styles.deviceDetail}>
          <Ionicons name="alert-circle-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.deviceDetailText}>
            {item.alertes} alerte(s)
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('GestionConducteurs' as never)}
        >
          <Ionicons name="people-outline" size={20} color="#667eea" />
          <Text style={styles.actionBtnText}>Conducteurs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => supprimerDevice(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
          <Text style={[styles.actionBtnText, styles.deleteText]}>Supprimer</Text>
        </TouchableOpacity>
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
            <Text style={styles.title}>🚗 Parc matériel</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AjoutDevice' as never)}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {devices.length} véhicule(s) dans la flotte
          </Text>

          <FlatList
            data={devices}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
            }
            showsVerticalScrollIndicator={false}
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
    fontSize: 22,
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
    marginBottom: 15,
    marginLeft: 8,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceVersion: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 6,
    marginBottom: 12,
  },
  deviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceDetailText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  actionBtnText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: 'rgba(244,67,54,0.1)',
  },
  deleteText: {
    color: '#F44336',
  },
});