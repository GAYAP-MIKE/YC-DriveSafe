import axios, { AxiosInstance } from 'axios';
import { getIpPi, saveAlerte } from './storage';

export interface PiStatus {
  etat: 'EVEILLE' | 'FATIGUE' | 'SOMNOLENCE' | 'DISTRACTION';
  timestamp: string;
  niveau: 1 | 2 | 3;
  confiance: number;
  temperature: number;
  alertes: number;
}

export interface AlertePi {
  id: string;
  type: 'fatigue' | 'somnolence' | 'distraction';
  timestamp: string;
  niveau: 1 | 2 | 3;
}

export interface InscriptionResponse {
  id: string;
  nom: string;
  message: string;
}

export const createApiLocal = async (): Promise<AxiosInstance> => {
  const ip = await getIpPi();
  if (!ip) {
    throw new Error('Aucun Pi configuré - Veuillez scanner le QR Code');
  }
  
  return axios.create({
    baseURL: `http://${ip}:5000/api`,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getPiStatus = async (): Promise<PiStatus> => {
  try {
    const api = await createApiLocal();
    const response = await api.get<PiStatus>('/status');
    
    if (response.data.etat === 'SOMNOLENCE' || response.data.etat === 'DISTRACTION') {
      await saveAlerte({
        id: Date.now().toString(),
        type: response.data.etat === 'SOMNOLENCE' ? 'somnolence' : 'distraction',
        timestamp: response.data.timestamp,
        niveau: response.data.niveau,
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur getPiStatus:', error);
    throw error;
  }
};

export const activerBuzzer = async (): Promise<void> => {
  try {
    const api = await createApiLocal();
    await api.post('/buzzer/on');
  } catch (error) {
    console.error('Erreur activerBuzzer:', error);
    throw error;
  }
};

export const desactiverBuzzer = async (): Promise<void> => {
  try {
    const api = await createApiLocal();
    await api.post('/buzzer/off');
  } catch (error) {
    console.error('Erreur desactiverBuzzer:', error);
    throw error;
  }
};

export const inscrireConducteur = async (
  nom: string,
  embedding: number[]
): Promise<InscriptionResponse> => {
  try {
    const api = await createApiLocal();
    const response = await api.post<InscriptionResponse>('/inscription', {
      nom,
      embedding,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur inscrireConducteur:', error);
    throw error;
  }
};

export const getAlertes = async (limite: number = 50): Promise<AlertePi[]> => {
  try {
    const api = await createApiLocal();
    const response = await api.get<AlertePi[]>(`/alertes?limite=${limite}`);
    return response.data;
  } catch (error) {
    console.error('Erreur getAlertes:', error);
    return [];
  }
};

export const testConnexionPi = async (): Promise<boolean> => {
  try {
    const api = await createApiLocal();
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};