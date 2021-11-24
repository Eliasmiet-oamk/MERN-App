
import React from 'react';
import {Image, View, Text, TouchableOpacity} from 'react-native';
import usericon from "../assets/user.png"
import {useNavigation} from '@react-navigation/native';
import pencilIcon from "../assets/pencil.png"
import { useLogin } from '../Context/LoginProvider';




function Header() {
    const {  profile, isLoggedIn} = useLogin();
    const navigation = useNavigation();
    return(
      <View style={{flexDirection: 'row', height: 50, backgroundColor:"#BEB7A4"}}>
         <TouchableOpacity  isLoggedIn onPress={() => isLoggedIn?  navigation.navigate("createScreen") : alert("Must log in")}
                style={{
                          width: 50,
                          paddingLeft: 25,
                          justifyContent: 'center'
                      }}
                  >
                      <Image
                          source={pencilIcon}
                          style={{
                              width: 30,
                              height: 30
                          }}
                      />
                  </TouchableOpacity>
                  
       <View style={{alignItems:"center", justifyContent:"center", flex:1}}>
     <Text style={{fontWeight: 'bold'}} >APP NAME</Text>
     </View > 
     <TouchableOpacity  onPress={() => isLoggedIn? navigation.navigate("ProfileScreen") :  navigation.navigate("LoginScreen") } 
                style={{
                          width: 50,
                          paddingRight: 50,
                          justifyContent: 'center'
                      }}
                  >
                  {  isLoggedIn? 
                      <Text style={{fontWeight: 'bold', width:50}}>Hi {profile.username}!</Text> 
                      :
                      <Image
                      source={ usericon}
                      style={{
                          width: 30,
                          height: 30
                      }}
                  />}
                  </TouchableOpacity>
      </View>
    )
  }
  export default Header;