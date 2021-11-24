
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from './navigation/Authnav';
import LoginProvider from './Context/LoginProvider';









export default function App() {


  return (
    
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>

  
  );
}



