import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GalleryThreeDashboard } from "../screens/galleryThree/GalleryThreeDashboard";
import { CleaningLogScreen } from "../screens/galleryThree/CleaningLogScreen"; // <--- Importe a tela nova
import { PestControlScreen } from "../screens/galleryThree/PestControlScreen";

const Stack = createNativeStackNavigator();

export function GalleryThreeNavigator() {
  return (
    <Stack.Navigator initialRouteName="GalleryThreeDashboard">
      <Stack.Screen
        name="GalleryThreeDashboard"
        component={GalleryThreeDashboard}
      />
      <Stack.Screen 
        name="CleaningLog" 
        component={CleaningLogScreen} 
      />

      <Stack.Screen name="PestControl" component={PestControlScreen} />
    </Stack.Navigator>
  );
}
