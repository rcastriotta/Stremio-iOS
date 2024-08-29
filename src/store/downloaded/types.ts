import * as FileSystem from 'expo-file-system';

export interface IDownloadSnapshot {
  url: string;
  fileUri: string;
  options: object;
  resumeData: string;
}

export interface IVideo {
  id: string;
  title: string;
  status: 'downloading' | 'paused' | 'downloaded' | 'error';
  watchProgress: number;
  downloadProgress: number;
  errorMessage?: string;
  downloadSnapshot?: IDownloadSnapshot;
  downloadResumable?: FileSystem.DownloadPauseState;
  filePath?: string;
  thumbnailUrl?: string;
  thumbnailDownloaded: boolean;
  downloadDate: string;
  thumbnailPath?: string;
}

export interface IDownloadedVideosState {
  videos: IVideo[];
}
