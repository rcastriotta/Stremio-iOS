import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Preview from '../screens/Preview';
import VideoPlayer from '../screens/VideoPlayer';

// const Tab = createBottomTabNavigator<any>();
// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarStyle: {
//           headerShown: false,
//           backgroundColor: colors.secondaryBackground,
//           borderTopColor: colors.secondaryBackground,
//         },
//       })}>
//       <Tab.Screen name={'Home' as any} options={{ headerShown: false }} component={Home} />
//     </Tab.Navigator>
//   );
// };

const Stack = createNativeStackNavigator<any>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        gestureEnabled: true,
        contentStyle: { backgroundColor: 'black' },
      }}>
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false, orientation: 'portrait' }}
        component={Home}
      />
      <Stack.Screen
        options={{ headerShown: false, orientation: 'portrait' }}
        name="Preview"
        component={Preview}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          orientation: 'all',
          autoHideHomeIndicator: true,
          statusBarHidden: true,
          contentStyle: { backgroundColor: 'black' },
        }}
        name="VideoPlayer"
        component={VideoPlayer}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
