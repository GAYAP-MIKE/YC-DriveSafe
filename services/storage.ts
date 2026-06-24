import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface Alerte {
  id: string;
  type: 'fatigue' | 'somnolence' | 'distraction';
  timestamp: string;
  niveau: 1 | 2 | 3;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export const saveMode = async (mode: 'conducteur' | 'admin') => {
  await AsyncStorage.setItem('user_mode', mode);
};

export const getMode = async () => {
  return await AsyncStorage.getItem('user_mode');
};

export const saveIpPi = async (ip: string) => {
  await AsyncStorage.setItem('ip_pi', ip);
};

export const getIpPi = async () => {
  return await AsyncStorage.getItem('ip_pi');
};

export const saveTokens = async (tokens: Tokens) => {
  await SecureStore.setItemAsync('tokens', JSON.stringify(tokens));
};

export const getTokens = async () => {
  const raw = await SecureStore.getItemAsync('tokens');
  return raw ? JSON.parse(raw) : null;
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync('tokens');
};

export const saveAlerte = async (alerte: Alerte) => {
  const historique = await getHistorique();
  historique.unshift(alerte);
  if (historique.length > 100) {
    historique.pop();
  }
  await AsyncStorage.setItem('historique', JSON.stringify(historique));
};

export const getHistorique = async (): Promise<Alerte[]> => {
  const raw = await AsyncStorage.getItem('historique');
  return raw ? JSON.parse(raw) : [];
};

export const clearHistorique = async () => {
  await AsyncStorage.removeItem('historique');
};

export const saveConducteur = async (conducteur: any) => {
  const conducteurs = await getConducteurs();
  conducteurs.push(conducteur);
  await AsyncStorage.setItem('conducteurs', JSON.stringify(conducteurs));
};

export const getConducteurs = async () => {
  const raw = await AsyncStorage.getItem('conducteurs');
  return raw ? JSON.parse(raw) : [];
};