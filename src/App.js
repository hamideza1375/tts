import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './index';
const Router = createAppContainer(createStackNavigator({Home}));
export default function App() { return <Router /> }
