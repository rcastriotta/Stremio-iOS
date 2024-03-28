import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';
import colors from '../theme/colors';
import { textSizes } from '../theme/text';
import StreamOptions from './StreamOptions';

interface Props {
  loading: boolean;
  episodeStreams: any[];
  handleSheetChange: (index: number) => void;
  onStreamSelect: (url: string) => void;
}

const StreamOptionsSheet = forwardRef(
  ({ loading, episodeStreams, handleSheetChange, onStreamSelect }: Props, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      openBottomSheet: () => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.snapToIndex(0);
        }
      },
      closeBottomSheet: () => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.close();
        }
      },
    }));
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          enableTouchThrough={false}
          {...props}
        />
      ),
      [],
    );
    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['80%']}
        onChange={handleSheetChange}
        index={-1}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
        backgroundStyle={{
          backgroundColor: 'rgb(24,23,28)',
        }}>
        <BottomSheetScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: scale(50) }}>
          <View className="px-2">
            <Text className={`text-mainText mb-4 mt-2 ml-2 font-bold ${textSizes.md}`}>
              Choose a stream
            </Text>
            {loading ? (
              <ActivityIndicator color={colors.mainText} className="mt-[10%]" />
            ) : (
              <View className="w-full items-center">
                {episodeStreams.length ? (
                  <StreamOptions
                    streamLinks={episodeStreams}
                    inBottomSheet={true}
                    onStreamSelect={onStreamSelect}
                  />
                ) : (
                  <Text className="text-mainText mt-[10%]">No streams available</Text>
                )}
              </View>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);
export default StreamOptionsSheet;
