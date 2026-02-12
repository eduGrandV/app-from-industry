import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GalleryThreeHome } from '../screens/galleryThree/GalleryThreeHome';

const Stack = createNativeStackNavigator();

export function GalleryThreeNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="GalleryThreeHome"
        component={GalleryThreeHome}
      />
    </Stack.Navigator>
  );
}
