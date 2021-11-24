import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { useLogin } from '../Context/LoginProvider';
import StanNav from './StanNav';
import { LoginScreen , Home, Sell, ProductScreen,createScreen} from '../screens/index'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Home} name='Home' />
      <Stack.Screen component={LoginScreen} name='LoginScreen' />
      <Stack.Screen component={ProductScreen} name='ProductScreen' />
     
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isLoggedIn } = useLogin();
  return isLoggedIn ? <StanNav /> : <StackNavigator />;
};
export default MainNavigator;