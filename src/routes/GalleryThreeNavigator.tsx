import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GalleryThreeDashboard } from '../screens/galleryThree/GalleryThreeDashboard';
import { CleaningLogScreen } from '../screens/galleryThree/CleaningLogScreen'; // <--- Importe a tela nova

const Stack = createNativeStackNavigator();

export function GalleryThreeNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="GalleryThreeDashboard"
    >
      <Stack.Screen
        name="GalleryThreeDashboard"
        component={GalleryThreeDashboard}
      />
      
      {/* Essa é a rota genérica que atende Envase, Extração e Vinho */}
      <Stack.Screen 
        name="CleaningLog" 
        component={CleaningLogScreen} 
      />
      
    </Stack.Navigator>
  );
}