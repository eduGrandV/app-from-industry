import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GalleryForDashboard } from "../screens/galeryFour/GalleryFourDashboard";
import { SensoryAnalysisScreen } from "../screens/galeryFour/SensoryAnalysisScreen";
import { ExtractionControlScreen } from "../screens/galeryFour/ExtractionControlScreen";
import { BottleControlScreen } from "../screens/galeryFour/BottleControlScreen";
import { BarcodeScannerScreen } from "../screens/galeryFour/BarcodeScannerScreen";
import { EnvaseControlScreen } from "../screens/galeryFour/EnvaseControlScreen";
import { RaisinMonitoringScreen } from "../screens/galeryFour/RaisinMonitoringScreen";
import { WineMonitoringScreen } from "../screens/galeryFour/WineMonitoringScreen";
import { SweetsMonitoringScreen } from "../screens/galeryFour/SweetsMonitoringScreen";
import { PackagingMonitoringScreen } from "../screens/galeryFour/PackagingMonitoringScreen";

const Stack = createNativeStackNavigator();

export function GalleryForNavigator() {
  return (
    <Stack.Navigator initialRouteName="GalleryForDashboard">
      <Stack.Screen
        name="GalleryForDashboard"
        component={GalleryForDashboard}
      />

      <Stack.Screen name="SensoryAnalysis" component={SensoryAnalysisScreen} />

      <Stack.Screen
        name="ExtractionControl"
        component={ExtractionControlScreen}
      />

      <Stack.Screen name="BottleControl" component={BottleControlScreen} />
      <Stack.Screen
        name="BarcodeScanner"
        component={BarcodeScannerScreen}
      />

      <Stack.Screen name="EnvaseControl" component={EnvaseControlScreen} />

      <Stack.Screen
        name="RaisinMonitoring"
        component={RaisinMonitoringScreen}
      />

      <Stack.Screen name="WineMonitoring" component={WineMonitoringScreen} />

      <Stack.Screen name="SweetsMonitoring" component={SweetsMonitoringScreen} />

      <Stack.Screen name="PackagingMonitoring" component={PackagingMonitoringScreen} />


      
    </Stack.Navigator>
  );
}
