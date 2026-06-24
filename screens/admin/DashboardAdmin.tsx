import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
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
}

export default function DashboardAdmin() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 3,
    actifs: 2,
    alertes: 1,
    conducteurs: 2,
  });
  const [devices] = useState<Device[]>([
    {
      id: '1',
      nom: 'Véhicule 001 - Berline',
      statut: 'actif',
      conducteur: 'Jean Dupont',
      derniere_connexion: new Date().toISOString(),
      alertes: 2,
    },
    {
      id: '2',
      nom: 'Véhicule 002 - SUV',
      statut: 'alerte',
      conducteur: 'Marie Martin',
      derniere_connexion: new Date(Date.now() - 300000).toISOString(),
      alertes: 5,
    },
    {
      id: '3',
      nom: 'Véhicule 003 - Camionnette',
      statut: 'inactif',
      conducteur: 'Aucun',
      derniere_connexion: new Date(Date.now() - 86400000).toISOString(),
      alertes: 0,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return '#4CAF50';
      case 'alerte': return '#6b0d06';
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

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.deviceCard}
      onPress={() => navigation.navigate('GestionConducteurs' as never)}
    >
      <View style={styles.deviceHeader}>
        <View style={styles.deviceInfo}>
          <Ionicons 
            name={getStatutIcon(item.statut)} 
            size={24} 
            color={getStatutColor(item.statut)} 
          />
          <View style={styles.deviceText}>
            <Text style={styles.deviceName}>{item.nom}</Text>
            <Text style={styles.deviceDriver}>
              Conducteur: {item.conducteur || 'Aucun'}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatutColor(item.statut) }]}>
          <Text style={styles.statusBadgeText}>{item.statut.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.deviceFooter}>
        <View style={styles.deviceStat}>
          <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.deviceStatText}>
            {new Date(item.derniere_connexion).toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.deviceStat}>
          <Ionicons name="alert-circle-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.deviceStatText}>{item.alertes} alerte(s)</Text>
        </View>
        <TouchableOpacity 
          style={styles.deviceAction}
          onPress={() => navigation.navigate('GestionConducteurs' as never)}
        >
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
            <View>
              <Text style={styles.headerTitle}>🏢 Administration</Text>
              <Text style={styles.headerSubtitle}>Gestion de la flotte</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Ionicons name="log-out-outline" size={24} color="#f5576c" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.statGradient}
              >
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Véhicules</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.statGradient}
              >
                <Text style={styles.statNumber}>{stats.actifs}</Text>
                <Text style={styles.statLabel}>Actifs</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#F44336', '#D32F2F']}
                style={styles.statGradient}
              >
                <Text style={styles.statNumber}>{stats.alertes}</Text>
                <Text style={styles.statLabel}>Alertes</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                style={styles.statGradient}
              >
                <Text style={styles.statNumber}>{stats.conducteurs}</Text>
                <Text style={styles.statLabel}>Conducteurs</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AjoutDevice' as never)}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.actionGradient}
              >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.actionText}> Ajouter un groupe </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.deviceListHeader}>
            <Text style={styles.deviceListTitle}>🚗 Parc matériel</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ListeDevices' as never)}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
            }
          >
            {devices.map((device) => renderDevice({ item: device }))}
          </ScrollView>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    width: '23%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewAllText: {
    color: '#667eea',
    fontSize: 14,
  },
  deviceCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceText: {
    flex: 1,
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceDriver: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  deviceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deviceStatText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  deviceAction: {
    marginLeft: 'auto',
  },
});