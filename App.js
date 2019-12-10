import { StatusBar, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Description from './src/screens/Description';
import Home from './src/screens/Home';

const App = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
    Description: {
      screen: Description,
    },
  },
  {
    cardStyle: {
      paddingTop: Platform.Android === 'android' ? 0 : StatusBar.currentHeight,
    },
  },
);

export default createAppContainer(App);
