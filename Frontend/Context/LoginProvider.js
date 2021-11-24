import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [token, onLoginReceiveTOKEN] = useState(null);


  useEffect(() => {
    getData()
  }, [])
  
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token')
      if(value !== null) {
        fetch(`http://87.100.203.8:8000/api/users/haveToken`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${value}`,
        },
    }).then(async res => { 
      try {
          const jsonRes = await res.json();
          if (res.status !== 200) {
        console.log("fail")
          } else {
              setIsLoggedIn(true)
              console.log("Login successful")
              setProfile(jsonRes.body)
              onLoginReceiveTOKEN(value)
          }
      } catch (err) {
          console.log(err);
      };
  })
      }
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, profile, setProfile,token,onLoginReceiveTOKEN }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;