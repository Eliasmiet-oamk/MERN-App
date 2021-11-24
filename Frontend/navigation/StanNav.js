
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen , Home, Sell, ProductScreen,createScreen, ProfileScreen} from '../screens/index'


const Stack = createNativeStackNavigator();

const StanNav = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Home} name='Home' />
        <Stack.Screen component={ProductScreen} name='ProductScreen' />
        <Stack.Screen component={ProfileScreen} name='ProfileScreen' />
        <Stack.Screen component={createScreen} name='createScreen' />
      </Stack.Navigator>
    );
  };

  export default StanNav;