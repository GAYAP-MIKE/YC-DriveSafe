import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AlerteCardProps = {
  id: string;
  type: 'fatigue' | 'somnolence' | 'distraction';
  timestamp: string;
  niveau: 1 | 2 | 3;
};

export default function AlerteCard({ type, timestamp, niveau }: AlerteCardProps) {
  const getColor = () => {
    switch (type) {
      case 'fatigue': return '#FFC107';
      case 'somnolence': return '#FF5722';
      case 'distraction': return '#F44336';
      default: return '#666';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'fatigue': return 'alert-circle-outline';
      case 'somnolence': return 'bed-outline';
      case 'distraction': return 'warning-outline';
      default: return 'help-circle-outline';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'fatigue': return 'Fatigue';
      case 'somnolence': return 'Somnolence';
      case 'distraction': return 'Distraction';
      default: return type;
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: getColor() }]}>
      <Ionicons name={getIcon()} size={28} color={getColor()} />
      <View style={styles.content}>
        <Text style={styles.title}>{getLabel()}</Text>
        <Text style={styles.time}>{new Date(timestamp).toLocaleString()}</Text>
      </View>
      <View style={[styles.level, { backgroundColor: getColor() }]}>
        <Text style={styles.levelText}>{niveau}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    gap: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  level: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});