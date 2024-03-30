import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import store from './src/utils/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import SwitchNavigator from './src/navigator/SwitchNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);
  return (
    <Provider store={store}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}>
        <StatusBar barStyle={'light-content'} />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <NavigationContainer theme={DarkTheme}>
              <SwitchNavigator />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PersistQueryClientProvider>
    </Provider>
  );
}

if (__DEV__) {
  const ignoreWarns = ['Non-serializable values were found in the navigation state.'];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      try {
        if (arg[0].startsWith(warning)) {
          return;
        }
      } catch (e) {}
    }
    warn(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
}
