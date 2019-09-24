import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from '../pages/Home';
import Details from '../pages/MovieDetails';

const stackNavigator = createStackNavigator({ Home, Details }, { initialRouteName: 'Home' });
const AppContainer = createAppContainer(stackNavigator);
export default AppContainer;