import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../contexts/AuthContext";

import { GalleryOneNavigator } from "./GalleryOneNavigator";
import { GalleryTwoNavigator } from "./GalleryTwoNavigator";
import { GalleryThreeNavigator } from "./GalleryThreeNavigator";
import { GalleryHubScreen } from "./GalleryHubScreen";
import { GalleryForNavigator } from "./GalleryFourNavigator";
import { LoginScreen } from "../screens/Auth/LoginScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { usuarioId, carregando } = useContext(AuthContext);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F4F4F5' }}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuarioId ? (
        <>
          <Stack.Screen name="GalleryHub" component={GalleryHubScreen} />
          <Stack.Screen name="GalleryOne" component={GalleryOneNavigator} />
          <Stack.Screen name="GalleryTwo" component={GalleryTwoNavigator} />
          <Stack.Screen name="GalleryThree" component={GalleryThreeNavigator}/>
          <Stack.Screen name="GalleryFor" component={GalleryForNavigator} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}