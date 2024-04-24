import { Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { textSizes } from '../theme/text';
import { scale } from 'react-native-size-matters';
import { useInfiniteQuery } from '@tanstack/react-query';
import useCatalog from '../hooks/useCatalog';
import { useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import useStremio from '../hooks/useStremio';
import colors from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface MediaListProps {
  type: 'catalog' | 'watchHistory';
  id: string;
  title: string;
  showProgress: boolean;
  maxSize?: number;
  onMediaPress: (mediaData: any) => void;
  availableData?: any[];
  refetchOnPageFocus?: boolean;
}

const MediaList = ({
  id,
  title,
  showProgress,
  type,
  maxSize = Infinity,
  onMediaPress,
  availableData,
  refetchOnPageFocus,
}: MediaListProps) => {
  const { fetchCatalog } = useCatalog();
  const { getSortedWatchHistory } = useStremio();

  const queryFn = ({ pageParam = 0 }) => {
    return type === 'catalog' ? fetchCatalog(id, pageParam) : getSortedWatchHistory();
  };
  const { data, fetchNextPage, hasNextPage, isLoading, isError, refetch } = useInfiniteQuery({
    queryKey: [id],
    queryFn,
    getNextPageParam: (lastPage, allPages) => {
      return undefined; // TODO tmp until figure out why refreshing
      // if (type === 'watchHistory' || !lastPage.hasMore) return undefined;
      // const totalFetchedItems = allPages.reduce((sum, page) => sum + page.data.length, 0);
      // const reachedMaxLimit = totalFetchedItems >= 300;
      // if (reachedMaxLimit) return undefined;
      // return totalFetchedItems;
    },
    initialPageParam: 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !availableData,
  });

  useFocusEffect(
    useCallback(() => {
      if (refetchOnPageFocus) {
        refetch();
      }
    }, [refetchOnPageFocus]),
  );

  const removeDuplicates = (arr: any[]) => {
    const s = new Set();
    return arr.filter((item: any) => {
      const id = item._id || item.id;
      if (s.has(id)) return false;
      s.add(id);
      return true;
    });
  };

  const combinedData = useMemo(() => {
    try {
      if (availableData) return availableData;
      const rawData =
        type === 'watchHistory'
          ? data?.pages[0]
          : (data?.pages || []).reduce((combined, page) => [...combined, ...page.data], []);
      return removeDuplicates(rawData || []).slice(0, maxSize);
    } catch (err) {
      console.log(err);
      return [];
    }
  }, [data]);

  if (!isLoading && combinedData.length === 0) return <View />;

  return (
    <View className="mt-[5%]">
      <Text className={`${textSizes.md} text-mainText ml-[5%]`}>{title}</Text>
      {isLoading ? (
        <View className="p-[5%] flex-row w-full">
          {new Array(5).fill(null).map((_, index) => (
            <View className="w-[28.6vw] mr-3" key={index}>
              <View key={index} className="aspect-[0.7] w-full bg-overlay rounded-[10px]"></View>
              <View className="w-full mt-3 bg-overlay rounded-[6px] h-[10]" />
              <View className="w-[50%] mt-2 bg-overlay rounded-[6px] h-[10]" />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          horizontal={true}
          data={combinedData}
          className="pl-[5%] mt-[5%] mb-[5%]"
          showsHorizontalScrollIndicator={false}
          onEndReached={() => (hasNextPage ? fetchNextPage() : undefined)}
          contentContainerStyle={{ paddingRight: scale(50) }}
          renderItem={({ item }: { item: any }) => {
            const id = item?.state?.video_id?.split(':')?.[0] || item._id || item.id;

            return (
              <TouchableOpacity
                onPress={() =>
                  onMediaPress({
                    id,
                    poster: item.poster,
                    type: item.type,
                    watchHistory: item.state || null,
                    name: item.name,
                    year: item.year,
                    background: item.background,
                    incomplete: type === 'watchHistory',
                    ...item,
                  })
                }
                activeOpacity={0.9}
                className="mr-3 items-center w-[28.6vw] ">
                <View className="aspect-[0.7] w-full rounded-[10px] overflow-hidden border border-borderColor">
                  <ImageBackground
                    source={{ uri: item.poster }}
                    className="flex-1 rounded-[10px]  overflow-hidden bg-overlay ">
                    {showProgress && !!item.state && (
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                        locations={[0.7, 1]}
                        className="flex-1 justify-end items-center">
                        <View className="w-full bg-progressBarBackground aspect-[13] w-[80%] mb-[10%] rounded overflow-hidden">
                          <View
                            style={{
                              width: item.state
                                ? `${Math.min(
                                    100,
                                    (item.state.timeOffset / item.state.duration) * 100,
                                  )}%`
                                : 0,
                            }}
                            className="rounded h-full bg-progressBarForeground"></View>
                        </View>
                      </LinearGradient>
                    )}
                  </ImageBackground>
                </View>

                <Text numberOfLines={2} className="text-mainText mx-1 mt-4 font-bold text-center">
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item: any) => item._id || item.id}
        />
      )}
    </View>
  );
};
export default MediaList;
