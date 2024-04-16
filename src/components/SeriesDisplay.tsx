import { View, TouchableOpacity, Text, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../theme/colors';
import { scale } from 'react-native-size-matters';

interface SeriesDisplayProps {
  seasons: any;
  activeSeason: any;
  onItemPress: (id: string) => void;
  openSeasonPicker: (seasons: any[]) => void;
  activeMediaPosition: number;
  activeMediaId: string;
}

const SeriesDisplay = ({
  seasons,
  activeSeason,
  onItemPress,
  openSeasonPicker,
  activeMediaPosition,
  activeMediaId,
}: SeriesDisplayProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return;
    const date = new Date(dateString);
    const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const onChangeSeasonPress = () => {
    const mappings = Object.entries(seasons).map(([name, episodes]: [string, any]) => ({
      id: name,
      name,
      episodes: episodes.length,
    }));
    openSeasonPicker(mappings);
  };

  return (
    <View className="w-full items-start space-y-3">
      <View
        className="w-full bg-overlay rounded-[20px] p-5 border-2 pt-1"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <TouchableOpacity
          className="w-full items-center flex-row justify-between py-5"
          onPress={onChangeSeasonPress}
          activeOpacity={0.8}>
          <View
            className="rounded-[15px] flex-row items-center space-x-2  "
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <Text className="text-mainText font-bold">
              {activeSeason == 0 ? 'Special' : `Season ${activeSeason}`}
            </Text>
            <Ionicons name="chevron-down" color={colors.mainText} size={scale(12)} />
          </View>
          <Text className="text-accent font-bold">
            {seasons[activeSeason]?.length || 0} episodes
          </Text>
        </TouchableOpacity>
        <View className="w-full h-[2px] bg-overlay mb-5" />
        {seasons[activeSeason]?.map((episodeInfo: any, index: number) => {
          const isLast = index === seasons[activeSeason].length - 1;
          return (
            <View key={episodeInfo.id}>
              <TouchableOpacity
                onPress={() => onItemPress(episodeInfo.id)}
                className="flex-row items-center space-x-5"
                activeOpacity={0.9}>
                <Image
                  source={{ uri: episodeInfo.thumbnail }}
                  className="w-[23%] aspect-[1.5] rounded bg-overlay"
                />
                <View className="flex-1 justify-between space-y-3">
                  <Text className="text-mainText flex-1" numberOfLines={2}>
                    {episodeInfo.episode || episodeInfo.number}. {episodeInfo.name}
                  </Text>
                  {activeMediaId === episodeInfo.id ? (
                    <View className="w-[80%] h-[7px] rounded overflow-hidden bg-overlay mb-2">
                      <View
                        className="bg-accent h-[7px] rounded"
                        style={{
                          width: `${activeMediaPosition * 100}%`,
                        }}
                      />
                    </View>
                  ) : (
                    <Text className="text-secondaryText">{formatDate(episodeInfo.released)}</Text>
                  )}
                </View>
              </TouchableOpacity>
              {!isLast && <View className="w-full h-[2px] bg-overlay my-[20px]" />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SeriesDisplay;
