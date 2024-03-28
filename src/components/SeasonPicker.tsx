import React, { useRef, useCallback, useImperativeHandle, forwardRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { scale } from 'react-native-size-matters';

interface PropTypes {
  handleSheetChange: (index: number) => void;
  onSeasonChangePick: (newSeason: number) => void;
}

const SeasonPicker = forwardRef(({ handleSheetChange, onSeasonChangePick }: PropTypes, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  useImperativeHandle(ref, () => ({
    openBottomSheet: (availableSeasons: any[]) => {
      setSeasons(availableSeasons);
      bottomSheetRef.current?.snapToIndex(0);
    },

    closeBottomSheet: () => {
      setSeasons([]);
      bottomSheetRef.current?.close();
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
      enableDynamicSizing={true}
      index={-1}
      enablePanDownToClose
      onChange={handleSheetChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
      backgroundStyle={{ backgroundColor: 'rgb(24,23,28)' }}>
      <BottomSheetScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: scale(50),
          paddingHorizontal: '3%',
        }}>
        {seasons.map((item: any, index: number) => {
          const isLast = index === seasons.length - 1;
          return (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => onSeasonChangePick(item.id)}
                className="flex-row items-center justify-between py-[22px] bg-overlay rounded-[18px] px-5 my-[5px]"
                activeOpacity={0.9}>
                <Text className="text-mainText font-bold">
                  {item.id == 0 ? 'Special' : `Season ${item.name}`}
                </Text>
                <Text className="text-secondaryText">{item.episodes} episodes</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default SeasonPicker;
