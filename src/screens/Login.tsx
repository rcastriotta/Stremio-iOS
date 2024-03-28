import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { textSizes } from '../theme/text';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import useStremio from '../hooks/useStremio';
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<null | string>(null);
  const { login } = useStremio();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    Keyboard.dismiss();
    const { email, password } = data;
    try {
      setIsLoading(true);
      await login(email, password);
    } catch (err: any) {
      console.log(err);
      setRequestError(err?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-secondaryBackground flex-1">
      <ImageBackground
        source={require('../../assets/background.png')}
        className="flex-1"
        resizeMode="stretch">
        <KeyboardAvoidingView
          behavior={'padding'}
          className="flex-1 justify-center items-center px-[5vw] space-y-8"
          keyboardVerticalOffset={0}
          enabled={true}>
          <View className="w-[25vw] aspect-[2] items-center ">
            <Image
              source={require('../../assets/logo-full.png')}
              className="flex-1"
              resizeMode="contain"
            />
          </View>
          <View className="w-full space-y-3 ">
            <Text className={`${textSizes.lg} text-mainText text-center font-bold`}>
              Freedom to Stream
            </Text>
            <Text className={`${textSizes.sm} text-secondaryText text-center`}>
              All the video content you enjoy in one place
            </Text>
          </View>

          <View className="space-y-4">
            <View
              className={`w-full border-2 border-overlay aspect-[6] bg-overlay rounded-[18px] px-5 ${
                errors.email && 'border-[#FF0000]'
              }`}>
              <Controller
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }: any) => (
                  <TextInput
                    keyboardAppearance="dark"
                    autoComplete="email"
                    className="flex-1"
                    placeholder="Email"
                    placeholderTextColor={colors.secondaryText}
                    selectionColor={'white'}
                    style={{ color: 'white' }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
            </View>

            <View
              className={`w-full border-2 border-overlay aspect-[6] bg-overlay rounded-[18px] px-5 ${
                errors.password && 'border-[#FF0000]'
              }`}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }: any) => (
                  <TextInput
                    keyboardAppearance="dark"
                    autoComplete="current-password"
                    className="flex-1"
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor={colors.secondaryText}
                    selectionColor={'white'}
                    style={{ color: 'white' }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="password"
              />
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator className="w-full aspect-[6.5]" />
          ) : (
            <View className="items-center">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit(onSubmit)}
                className="w-full aspect-[6.5]  bg-accent rounded-[18px]"
                style={{
                  shadowColor: colors.accent,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  elevation: 8,
                }}>
                <LinearGradient
                  colors={['rgb(102,75,221)', 'rgb(24,70,195)']}
                  start={[0, 1]}
                  end={[1, 0]}
                  className="flex-1 items-center justify-center rounded-[18px]">
                  <Text className={`${textSizes.sm} text-mainText font-bold`}>Log in</Text>
                </LinearGradient>
              </TouchableOpacity>
              {requestError && (
                <Text className="color-[#FF0000] font-bold mt-5 absolute bottom-[-40px]">
                  {requestError}
                </Text>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default Login;
