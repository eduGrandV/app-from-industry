import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LabDashboard } from '../screens/galeryOne/LabDashboard';
import { LabFruitScreen } from '../screens/galeryOne/LabFruitScreen';
import { LabExtractionScreen } from '../screens/galeryOne/LabExtractionScreen';
import { LabBottlingScreen } from '../screens/galeryOne/LabBottlingScreen';
import { LabWineScreen } from '../screens/galeryOne/LabWineScreen';

const Stack = createNativeStackNavigator();

export function GalleryOneNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LabDashboard"
      
    >
      <Stack.Screen name="LabDashboard"  component={LabDashboard} />
      <Stack.Screen name="LabFruit" component={LabFruitScreen} />
      <Stack.Screen name="LabExtraction" component={LabExtractionScreen} />
      <Stack.Screen name="LabBottling" component={LabBottlingScreen} />
      <Stack.Screen name="LabWine" component={LabWineScreen} />
    </Stack.Navigator>
  );
}
