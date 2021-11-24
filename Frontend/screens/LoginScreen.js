import React, {useState} from "react";

import { View, Text, StyleSheet, TextInput, Alert,TouchableOpacity  } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Buffer} from 'buffer'
import { useLogin } from '../Context/LoginProvider';





const API_URL = 'http://87.100.203.8:8000/api/users'

const LoginScreen = () => {
  const {onLoginReceiveTOKEN, setProfile, setIsLoggedIn} = useLogin();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);


  const onChangeHandler = () => {
    setIsLogin(!isLogin);
    setMessage('');
};

const register = () => {
const payload = {username,email,password};
fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        
        
    },
    body: JSON.stringify(payload),
}).then(async res => { 
    try {
        const jsonRes = await res.json();

        if (res.status !== 201) {
            setIsError(true);
            setMessage("Error");
            
        } else {
            Alert.alert("Message", jsonRes.message,
            [
              {text: 'OK', onPress: () => {onChangeHandler()}},
            ],);
        }
    } catch (err) {
        console.log(err);
    };
})

}


const onSubmitHandler = () => {
    const payload = {username,password};
    var base64encodedData = Buffer.from(username + ':' + password).toString('base64');
    fetch(`${API_URL}/Login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64encodedData}`
            
        },
        body: JSON.stringify(payload),
    })
    .then(async res => { 
        try {
            const jsonRes = await res.json();

            if (res.status !== 200) {
                setIsError(true);
                setMessage("Error");
                
            } else {
                setIsLoggedIn(true)
                await AsyncStorage.setItem('token', jsonRes.token)
                onLoginReceiveTOKEN(jsonRes.token)
                setProfile(jsonRes.body)
            }
        } catch (err) {
            console.log(err);
        };
    })
};




const getMessage = () => {
    const status = isError ? `Error: ` : `Success: `;
    return status + message;
}




return(
  
   

  <View style={styles.card}>
      <Text style={styles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
      <View style={styles.form}>
          <View style={styles.inputs}>
              <TextInput style={styles.input} placeholder="username" autoCapitalize="none" onChangeText={setUsername}></TextInput>
              {!isLogin && <TextInput style={styles.input} placeholder="email" onChangeText={setEmail}></TextInput>}
              <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" onChangeText={setPassword}></TextInput>
              <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
              {isLogin ?   <TouchableOpacity style={styles.button}  onPress={onSubmitHandler} >
                  <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>: <TouchableOpacity style={styles.button}  onPress={register}  >
                  <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity> }
              <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                  <Text style={styles.buttonAltText}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
              </TouchableOpacity>
          </View>    
      </View>
  </View>

);
};

const styles = StyleSheet.create({
card: {
flex: 1,
backgroundColor:'#E0E2DB',
borderRadius: 20,
paddingBottom: '30%',
},
heading: {
fontSize: 30,
fontWeight: 'bold',
marginLeft: '10%',
marginTop: '5%',
marginBottom: '10%',
color: 'black',
},
form: {
flex: 1,
justifyContent: 'space-between',
paddingBottom: '5%',
},
inputs: {
width: '100%',
flex: 1,
alignItems: 'center',
justifyContent: 'center',
paddingTop: '10%',
},  
input: {
width: '80%',
borderBottomWidth: 1,
borderBottomColor: 'black',
paddingTop: 10,
fontSize: 16, 
minHeight: 40,
},
button: {
width: '80%',
backgroundColor: "#BEB7A4",
height: 40,
borderRadius: 50,
justifyContent: 'center',
alignItems: 'center',
marginVertical: 5,
},
buttonText: {
color: 'white',
fontSize: 16,
fontWeight: '400'
},
buttonAlt: {
width: '80%',
borderWidth: 1,
height: 40,
borderRadius: 50,
borderColor: 'black',
justifyContent: 'center',
alignItems: 'center',
marginVertical: 5,
},
buttonAltText: {
color: 'black',
fontSize: 16,
fontWeight: '400',
},
message: {
fontSize: 16,
marginVertical: '5%',
},
});






export default LoginScreen;