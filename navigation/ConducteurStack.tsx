import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnexionPi from '../screens/conducteur/ConnexionPi';
import Inscription from '../screens/conducteur/Inscription';
import Dashboard from '../screens/conducteur/Dashboard';
import Historique from '../screens/conducteur/Historique';

const Stack = createNativeStackNavigator();

export type ConducteurStackParamList = {
  ConnexionPi: undefined;
  Dashboard: undefined;
  Inscription: undefined;
  Historique: undefined;
};

export default function ConducteurStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="ConnexionPi" component={ConnexionPi} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Inscription" component={Inscription} />
      <Stack.Screen name="Historique" component={Historique} />
    </Stack.Navigator>
  );
}