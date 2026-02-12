import 'react-native-gesture-handler'; 
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { AppNavigator } from './src/routes/AppNavigator';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}