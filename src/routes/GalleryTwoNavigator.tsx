import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WaterQualityScreen } from "../screens/galleryTwo/WaterQualityScreen";
import { GalleryTwoDashboard } from "../screens/galleryTwo/GalleryTwoDashboard";
import { EtaRoutineScreen } from "../screens/galleryTwo/EtaRoutineScreen";

const Stack = createNativeStackNavigator();

export function GalleryTwoNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="GalleryTwoDashboard"
  
    >
      <Stack.Screen
        name="GalleryTwoDashboard"
        component={GalleryTwoDashboard}
      />
      <Stack.Screen name="WaterQuality" component={WaterQualityScreen} />

      <Stack.Screen name="EtaRoutine" component={EtaRoutineScreen} />
    </Stack.Navigator>
  );
}
