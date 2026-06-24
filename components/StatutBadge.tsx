import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatutProps = {
  etat: 'EVEILLE' | 'FATIGUE' | 'SOMNOLENCE' | 'DISTRACTION';
  niveau?: 1 | 2 | 3;
};

export default function StatutBadge({ etat, niveau }: StatutProps) {
  const getColor = () => {
    switch (etat) {
      case 'EVEILLE': return '#4CAF50';
      case 'FATIGUE': return '#FFC107';
      case 'SOMNOLENCE': return '#FF5722';
      case 'DISTRACTION': return '#F44336';
      default: return '#666';
    }
  };

  const getLabel = () => {
    switch (etat) {
      case 'EVEILLE': return '🟢 Éveillé';
      case 'FATIGUE': return '🟡 Fatigue';
      case 'SOMNOLENCE': return '🔴 Somnolence';
      case 'DISTRACTION': return '🔴 Distraction';
      default: return etat;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getColor() + '20' }]}>
      <View style={[styles.dot, { backgroundColor: getColor() }]} />
      <Text style={[styles.text, { color: getColor() }]}>
        {getLabel()}
        {niveau && ` • Niv.${niveau}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});