import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Vibration,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

// ============================================
// IMPORTS POUR LE MODE RÉEL (RASPBERRY PI)
// ============================================
// import { getPiStatus, activerBuzzer, desactiverBuzzer, PiStatus } from '../../services/apiLocal';
// import { getIpPi } from '../../services/storage';

const { width } = Dimensions.get('window');

type EtatConducteur = 'EVEILLE' | 'FATIGUE' | 'SOMNOLENCE' | 'DISTRACTION';

export default function Dashboard() {
  const navigation = useNavigation();
  
  // ============================================
  // ÉTATS
  // ============================================
  const [etat, setEtat] = useState<EtatConducteur>('EVEILLE');
  const [alerteActive, setAlerteActive] = useState(false);
  const [temps, setTemps] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pour le mode réel
  // const [status, setStatus] = useState<PiStatus | null>(null);
  // const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // ============================================
  // ANIMATIONS
  // ============================================
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const alertAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  // ============================================
  // MISE À JOUR DE L'HEURE
  // ============================================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTemps(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // ANIMATIONS
  // ============================================
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ============================================
  // ═════════════════════════════════════════════
  // MODE DÉMO (SIMULATION SANS RASPBERRY PI)
  // ═════════════════════════════════════════════
  // ============================================
  useEffect(() => {
    const statuses: EtatConducteur[] = ['EVEILLE', 'FATIGUE', 'SOMNOLENCE', 'DISTRACTION'];
    let index = 0;
    
    const interval = setInterval(() => {
      const newEtat = statuses[index % statuses.length];
      setEtat(newEtat);
      
      if (newEtat === 'SOMNOLENCE' || newEtat === 'DISTRACTION') {
        declencherAlerte();
      } else {
        setAlerteActive(false);
        stopAlerte();
      }
      
      index++;
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // ============================================
  // ═════════════════════════════════════════════
  // MODE RÉEL (RASPBERRY PI) - COMMENTÉ
  // ═════════════════════════════════════════════
  // DÉCOMMENTEZ TOUT CE BLOC POUR UTILISER LE PI
  // ============================================
  /*
  // Vérifier la connexion au Pi
  const verifierConnexion = async () => {
    try {
      const ip = await getIpPi();
      if (!ip) {
        setIsConnected(false);
        Alert.alert(
          'Erreur de connexion',
          'Aucun Raspberry Pi configuré.',
          [{ text: 'Configurer', onPress: () => navigation.goBack() }]
        );
        return false;
      }
      return true;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  };

  // Récupérer le statut du Pi
  const fetchStatus = async () => {
    try {
      const data = await getPiStatus();
      setStatus(data);
      setEtat(data.etat);
      setIsConnected(true);
      
      if (data.etat === 'SOMNOLENCE' || data.etat === 'DISTRACTION') {
        declencherAlerte();
      } else {
        if (alerteActive) {
          arreterAlerte();
        }
      }
    } catch (error) {
      console.error('Erreur fetchStatus:', error);
      setIsConnected(false);
    }
  };

  // Démarrer le polling
  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      
      const startPolling = async () => {
        const connected = await verifierConnexion();
        if (!connected || !mounted) return;
        
        await fetchStatus();
        
        const interval = setInterval(() => {
          if (mounted) {
            fetchStatus();
          }
        }, 2000);
        
        setPollingInterval(interval);
      };
      
      startPolling();
      
      return () => {
        mounted = false;
        if (pollingInterval) {
          clearInterval(pollingInterval);
        }
        arreterAlerte();
      };
    }, [])
  );
  */

  // ============================================
  // FONCTIONS ALERTES
  // ============================================
  const declencherAlerte = () => {
    if (!alerteActive) {
      setAlerteActive(true);
      
      // Vibration
      Vibration.vibrate([500, 200, 500, 200, 500], true);
      
      // Haptique
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Animation d'alerte
      Animated.loop(
        Animated.sequence([
          Animated.timing(alertAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(alertAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Alerte visuelle
      Alert.alert(
        '⚠️ ALERTE DÉTECTÉE',
        `État: ${etat}\nNiveau: 3/3`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              setAlerteActive(false);
              stopAlerte();
            }
          },
          { 
            text: 'Voir historique', 
            onPress: () => navigation.navigate('Historique' as never)
          },
        ],
        { cancelable: false }
      );
    }
  };

  const stopAlerte = () => {
    Vibration.cancel();
    alertAnim.setValue(0);
  };

  // ============================================
  // FONCTIONS DU MODE RÉEL (PI) - COMMENTÉES
  // ============================================
  /*
  // Déclencher alerte avec Pi
  const declencherAlertePi = async (data: PiStatus) => {
    if (!alerteActive) {
      setAlerteActive(true);
      
      Vibration.vibrate([500, 200, 500, 200, 500], true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      try {
        await activerBuzzer();
      } catch (error) {
        console.error('Erreur activation buzzer:', error);
      }
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(alertAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(alertAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Alert.alert(
        '⚠️ ALERTE DÉTECTÉE',
        `État: ${data.etat}\nNiveau: ${data.niveau}/3\nConfiance: ${Math.round(data.confiance * 100)}%`,
        [
          { 
            text: 'OK', 
            onPress: async () => {
              await arreterAlertePi();
            }
          },
          { 
            text: 'Voir historique', 
            onPress: () => navigation.navigate('Historique' as never)
          },
        ],
        { cancelable: false }
      );
    }
  };

  // Arrêter l'alerte avec Pi
  const arreterAlertePi = async () => {
    setAlerteActive(false);
    Vibration.cancel();
    alertAnim.setValue(0);
    
    try {
      await desactiverBuzzer();
    } catch (error) {
      console.error('Erreur désactivation buzzer:', error);
    }
  };

  // Réinitialiser avec Pi
  const reinitialiserPi = async () => {
    await arreterAlertePi();
    await fetchStatus();
  };
  */

  // ============================================
  // RÉINITIALISER (MODE DÉMO)
  // ============================================
  const reinitialiser = () => {
    setEtat('EVEILLE');
    setAlerteActive(false);
    stopAlerte();
  };

  // ============================================
  // FONCTIONS UI
  // ============================================
  const getEtatColor = (): string => {
    switch (etat) {
      case 'EVEILLE': return '#4CAF50';
      case 'FATIGUE': return '#FFC107';
      case 'SOMNOLENCE': return '#FF5722';
      case 'DISTRACTION': return '#F44336';
      default: return '#666';
    }
  };

  const getEtatIcon = (): string => {
    switch (etat) {
      case 'EVEILLE': return 'happy-outline';
      case 'FATIGUE': return 'alert-circle-outline';
      case 'SOMNOLENCE': return 'bed-outline';
      case 'DISTRACTION': return 'warning-outline';
      default: return 'help-circle-outline';
    }
  };

  const getEtatMessage = (): string => {
    switch (etat) {
      case 'EVEILLE': return '🟢 Conducteur vigilant';
      case 'FATIGUE': return '🟡 Signes de fatigue';
      case 'SOMNOLENCE': return '🔴 SOMNOLENCE DÉTECTÉE !';
      case 'DISTRACTION': return '🔴 DISTRACTION DÉTECTÉE !';
      default: return etat;
    }
  };

  // ============================================
  // RENDER
  // ============================================
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
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ==========================================
              EN-TÊTE
              ========================================== */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>YC-DriveSafe</Text>
              <Text style={styles.headerSubtitle}>
                {isConnected ? '🟢 Connecté' : '🔴 Déconnecté (Mode démo)'}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.timeText}>{temps}</Text>
              <TouchableOpacity 
                style={styles.historiqueBtn}
                onPress={() => navigation.navigate('Historique' as never)}
              >
                <Ionicons name="time-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ==========================================
              STATUT
              ========================================== */}
          <Animated.View
            style={[
              styles.statusContainer,
              {
                transform: [
                  { scale: alerteActive ? alertAnim : pulseAnim },
                  { rotate: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })},
                ],
              },
            ]}
          >
            <LinearGradient
              colors={alerteActive ? ['#FF1744', '#D50000'] : ['#667eea', '#764ba2']}
              style={styles.statusCard}
            >
              <Ionicons name={getEtatIcon()} size={80} color="#fff" />
              <Text style={styles.statusMessage}>{getEtatMessage()}</Text>
              
              <View style={[styles.badge, { backgroundColor: getEtatColor() }]}>
                <Text style={styles.badgeText}>{etat}</Text>
              </View>
              
              <View style={styles.statusDetails}>
                <Text style={styles.detailText}>
                  Niveau: {etat === 'EVEILLE' ? 1 : etat === 'FATIGUE' ? 2 : 3}/3
                </Text>
                <Text style={styles.detailText}>
                  Confiance: 95%
                </Text>
                <Text style={styles.detailText}>
                  Température: 28.5°C
                </Text>
              </View>
              
              <Text style={styles.statusTime}>
                {temps}
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* ==========================================
              ACTIONS RAPIDES
              ========================================== */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Inscription' as never)}
            >
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="person-add-outline" size={28} color="#fff" />
                <Text style={styles.actionButtonText}>Enrôlement</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={reinitialiser}
            >
              <LinearGradient
                colors={['#2196F3', '#0D47A1']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="refresh-outline" size={28} color="#fff" />
                <Text style={styles.actionButtonText}>Réinitialiser</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ==========================================
              INDICATEUR DE MODE
              ========================================== */}
          <View style={styles.modeIndicator}>
            <Text style={styles.modeText}>
              ⚡ Mode: {isConnected ? 'RÉEL (Pi)' : 'DÉMO (Simulation)'}
            </Text>
          </View>

          <Text style={styles.footer}>© 2026 YC-DriveSafe</Text>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

// ============================================
// STYLES
// ============================================
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  timeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  historiqueBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  statusCard: {
    width: width - 60,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  statusMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 15,
  },
  detailText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    width: '42%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modeIndicator: {
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
  },
  modeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  footer: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
});