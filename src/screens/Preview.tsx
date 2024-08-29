import {
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import colors from '../theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { scale } from 'react-native-size-matters';
import { textSizes } from '../theme/text';
import { useQuery } from '@tanstack/react-query';
import useCatalog from '../hooks/useCatalog';
import useStremio from '../hooks/useStremio';
import StreamOptions from '../components/StreamOptions';
import SeriesDisplay from '../components/SeriesDisplay';
import SeasonPicker from '../components/SeasonPicker';
import StreamOptionsSheet from '../components/StreamOptionsSheet';
import FadedView from '../components/FadedView';
import { startVideoDownload } from '../store/downloaded/slice';
import { useDispatch } from 'react-redux';

const Preview = ({ navigation, route }: any) => {
  const routeData = route.params || {};
  const { getMediaInfo } = useCatalog();
  const { getAvailableStreams, getTorrentStreamURL } = useStremio();
  const streamsSheetRef = useRef<any>();
  const seasonsSheetRef = useRef<any>();
  const [seasons, setSeasons] = useState({});
  const [episodeStreams, setEpisodeStreams] = useState([]);
  const [loadingEpisodeStreams, setLoadingEpisodeStreams] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);
  const [cachedVideoPosition, setCachedVideoPosition] = useState<{
    episodeId: string;
    position: number;
  } | null>();
  const dispatch = useDispatch();

  const chosenMediaId = useRef<string>(routeData.state?.video_id || routeData.id);
  const chosenEpisodeIndex = useRef<number>(-1);

  const { data: streamLinks, isLoading } = useQuery({
    queryKey: [`${routeData.id}-streams`],
    queryFn: () => getAvailableStreams(routeData.id, routeData.type),
    enabled: routeData.type === 'movie',
    gcTime: 0, // re-pull streams every time to prevent stale data
  });

  const { data: additionalInformation, isLoading: isLoadingAdditionalInfo } = useQuery({
    queryKey: [`${routeData.id}-info`],
    queryFn: () => getMediaInfo(routeData.id, routeData.type),
  });

  const data = additionalInformation || routeData;
  const showLoader = isLoading || isLoadingAdditionalInfo;

  useEffect(() => {
    if (!data?.videos) return;
    const seasons = data.videos.reduce(
      (acc: any, cur: any) => ({
        ...acc,
        [cur.season]: acc[cur.season] ? [...acc[cur.season], cur] : [cur],
      }),
      {},
    );
    setSeasons(seasons);
    const activeSeason = data.videos.find((v: any) => v.id === chosenMediaId.current)?.season;
    if (!isNaN(activeSeason)) setActiveSeason(activeSeason);
  }, [data]);

  const onEpisodePress = async (id: string, index: number) => {
    try {
      chosenMediaId.current = id;
      chosenEpisodeIndex.current = index;
      setEpisodeStreams([]);
      setLoadingEpisodeStreams(true);
      streamsSheetRef.current?.openBottomSheet();
      const streams = await getAvailableStreams(id, 'series');
      setEpisodeStreams(streams);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingEpisodeStreams(false);
    }
  };

  const openSeasonPicker = (seasons: any[]) => {
    seasonsSheetRef.current?.openBottomSheet(seasons);
  };

  const updateCachedVideoPosition = (positionalData: any) => {
    setCachedVideoPosition(positionalData);
  };

  const { activeMediaPosition, activeMediaId } = useMemo(() => {
    if (cachedVideoPosition) {
      const cId = cachedVideoPosition?.episodeId;
      const activeEp = chosenMediaId.current;
      if (cId === activeEp)
        return { activeMediaPosition: cachedVideoPosition?.position, activeMediaId: activeEp };
    } else if (routeData.state) {
      const position = routeData.state.timeOffset / routeData.state.duration;
      return { activeMediaPosition: position, activeMediaId: routeData.state.video_id };
    }
    return { activeMediaPosition: 0, activeMediaId: routeData.id };
  }, [cachedVideoPosition, routeData]);

  const downloadStream = async (streamData: any) => {
    let downloadName = data.name;
    if (chosenEpisodeIndex.current !== -1) {
      downloadName = `S${activeSeason} E${chosenEpisodeIndex.current} - ${data.name}`;
    }

    dispatch(startVideoDownload(streamData.url, downloadName, routeData.poster) as any);
    navigation.navigate('Downloads');
  };

  const goToVideoPlayer = (streamData: any) => {
    const { url, infoHash, fileIdx } = streamData;
    if (!url && !infoHash) {
      Alert.alert('Error', 'Stream URL not found');
      return;
    }

    streamsSheetRef.current?.closeBottomSheet();

    const episodeToLoad = chosenMediaId.current;
    const currentVideoPosition = activeMediaId === chosenMediaId.current ? activeMediaPosition : 0;

    let streamUrl = url;
    if (!url) {
      streamUrl = getTorrentStreamURL(infoHash, fileIdx);
      if (!streamUrl) {
        Alert.alert('Error', 'Add streaming server URL in settings');
        return;
      }
    }

    navigation.navigate('VideoPlayer', {
      url: url || getTorrentStreamURL(infoHash, fileIdx),
      currentVideoPosition,
      activeEpisode: episodeToLoad,
      existingData: routeData,
      updateCachedVideoPosition,
    });
  };

  let content = <></>;
  if (data.videos && routeData.type === 'series') {
    content = (
      <SeriesDisplay
        seasons={seasons}
        activeSeason={activeSeason}
        onItemPress={onEpisodePress}
        openSeasonPicker={openSeasonPicker}
        activeMediaPosition={activeMediaPosition}
        activeMediaId={activeMediaId}
      />
    );
  } else {
    if (streamLinks?.length) {
      content = (
        <StreamOptions
          streamLinks={streamLinks}
          onStreamSelect={goToVideoPlayer}
          inBottomSheet={false}
          onDownloadStream={downloadStream}
        />
      );
    } else {
      content = (
        <Text className="text-mainText">No streams available or torrentio not configured</Text>
      );
    }
  }

  const normalizedRating = useMemo(
    () => (!data.imdbRating ? 3.5 : +data.imdbRating / 2),
    [data.imdbRating],
  );

  const handleSheetChange = (index: any) => {
    if (index === -1) {
      navigation.setOptions({ gestureEnabled: true });
      setEpisodeStreams([]);
    } else {
      navigation.setOptions({ gestureEnabled: false });
    }
  };

  const onSeasonChangePick = (newSeason: number) => {
    seasonsSheetRef.current?.closeBottomSheet();
    setActiveSeason(newSeason);
  };

  return (
    <View className="flex-1 bg-secondaryBackground">
      <View className="flex-1">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.9}
          className="absolute w-[11vw] aspect-[1] z-[90] left-[5vw] top-[5vw]">
          <BlurView
            tint="light"
            className="w-full h-full rounded-[10px] overflow-hidden items-center justify-center ">
            <Ionicons name="close" size={scale(20)} color={colors.mainText} />
          </BlurView>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            className="w-full aspect-[0.9] items-center justify-end"
            source={{ uri: data.background || routeData.poster }}>
            <BlurView intensity={50} tint="dark" className="mt-[70%] w-full h-full "></BlurView>
          </ImageBackground>
          <View
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            className="w-[43vw] aspect-[0.7] border-[4px] z-[1000] mt-[-90%] rounded-[18px] overflow-hidden">
            <Image
              source={{ uri: routeData.poster }}
              className="w-full h-full rounded-[13px]"></Image>
          </View>

          <FadedView>
            <View className="w-full px-[3vw]">
              <View className="flex-row mb-3 space-x-2 items-center">
                <View className={`flex-row space-x-1 items-baseline`}>
                  {!isNaN(normalizedRating) &&
                    new Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Ionicons
                          key={i}
                          name={
                            i < normalizedRating
                              ? i + 1 > normalizedRating
                                ? 'star-half-outline'
                                : 'star'
                              : 'star-outline'
                          }
                          color={colors.mainText}
                          size={scale(14.5)}
                        />
                      ))}
                </View>
                {!!data.year && (
                  <View className="space-x-2 flex-row items-center">
                    <Text
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                      className={` ${textSizes.lg} font-bold`}>
                      ·
                    </Text>
                    <Text className={`text-mainText ${textSizes.sm} font-bold mt-[3px]`}>
                      {data.year.split('–')[0]}
                    </Text>
                  </View>
                )}
              </View>
              <Text className={`text-mainText ${textSizes.lg} font-bold`}>{data.name}</Text>

              <View className="flex-row space-x-3 mt-5">
                {data.genre?.map((name: string) => {
                  return (
                    <View
                      key={name}
                      className="px-[13px] py-[8px] bg-overlay rounded-[12px] border-2 "
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                      <Text
                        className="text-mainText font-bold"
                        style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {name}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <Text className={`text-secondaryText ${textSizes.sm} mt-[5%] `}>
                {data.description}
              </Text>
              {data.type === 'movie' && activeMediaPosition > 0 ? (
                <View
                  className={`w-full h-2 rounded  bg-overlay mt-[3vh] ${
                    activeMediaPosition < 0.05 && 'overflow-hidden'
                  }`}>
                  <View
                    className="bg-accent h-2 rounded"
                    style={{
                      width: `${activeMediaPosition * 100}%`,
                      shadowColor: colors.accent,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                      elevation: 8,
                    }}
                  />
                </View>
              ) : undefined}
            </View>

            <View className="w-full items-center mt-[3vh]">
              {showLoader ? (
                <ActivityIndicator className="mt-3" />
              ) : (
                <View className="w-[100%] items-center">{content}</View>
              )}
            </View>
          </FadedView>
        </ScrollView>
      </View>

      <StreamOptionsSheet
        ref={streamsSheetRef}
        handleSheetChange={handleSheetChange}
        episodeStreams={episodeStreams}
        loading={loadingEpisodeStreams}
        onStreamSelect={goToVideoPlayer}
        onDownloadStream={downloadStream}
      />
      <SeasonPicker
        ref={seasonsSheetRef}
        handleSheetChange={handleSheetChange}
        onSeasonChangePick={onSeasonChangePick}
      />
    </View>
  );
};

export default Preview;
