import Login from '../screens/Login';
import { useUserSlice } from '../store';
import MainNavigator from './MainNavigator';

const SwitchNavigator = () => {
  const { loggedIn } = useUserSlice();
  return loggedIn ? <MainNavigator /> : <Login />;
};

export default SwitchNavigator;
