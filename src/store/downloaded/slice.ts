import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '../../utils/store';
import { IDownloadedVideosState, IVideo } from './types';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { Alert } from 'react-native';

const initialState: IDownloadedVideosState = {
  videos: [],
};

let activeDownloads: { [key: string]: FileSystem.DownloadResumable } = {};

const slice = createSlice({
  name: 'downloadedVideos',
  initialState,
  reducers: {
    addVideo: (state: IDownloadedVideosState, { payload }: PayloadAction<IVideo>) => {
      state.videos.unshift(payload);
    },
    removeVideo: (state: IDownloadedVideosState, { payload }: PayloadAction<string>) => {
      const videoToRemove = state.videos.find(video => video.id === payload);
      if (videoToRemove && videoToRemove.filePath) {
        // Remove the file from the filesystem
        FileSystem.deleteAsync(videoToRemove.filePath, { idempotent: true }).catch(error =>
          console.error('Error deleting file:', error),
        );
      }

      if (activeDownloads[payload]) {
        activeDownloads[payload].cancelAsync().catch(() => {});
        delete activeDownloads[payload];
      }

      if (videoToRemove?.thumbnailPath) {
        FileSystem.deleteAsync(videoToRemove.thumbnailPath, { idempotent: true }).catch(error =>
          console.error('Error deleting thumbnail:', error),
        );
      }
      state.videos = state.videos.filter(video => video.id !== payload);
    },
    updateVideo: (state: IDownloadedVideosState, { payload }: PayloadAction<IVideo>) => {
      const index = state.videos.findIndex(video => video.id === payload.id);
      if (index !== -1) {
        state.videos.splice(index, 1);
        state.videos.unshift(payload);
      }
    },
    updateVideoStatus: (
      state: IDownloadedVideosState,
      { payload }: PayloadAction<{ id: string; status: IVideo['status']; errorMessage?: string }>,
    ) => {
      const video = state.videos.find(v => v.id === payload.id);
      if (video) {
        video.status = payload.status;
        if (payload.status === 'error' && payload.errorMessage) {
          video.errorMessage = payload.errorMessage;
        }
        // Move the updated video to the top of the list
        state.videos = [video, ...state.videos.filter(v => v.id !== payload.id)];
      }
    },
    updateVideoData: (
      state: IDownloadedVideosState,
      {
        payload,
      }: PayloadAction<{
        id: string;
        data: { [key: string]: any };
      }>,
    ) => {
      const index = state.videos.findIndex(v => v.id === payload.id);
      if (index !== -1) {
        const video = { ...state.videos[index], ...payload.data };
        state.videos.splice(index, 1);
        state.videos.unshift(video);
      }
    },
    updateDownloadProgress: (
      state: IDownloadedVideosState,
      {
        payload,
      }: PayloadAction<{
        id: string;
        progress: number;
        status: IVideo['status'];
        downloadResumable?: FileSystem.DownloadResumable;
      }>,
    ) => {
      const index = state.videos.findIndex(v => v.id === payload.id);
      if (index !== -1) {
        const video = state.videos[index];
        video.downloadProgress = payload.progress;
        video.status = payload.status;
        if (payload.downloadResumable) {
          video.downloadResumable = payload.downloadResumable.savable();
        }
      }
    },
    updateWatchProgress: (
      state: IDownloadedVideosState,
      {
        payload,
      }: PayloadAction<{
        id: string;
        progress: number;
      }>,
    ) => {
      const index = state.videos.findIndex(v => v.id === payload.id);
      if (index !== -1) {
        const video = state.videos[index];
        video.watchProgress = payload.progress;
        state.videos.splice(index, 1);
        state.videos.unshift(video);
      }
    },
    setVideoError: (
      state: IDownloadedVideosState,
      { payload }: PayloadAction<{ id: string; errorMessage: string }>,
    ) => {
      const video = state.videos.find(v => v.id === payload.id);
      if (video) {
        video.status = 'error';
        video.errorMessage = payload.errorMessage;
      }
    },
    clearAllVideos: (state: IDownloadedVideosState) => {
      // Remove all files from the filesystem
      state.videos.forEach(video => {
        if (video.filePath) {
          FileSystem.deleteAsync(video.filePath, { idempotent: true }).catch(error =>
            console.error('Error deleting file:', error),
          );
        }

        if (video?.thumbnailPath) {
          FileSystem.deleteAsync(video.thumbnailPath, { idempotent: true }).catch(error =>
            console.error('Error deleting thumbnail:', error),
          );
        }
      });
      state.videos = [];
    },
  },
});

export function useDownloadedVideosSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state: any = useSelector(({ downloadedVideos }: State) => downloadedVideos);
  return { dispatch, ...state, ...slice.actions };
}

const getFileExtension = (url: string): string => {
  const cleanUrl = url.split('?')[0];
  const fileName = cleanUrl.split('/').pop() || '';
  const fileExtension = fileName.split('.').pop() || '';
  return fileExtension.toLowerCase();
};

export const startVideoDownload =
  (url: string, title: string, thumbnailUrl: string) => async (dispatch: Dispatch) => {
    const videoFileExtension = getFileExtension(url);
    const thumbnailFileExtension = getFileExtension(thumbnailUrl);

    const id = randomUUID();
    const filePath = `${FileSystem.documentDirectory}${id}.${videoFileExtension}`;
    const thumbnailPath = `${FileSystem.documentDirectory}${id}_thumbnail.${thumbnailFileExtension}`;

    dispatch(
      slice.actions.addVideo({
        id,
        title,
        filePath,
        thumbnailUrl,
        downloadDate: new Date().toISOString(),
        downloadProgress: 0,
        watchProgress: 0,
        status: 'downloading',
        thumbnailPath,
        thumbnailDownloaded: false,
      }),
    );

    try {
      await FileSystem.downloadAsync(thumbnailUrl, thumbnailPath);
      dispatch(slice.actions.updateVideoData({ id, data: { thumbnailDownloaded: true } }));
    } catch (e) {
      console.error('Failed to download thumbnail:', e);
    }

    try {
      let lastProgress = 0;
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        filePath,
        {},
        downloadProgress => {
          const progress =
            (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
          if (progress === 100 || progress - lastProgress > 1) {
            lastProgress = progress;
            dispatch(
              slice.actions.updateDownloadProgress({
                id,
                progress,
                status: 'downloading',
              }),
            );
          }
        },
      );

      activeDownloads[id] = downloadResumable;
      await downloadResumable.downloadAsync();
      dispatch(slice.actions.updateVideoStatus({ id, status: 'downloaded' }));
      delete activeDownloads[id];
    } catch (error: any) {
      dispatch(
        slice.actions.setVideoError({
          id,
          errorMessage: error?.message || 'An error occurred during download',
        }),
      );
      dispatch(
        slice.actions.updateVideoStatus({
          id,
          status: 'error',
        }),
      );
      Alert.alert(error?.message || 'An error occurred during download');
    }
  };

export default slice.reducer;
