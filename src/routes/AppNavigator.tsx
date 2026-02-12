import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GalleryOneNavigator } from "./GalleryOneNavigator";
import { GalleryTwoNavigator } from "./GalleryTwoNavigator";
import { GalleryThreeNavigator } from "./GalleryThreeNavigator";
import { GalleryHubScreen } from "./GalleryHubScreen";
import { GalleryForNavigator } from "./GalleryForNavigator";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GalleryHub" component={GalleryHubScreen} />
      <Stack.Screen name="GalleryOne" component={GalleryOneNavigator} />
      <Stack.Screen name="GalleryTwo" component={GalleryTwoNavigator} />
      <Stack.Screen name="GalleryThree" component={GalleryThreeNavigator}/>
      <Stack.Screen name="GalleryFor" component={GalleryForNavigator} />
    </Stack.Navigator>
  );
}
