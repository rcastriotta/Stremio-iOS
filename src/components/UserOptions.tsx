import React, { useRef, useCallback, useImperativeHandle, forwardRef, useMemo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { scale } from 'react-native-size-matters';
import { useUserSlice } from '../store';

const UserOptions = forwardRef((_, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { logout, dispatch } = useUserSlice();

  const options = useMemo(
    () => [
      { name: 'Configure streaming URL', f: () => {} },
      { name: 'Contact', f: () => {} },
      { name: 'Logout', f: () => dispatch(logout()) },
    ],
    [logout],
  );

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.snapToIndex(0);
    },

    close: () => {
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
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
      backgroundStyle={{ backgroundColor: 'rgb(24,23,28)' }}>
      <BottomSheetScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: scale(50),
          paddingHorizontal: '3%',
        }}>
        {options.map((item: any, index: number) => {
          const isLast = index === options.length - 1;
          return (
            <View key={item.name}>
              <TouchableOpacity
                onPress={item.f}
                className="flex-row items-center justify-between py-[22px] bg-overlay rounded-[18px] px-5 my-[5px]"
                activeOpacity={0.9}>
                <Text className="text-mainText font-bold">{item.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default UserOptions;
