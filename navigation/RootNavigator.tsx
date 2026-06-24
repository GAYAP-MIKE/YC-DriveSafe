import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModeSelection from '../screens/ModeSelection';
import ConducteurStack from './ConducteurStack';
import AdminStack from './AdminStack';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  ModeSelection: undefined;
  Conducteur: undefined;
  Admin: undefined;
};

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ModeSelection" component={ModeSelection} />
      <Stack.Screen name="Conducteur" component={ConducteurStack} />
      <Stack.Screen name="Admin" component={AdminStack} />
    </Stack.Navigator>
  );
}