import axios from 'axios';
import { useState } from 'react';
import { IMedia, IAddon } from '../utils/types';
import { useUserSlice } from '../store';
import { NetworkInfo } from 'react-native-network-info';

const baseUrl = 'https://api.strem.io/api';
const stremioEndpoints = {
  getWatchHistory: '/datastoreGet',
  getAddons: '/addonCollectionGet',
  login: '/login',
  updateVideoPosition: '/datastorePut',
};

interface IStremioRequest {
  endpoint: string;
  data: any;
  method?: string;
  useToken?: boolean;
}

interface IPositionUpdate {
  id: string;
  name: string;
  type: 'series' | 'movie';
  poster: string;
  timeWatched: number;
  duration: number;
  videoId: string;
  creationTime: string;
}

const useStremio = (): {
  getSortedWatchHistory: () => Promise<IMedia[]>;
  getAvailableStreams: (mediaID: string, type: 'movie' | 'series') => any;
  updateVideoPosition: (data: IPositionUpdate) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getTorrentStreamURL: (infoHash: string, fileIdx: string) => string | null;
} => {
  const [torrentioURL, setTorrentioURL] = useState(null);
  const { reset, setLoggedIn, token, dispatch, streamingURL } = useUserSlice();

  const makeStremioRequest = ({
    endpoint,
    data = {},
    method = 'POST',
    useToken = true,
  }: IStremioRequest) => {
    const config = {
      method,
      url: baseUrl + endpoint,
      data: useToken ? { ...data, authKey: token } : data,
    };

    return axios.request(config).then(({ data }) => data);
  };

  const getSortedWatchHistory = () => {
    console.log('fetching:', 'watchHistory');
    return makeStremioRequest({
      endpoint: stremioEndpoints.getWatchHistory,
      data: {
        collection: 'libraryItem',
        ids: [],
        all: true,
      },
    }).then(({ result }: { result: IMedia[] }) =>
      result
        .filter(r => r.state?.timeOffset > 0)
        .sort((a: IMedia, b: IMedia) => {
          return (
            new Date(b.state?.lastWatched).getTime() - new Date(a.state?.lastWatched).getTime()
          );
        }),
    );
  };

  const getAddons = () => {
    return makeStremioRequest({
      endpoint: stremioEndpoints.getAddons,
      data: {
        type: 'AddonCollectionGet',
        update: true,
      },
    }).then(({ result }) => result.addons);
  };

  const getTorrentioURL = async () => {
    const addons = await getAddons();
    const torrentio = addons.find(
      (addon: IAddon) => addon.manifest.id === 'com.stremio.torrentio.addon',
    );
    if (!torrentio) throw new Error("Couldn't find torrentio plugin");
    const url = torrentio.transportUrl;
    setTorrentioURL(url);
    return url;
  };

  const generateRandomId = () => {
    const characters = 'abcdef0123456789';
    let id = '';

    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }

    return id;
  };

  const getAvailableStreams = async (mediaURL: string, type: 'movie' | 'series') => {
    const addonURL = torrentioURL || (await getTorrentioURL());
    const d = await axios
      .get(addonURL.replace('/manifest.json', `/stream/${type}/${mediaURL}.json`))
      .then(({ data }) => data);
    return d.streams;
  };

  const getTorrentStreamURL = (infoHash: string, fileIdx: string) => {
    if (!streamingURL) return null;
    let parsedURL = String(streamingURL).endsWith('/') ? streamingURL : streamingURL + '/';
    return `${parsedURL}hlsv2/${generateRandomId()}/master.m3u8?mediaURL=${encodeURIComponent(
      `${parsedURL}${infoHash}/${fileIdx}`,
    )}&videoCodecs=h264&videoCodecs=h265&videoCodecs=hevc&audioCodecs=aac&audioCodecs=mp3&audioCodecs=opus&maxAudioChannels=2`;
  };

  const updateVideoPosition = ({
    id,
    name,
    type,
    poster,
    timeWatched,
    duration,
    videoId,
    creationTime,
  }: IPositionUpdate) => {
    const curTime = new Date().toISOString();

    return makeStremioRequest({
      endpoint: stremioEndpoints.updateVideoPosition,
      data: {
        changes: [
          {
            _id: id,
            name,
            type,
            poster,
            posterShape: 'poster',
            removed: true,
            temp: true,
            _ctime: creationTime,
            _mtime: curTime,
            state: {
              lastWatched: curTime,
              timeWatched,
              timeOffset: timeWatched,
              overallTimeWatched: timeWatched,
              timesWatched: 1,
              flaggedWatched: 0,
              duration,
              video_id: videoId,
              noNotif: false,
            },
          },
        ],
        collection: 'libraryItem',
      },
      useToken: true,
    });
  };

  const login = async (email: string, password: string) => {
    const { result, error } = await makeStremioRequest({
      endpoint: stremioEndpoints.login,
      data: {
        email,
        facebook: false,
        password,
        type: 'Login',
      },
      useToken: false,
    }).then(data => data);
    if (error || !result?.user || !result?.authKey) {
      throw new Error(error?.message || 'Failed to login');
    } else {
      dispatch(setLoggedIn({ user: result.user, token: result.authKey }));
    }
  };

  const logout = () => reset();

  return {
    getSortedWatchHistory,
    getAvailableStreams,
    updateVideoPosition,
    login,
    logout,
    getTorrentStreamURL,
  };
};

export default useStremio;
