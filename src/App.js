import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './index';
const Router = createAppContainer(createStackNavigator({Home}));

const App = () => <Router />

export default App
// a