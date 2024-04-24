import axios from 'axios';

const cinemetaBaseUrl = 'https://cinemeta-catalogs.strem.io';
const scraperBaseUrl =
  'https://7a82163c306e-stremio-netflix-catalog-addon.baby-beamup.club/aGJtLGhsdSxuZng6OnVzOjE3MTM5Njk2NDcyODM%3D/catalog';
const contentEndpoints: { [id: string]: string } = {
  topMovies: cinemetaBaseUrl + '/top/catalog/movie/top.json',
  topSeries: cinemetaBaseUrl + '/top/catalog/series/top.json',
  topRatedMovies: cinemetaBaseUrl + '/imdbRating/catalog/movie/imdbRating.json',
  topRatedSeries: cinemetaBaseUrl + '/imdbRating/catalog/series/imdbRating.json',
  topNetflixSeries: scraperBaseUrl + `series/nfx.json`,
  topNetflixMovies: scraperBaseUrl + '/movie/nfx.json',
  topHuluSeries: scraperBaseUrl + '/series/hlu.json',
  topHuluMovies: scraperBaseUrl + '/movie/hlu.json',
};

const catalogs = [
  { id: 'topMovies', name: 'Top Movies' },
  { id: 'topSeries', name: 'Top Series' },
  { id: 'topRatedMovies', name: 'Featured Movies' },
  { id: 'topRatedSeries', name: 'Featured Series' },
  { id: 'topNetflixSeries', name: 'Top Netflix Series' },
  { id: 'topNetflixMovies', name: 'Top Netflix Movies' },
  { id: 'topHuluSeries', name: 'Top Hulu Series' },
  { id: 'topHuluMovies', name: 'Top Hulu Movies' },
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
    const url = contentEndpoints[type];
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
