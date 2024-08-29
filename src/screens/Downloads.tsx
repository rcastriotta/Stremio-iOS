import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, SafeAreaView, Image, View, Alert } from 'react-native';
import colors from '../theme/colors';
import { scale } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';
import { useDownloadedVideosSlice } from '../store/downloaded/slice';
import { IVideo } from '../store/downloaded/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { textSizes } from '../theme/text';
import { formatFileSize } from '../utils/utils';

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function Downloads({ navigation }: any) {
  const { videos, removeVideo, dispatch, updateWatchProgress } = useDownloadedVideosSlice();

  const handleDeletePress = (video: IVideo) => {
    Alert.alert('Delete Video', `Are you sure you want to delete "${video.title}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => dispatch(removeVideo(video.id)),
        style: 'destructive',
      },
    ]);
  };

  const onItemPress = (id: string, progress: number, filePath?: string) => {
    if (!filePath) return;
    navigation.navigate('VideoPlayer', {
      url: filePath,
      currentVideoPosition: progress || 0,
      activeEpisode: id,
      existingData: null,
      updateCachedVideoPosition: ({ position }: { position: number }) => {
        if (position > 0) {
          dispatch(updateWatchProgress({ id, progress: position }));
        }
      },
      isOffline: true,
    });
  };

  return (
    <LinearGradient
      className="flex-1 p-[5%]"
      colors={[colors.background, colors.secondaryBackground]}>
      <SafeAreaView className="flex-1">
        {!videos?.length ? (
          <Text className="text-center text-white mt-[40vh] font-bold">No downloads yet</Text>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: scale(50) }}>
            <Text className={`${textSizes.md} text-mainText mb-4 mt-3`}>Downloads</Text>
            {videos.map((video: IVideo) => {
              return (
                <TouchableOpacity
                  onPress={() => onItemPress(video.id, video.watchProgress, video.filePath)}
                  activeOpacity={0.9}
                  key={video.id}
                  className="w-full h-[80px] rounded-[10px] p-2 mb-3 flex-row items-center pr-5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <View className="flex-1 flex-row items-center space-x-2">
                    <View>
                      <Image
                        source={{
                          uri: video.thumbnailDownloaded ? video.thumbnailPath : video.thumbnailUrl,
                        }}
                        className="h-full w-[45px] rounded-[5px] mr-3"
                        resizeMode="cover"
                      />
                    </View>

                    <View className="flex-1 ">
                      <Text className="text-white font-bold mb-1" numberOfLines={1}>
                        {video.title}
                      </Text>
                      {video.watchProgress > 0 ? (
                        <View className="w-[80%] h-[7px] rounded overflow-hidden bg-overlay mt-2">
                          <View
                            className="bg-accent h-[7px] rounded"
                            style={{
                              width: `${video.watchProgress * 100}%`,
                            }}
                          />
                        </View>
                      ) : (
                        <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          {video.status === 'downloading'
                            ? `Downloaded: ${video.downloadProgress?.toFixed(0)}%`
                            : capitalizeFirstLetter(video.status)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="flex items-center space-y-2 ">
                    <TouchableOpacity onPress={() => handleDeletePress(video)}>
                      <Ionicons name="trash-outline" color={'rgba(255,255,255,0.5)'} size={20} />
                    </TouchableOpacity>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                      {formatFileSize(video.fileSize || 0)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
