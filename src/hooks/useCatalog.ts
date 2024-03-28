import axios from 'axios';

const cinemetaBaseUrl = 'https://cinemeta-catalogs.strem.io';

const cinemetaEndoints: { [id: string]: string } = {
  topMovies: '/top/catalog/movie/top.json',
  topSeries: '/top/catalog/series/top.json',
  topRatedMovies: '/imdbRating/catalog/movie/imdbRating.json',
  topRatedSeries: '/imdbRating/catalog/series/imdbRating.json',
};

const catalogs = [
  { id: 'topMovies', name: 'Top Movies' },
  { id: 'topSeries', name: 'Top Series' },
  { id: 'topRatedMovies', name: 'Featured Movies' },
  { id: 'topRatedSeries', name: 'Featured Series' },
];

const useCatalog = (): {
  fetchCatalog: (type: string, pageParam?: number) => Promise<any>;
  getMediaInfo: (mediaID: string, type: 'movie' | 'series') => any;
  searchContent: (query: string) => Promise<any>;
  catalogs: typeof catalogs;
} => {
  const searchContent = async (query: string) => {
    const baseUrl = 'https://v3-cinemeta.strem.io/catalog';
    const [movieResults, seriesResults] = await Promise.all([
      axios
        .get(`${baseUrl}/movie/top/search=${encodeURIComponent(query)}.json`)
        .then(({ data }) => data.metas),
      axios
        .get(`${baseUrl}/series/top/search=${encodeURIComponent(query)}.json`)
        .then(({ data }) => data.metas),
    ]);
    return { movies: movieResults, series: seriesResults };
  };

  const getMediaInfo = (mediaID: string, type: string) => {
    return axios
      .get(`https://v3-cinemeta.strem.io/meta/${type}/${mediaID}.json`)
      .then(({ data }) => data.meta);
  };

  const fetchCatalog = (type: string, pageParam: number = 0) => {
    const url = cinemetaBaseUrl + cinemetaEndoints[type];
    const urlWithParam = pageParam > 0 ? url.replace('.json', `/skip=${pageParam}.json`) : url;
    console.log('fetching:', urlWithParam);
    return axios
      .get(urlWithParam)
      .then(({ data }) => ({ hasMore: data.hasMore, data: data.metas }));
  };

  return {
    catalogs,
    fetchCatalog,
    getMediaInfo,
    searchContent,
  };
};

export default useCatalog;
