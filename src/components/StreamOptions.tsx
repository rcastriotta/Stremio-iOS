import { View, TouchableOpacity, Text } from 'react-native';
import { textSizes } from '../theme/text';
import { scale } from 'react-native-size-matters';
import Ionicons from '@expo/vector-icons/Ionicons';

interface StreamOptions {
  streamLinks: any[];
  inBottomSheet?: boolean;
  onStreamSelect: (streamData: any) => void;
  onDownloadStream: (streamData: any) => void;
}
const StreamOptions = ({
  streamLinks,
  onStreamSelect,
  onDownloadStream,
  inBottomSheet = false,
}: StreamOptions) => {
  return (
    <View
      className={`w-full rounded-[20px] py-6 p-2 ${!inBottomSheet && 'border-2 bg-overlay p-5'} `}
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
      {streamLinks.map((streamData: any, index: number) => {
        const isLast = index === streamLinks.length - 1;
        return (
          <View key={`${streamData.url || streamData.infoHash}:${index}`}>
            <TouchableOpacity
              className={
                inBottomSheet
                  ? 'bg-overlay p-4 rounded-[18px] flex-row items-center justify-between'
                  : 'flex-row items-center justify-between'
              }
              activeOpacity={0.9}
              onPress={() => onStreamSelect(streamData)}>
              <View className="flex w-[88%]">
                <Text className={`text-mainText font-bold ${textSizes.sm}`}>
                  {streamData.name.replace(/(\r\n|\n|\r)/gm, ' ')}
                </Text>
                <Text
                  className={`text-mainText  mt-1`}
                  numberOfLines={2}
                  style={{ color: 'rgba(255,255,255,0.9)', fontSize: scale(12) }}>
                  {streamData.title.replace(/(\r\n|\n|\r)/gm, ' ')}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onDownloadStream(streamData)}
                className="w-[30px] h-[30px] bg-accent rounded-full items-center justify-center">
                <Ionicons name="arrow-down" color={'white'} size={20} />
              </TouchableOpacity>
            </TouchableOpacity>
            {!isLast && !inBottomSheet && <View className="w-full h-[2px] bg-overlay my-[22px]" />}
            {!isLast && inBottomSheet && <View className="w-full my-[5px]" />}
          </View>
        );
      })}
    </View>
  );
};

export default StreamOptions;
