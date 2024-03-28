interface IMedia {
  _ctime: string;
  _id: string;
  _mtime: string;
  background: string;
  logo: string;
  name: string;
  poster: string;
  posterShape: string;
  removed: boolean;
  state: {
    duration: number;
    episode: number;
    flaggedWatched: number;
    lastWatched: string;
    noNotif: boolean;
    overallTimeWatched: number;
    season: number;
    timeOffset: number;
    timeWatched: number;
    timesWatched: number;
    video_id: string;
    watched: string;
  };
  temp: boolean;
  type: string;
  year: string;
}

interface ISuggestion {
  imdb_id: string;
  name: string;
  type: string;
  cast: string[];
  country: string;
  description: string;
  genre: string[];
  imdbRating: string;
  released: string;
  slug: string;
  year: string;
  moviedb_id: number;
  popularities: {
    moviedb: number;
    stremio: number;
    stremio_lib: number;
    trakt: number;
  };
  poster: string;
  runtime: string;
  status: string;
  tvdb_id: number;
  director: string[];
  writer: string[];
  trailers: {
    source: string;
    type: string;
  }[];
  background: string;
  logo: string;
  popularity: number;
  id: string;
  videos: {
    name: string;
    season: number;
    number: number;
    firstAired: string;
    tvdb_id: number;
    rating: number;
    overview: string;
    thumbnail: string;
    id: string;
    released: string;
    episode: number;
    description: string;
  }[];
  genres: string[];
  releaseInfo: string;
  trailerStreams: {
    title: string;
    ytId: string;
  }[];
  links: {
    name: string;
    category: string;
    url: string;
  }[];
  behaviorHints: {
    defaultVideoId: string | null;
    hasScheduledVideos: boolean;
  };
}

interface IAddon {
  transportUrl: string;
  transportName: string;
  manifest: {
    id: string;
    version: string;
    name: string;
    description?: string;
    logo?: string;
    background?: string;
    resources: string[];
    types: string[];
    idPrefixes?: string[];
    catalogs: ICatalog[];
    behaviorHints?: {
      configurable: boolean;
      configurationRequired: boolean;
    };
  };
  flags: {
    official?: boolean;
    protected?: boolean;
  };
}

interface ICatalog {
  type: string;
  id: string;
  name: string;
  genres?: string[];
  extra?: IExtra[];
  extraSupported?: string[];
  extraRequired?: string[];
  pageSize?: number;
}

interface IExtra {
  name: string;
  options?: string[];
  isRequired?: boolean;
  optionsLimit?: number;
}

interface ICatalogItem {
  imdb_id: string;
  name: string;
  type: string;
  cast: string[];
  country: string;
  description: string;
  genre: string[];
  imdbRating: string;
  released: string;
  slug: string;
  writer: string[];
  year: string;
  runtime: string;
  status: string;
  tvdb_id: number;
  moviedb_id: number;
  popularities: {
    moviedb: number;
    stremio: number;
    stremio_lib: number;
    trakt: number;
  };
  poster: string;
  trailers: {
    source: string;
    type: string;
  }[];
  director: string[];
  background: string;
  logo: string;
  popularity: number;
  id: string;
  videos: {
    name: string;
    season: number;
    number: number;
    firstAired: string;
    tvdb_id: number;
    rating: number;
    overview: string;
    thumbnail: string;
    id: string;
    released: string;
    episode: number;
    description: string;
  }[];
  genres: string[];
  releaseInfo: string;
  trailerStreams: {
    title: string;
    ytId: string;
  }[];
  links: {
    name: string;
    category: string;
    url: string;
  }[];
  behaviorHints: {
    defaultVideoId: string | null;
    hasScheduledVideos: boolean;
  };
}

export { IMedia, IAddon, ICatalogItem };
