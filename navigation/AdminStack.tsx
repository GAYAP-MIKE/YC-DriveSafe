import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/admin/Login';
import DashboardAdmin from '../screens/admin/DashboardAdmin';
import ListeDevices from '../screens/admin/ListeDevices';
import AjoutDevice from '../screens/admin/AjoutDevice';
import GestionConducteurs from '../screens/admin/GestionConducteurs';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="DashboardAdmin" component={DashboardAdmin} />
      <Stack.Screen name="ListeDevices" component={ListeDevices} />
      <Stack.Screen name="AjoutDevice" component={AjoutDevice} />
      <Stack.Screen name="GestionConducteurs" component={GestionConducteurs} />
    </Stack.Navigator>
  );
}