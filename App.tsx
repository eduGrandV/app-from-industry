import 'react-native-gesture-handler'; 
import React from 'react';
// 1. Importe o componente RootView aqui
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppNavigator } from './src/routes/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator/>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}