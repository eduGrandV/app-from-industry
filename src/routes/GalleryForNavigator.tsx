import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GalleryForHome } from '../screens/galeryFor/GalleryForHome';


const Stack = createNativeStackNavigator();

export function GalleryForNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="GalleryForHome"
        component={GalleryForHome}
      />
    </Stack.Navigator>
  );
}
