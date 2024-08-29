import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import Home from '../screens/Home';
import Preview from '../screens/Preview';
import VideoPlayer from '../screens/VideoPlayer';
import colors from '../theme/colors';
import Downloads from '../screens/Downloads';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<any>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'compass' : 'compass-outline';
            return (
              <View style={{ marginTop: 5 }}>
                <Ionicons name={iconName as any} size={28} color={color} />
              </View>
            );
          } else if (route.name === 'Downloads') {
            iconName = focused ? 'download' : 'download-outline';
            return <Ionicons name={iconName as any} size={28} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.secondaryBackground,
          borderTopColor: colors.secondaryBackground,
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Downloads" component={Downloads} />
    </Tab.Navigator>
  );
};
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
        component={TabNavigator}
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
