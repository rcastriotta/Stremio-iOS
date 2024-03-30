import { View, TouchableOpacity, Text } from 'react-native';
import { textSizes } from '../theme/text';
import { scale } from 'react-native-size-matters';

interface StreamOptions {
  streamLinks: any[];
  inBottomSheet?: boolean;
  onStreamSelect: (streamData: any) => void;
}
const StreamOptions = ({ streamLinks, onStreamSelect, inBottomSheet = false }: StreamOptions) => {
  return (
    <View
      className={`w-full rounded-[20px] py-6 p-2 ${!inBottomSheet && 'border-2 bg-overlay p-5'} `}
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
      {streamLinks.map((streamData: any, index: number) => {
        const isLast = index === streamLinks.length - 1;
        return (
          <View key={`${streamData.url || streamData.infoHash}:${index}`}>
            <TouchableOpacity
              className={inBottomSheet ? 'bg-overlay p-4 rounded-[18px]' : ''}
              activeOpacity={0.9}
              onPress={() => onStreamSelect(streamData)}>
              <Text className={`text-mainText font-bold ${textSizes.sm}`}>
                {streamData.name.replace(/(\r\n|\n|\r)/gm, ' ')}
              </Text>
              <Text
                className={`text-mainText  mt-1`}
                numberOfLines={2}
                style={{ color: 'rgba(255,255,255,0.9)', fontSize: scale(12) }}>
                {streamData.title.replace(/(\r\n|\n|\r)/gm, ' ')}
              </Text>
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
