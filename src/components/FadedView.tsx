import { View } from 'react-native';
import colors from '../theme/colors';
const FadedView = ({ children }: any) => {
  return (
    <View
      className="w-[120vw] h-full bg-secondaryBackground items-center"
      style={{
        marginTop: 100,
        shadowColor: colors.secondaryBackground,
        shadowOffset: {
          width: 0,
          height: -40,
        },
        shadowOpacity: 1,
        shadowRadius: 30.0,
        elevation: 24,
      }}>
      <View
        className="w-[120%] h-full bg-secondaryBackground px-[20%]"
        style={{
          shadowColor: colors.secondaryBackground,
          shadowOffset: {
            width: 0,
            height: -40,
          },
          shadowOpacity: 1,
          shadowRadius: 25.0,
          elevation: 24,
        }}>
        {children}
      </View>
    </View>
  );
};

export default FadedView;
