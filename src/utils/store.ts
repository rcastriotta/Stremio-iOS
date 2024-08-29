import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlice from '../store/user/slice';
import downloadedVideosSlice from '../store/downloaded/slice'; // Adjust this import path as needed

import config from '../utils/config';

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
};

const downloadsPersistConfig = {
  key: 'downloads',
  storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedDownloadsReducer = persistReducer(downloadsPersistConfig, downloadedVideosSlice);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    downloadedVideos: persistedDownloadsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: config.ENV === 'dev',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export default store;
