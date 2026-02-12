import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GalleryForHome } from '../screens/galeryFor/GalleryForHome';

const Stack = createNativeStackNavigator();

export function GalleryTwoNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="GalleryForHome"
        component={GalleryForHome}
      />
    </Stack.Navigator>
  );
}
