import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlice from '../store/user/slice';
import downloadedVideosSlice from '../store/downloaded/slice'; // Adjust this import path as needed

import config from '../utils/config';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);
const persistedDownloadsReducer = persistReducer(persistConfig, downloadedVideosSlice);

const store = configureStore({
  reducer: {
    app: persistedUserReducer,
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
