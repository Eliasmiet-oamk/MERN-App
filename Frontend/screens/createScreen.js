import React, { useState } from 'react';
import { View, StyleSheet,  Picker, TouchableOpacity, Switch,Text, Image, TextInput,Alert, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import {useNavigation} from '@react-navigation/native';
import { useLogin } from '../Context/LoginProvider';

const API_URL = 'http://87.100.203.8:8000'


const ImageUpload = () => {
  const {token} = useLogin();
  const [postImage, setPostImage] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState("");
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState); 

  const navigation = useNavigation();
  
  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }

    if (status === 'granted') {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (response.cancelled === false) {
        setPostImage(response.uri);
      }
    }
  };

  const uploadPost = async () => {
    const formData = new FormData();
    formData.append('image', {
      name: new Date() + 'image',
      uri:   postImage,
      type: 'image/jpg',
    });
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("county", county);
    formData.append("city", city);
    formData.append("category", category);
    formData.append("delivery", `${!isEnabled ? "Pickup": "Shipping"}`);

    
    
    try {
      const res = await axios.post(`${API_URL}/api/products/upload`,
        formData,
        {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          
        },
      }).then(function (response) {
        Alert.alert("Message", response.data,
         [
        {text: 'OK', onPress: () => navigation.navigate("Home") },
      ],);
      });

    } catch (error) {
      console.log(error.message);
    }
  };
 
  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
        <TextInput placeholder="Title" style={{flex: 1,borderBottomColor: 'black',borderBottomWidth: 1, }}
           onChangeText={setTitle}/>
        </View>
        <View style={{flexDirection: 'row', justifyContent:"space-between"}}>
        <Picker 
        style={{width:150}} selectedValue={county}
         onValueChange={(itemValue) => setCounty(itemValue)}   mode={"dropdown"}>
          <Picker.Item label="County" value="disabled"/>
          <Picker.Item label="Pohjois-pohjanmaa" value="Pohjois-pohjanmaa"/>
          <Picker.Item label="Uusimaa" value="Uusimaa"/>
          <Picker.Item label="Lappi" value="Lappi"/>
        </Picker>
       <Picker 
         style={{width:100}} selectedValue={city}
          onValueChange={(itemValue, itemIndex) => setCity(itemValue)}mode={"dropdown"}>
          <Picker.Item label="City" value="disabled"/>
          <Picker.Item label="Oulu" value="Oulu"/>
          <Picker.Item label="Helsinki" value="Helsinki"/>
          <Picker.Item label="Rovaniemi" value="Rovaniemi"/>
        </Picker>
        </View>
        <Picker   
        selectedValue={category}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)} >
          <Picker.Item label="Category" value="disabled"/>
          <Picker.Item label="Music" value="Music"/>
          <Picker.Item label="Tech" value="Tech"/>
          <Picker.Item label="Art" value="Art"/>
        </Picker>
        <TextInput  placeholder="Description" multiline style={{width:240}}  onChangeText={setDescription}/>
        <TouchableOpacity
          onPress={openImageLibrary}
          style={styles.uploadBtnContainer}
        >
          {postImage ? (
            <Image
              source={{ uri: postImage }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Text style={styles.uploadBtn}>Upload Image</Text>
          )}
        </TouchableOpacity>
        <Text>Delivery type: </Text>
        <View style={{flexDirection: 'row', justifyContent:"space-between"}}>
        <Switch 
        thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
        style={{flex:1}}
        onValueChange={toggleSwitch}
        value={isEnabled}
        />
     
        {!isEnabled ? <Text style={{flex:3}} > Pickup</Text>: <Text style={{flex:3}}> Shipping</Text>}
        <TextInput style={styles.textInput}   placeholder="Price"  maxLength={6} keyboardType='numeric' onChangeText={setPrice}/>
        </View>
          <Text
            onPress={uploadPost}
            style={[
              styles.skip,
              { backgroundColor: "#BEB7A4", color: 'black', borderRadius: 8 },
            ]}
          >
            Upload
          </Text>
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#E0E2DB'
  },
  textInput: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
},
  uploadBtnContainer: {
    height: 250,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  uploadBtn: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.3,
    fontWeight: 'bold',
  },
  skip: {
    textAlign: 'center',
    marginTop:20,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.5,
  },
});

export default ImageUpload;