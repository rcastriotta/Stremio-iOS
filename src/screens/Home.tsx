import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import colors from '../theme/colors';
import { scale } from 'react-native-size-matters';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import MediaList from '../components/MediaList';
import useCatalog from '../hooks/useCatalog';
import UserOptions from '../components/UserOptions';

export default function Home({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const { searchContent, catalogs } = useCatalog();
  const userOptionsRef = useRef<any>();

  const handleSearch = async () => {
    try {
      if (!searchQuery) return;
      setSearchLoading(true);
      const results = await searchContent(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.log(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQueryTextChange = (newText: string) => {
    if (!newText) setSearchResults(null);
    setSearchQuery(newText);
  };

  const exitQuery = () => {
    handleQueryTextChange('');
    Keyboard.dismiss();
  };
  return (
    <LinearGradient className="flex-1" colors={[colors.background, colors.secondaryBackground]}>
      <SafeAreaView>
        <View className={`w-full p-[5%] h-20 flex-row items-center justify-between `}>
          <TouchableOpacity
            activeOpacity={0.5}
            className="aspect-square overflow-hidden w-[12%]"
            onPress={() => userOptionsRef.current?.open()}>
            <Image source={require('../../assets/logo.png')} className="h-full w-full"></Image>
          </TouchableOpacity>

          <View className="px-5 ml-5 w-[82%] bg-overlay aspect rounded-full aspect-[6] justify-between flex-row items-center border border-borderColor">
            <TextInput
              value={searchQuery}
              onChangeText={handleQueryTextChange}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
              placeholder="Search or paste link"
              placeholderTextColor={colors.secondaryText}
              selectionColor={'white'}
              keyboardAppearance="dark"
              className="text-mainText w-[80%]"
              cursorColor={'white'}></TextInput>
            <TouchableOpacity activeOpacity={0.8} onPress={() => searchQuery.length && exitQuery()}>
              <Ionicons
                name={searchQuery.length ? 'close' : 'search'}
                size={scale(18)}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: scale(50) }}>
        {searchLoading ? (
          <ActivityIndicator color={colors.mainText} className="mt-[10%]" />
        ) : (
          searchResults && (
            <>
              <MediaList
                onMediaPress={itemData => navigation.navigate('Preview', itemData)}
                id={'movie-results'}
                type={'catalog'}
                title="Movie Results"
                showProgress={false}
                availableData={searchResults?.movies}
              />
              <MediaList
                onMediaPress={itemData => navigation.navigate('Preview', itemData)}
                id={'series-results'}
                type={'catalog'}
                title="Series Results"
                showProgress={false}
                availableData={searchResults?.series}
              />
            </>
          )
        )}
        {!searchResults && !searchLoading && (
          <>
            <MediaList
              onMediaPress={itemData => navigation.navigate('Preview', itemData)}
              id={'history'}
              type={'watchHistory'}
              title="Continue Watching"
              showProgress={true}
              maxSize={25}
              refetchOnPageFocus={true}
            />
            {catalogs.map(catalog => (
              <MediaList
                key={catalog.id}
                onMediaPress={itemData => navigation.navigate('Preview', itemData)}
                id={catalog.id}
                type="catalog"
                title={catalog.name}
                showProgress={false}
              />
            ))}
          </>
        )}
      </ScrollView>
      <UserOptions ref={userOptionsRef} />
    </LinearGradient>
  );
}
