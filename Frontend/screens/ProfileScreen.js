
import React, {useState, useEffect,useReducer}from 'react';
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    FlatList,
    Alert,
    TouchableOpacity
  } from 'react-native'
  import { useLogin } from '../Context/LoginProvider';
  import {  Overlay } from 'react-native-elements';
  import * as ImagePicker from 'expo-image-picker';
  import { actionCreators, initialState, reducer } from '../Components/posts'
  import trash from "../assets/trash.png"
  import tools from "../assets/tools.png"
  import AsyncStorage from '@react-native-async-storage/async-storage';
 

  const API_URL = 'http://87.100.203.8:8000'

const ProfileScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { setIsLoggedIn, profile, setProfile, onLoginReceiveTOKEN,token } = useLogin();
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [postImage, setPostImage] = useState('');
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const { posts} = state

  

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    dispatch(actionCreators.loading())

    try {
      const payload = {id};
      const response = await fetch(
        `${API_URL}/api/products/getUserproducts`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          
      },
      body: JSON.stringify(payload),
  }
      )
      const posts = await response.json()
      dispatch(actionCreators.success(posts))
    } catch (e) {
      dispatch(actionCreators.failure())
    }
  }


  const showAlert = () =>
  Alert.alert(
    "DELETE ITEM",
    "Do you want to delete your post",
    [
      {
        text: "DELETE",
        onPress: () => deletePost(),
        style: "DELETE",
      },
      {
        text: "Cancel",
        onPress: () => setId(""),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
   
    }
  );

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


  const modifyPost = () => {
    const formData = new FormData();
    formData.append('image', {
      name: new Date() + 'image',
      uri:   postImage,
      type: 'image/jpg',
    });
    formData.append("id", id);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);

    fetch(`http://87.100.203.8:3001/api/products/updatePost`,{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            
        },
        body: formData
    }).then(async res => { 
      const jsonRes = await res.json();
      Alert.alert("Message", jsonRes.message,
      [
        {text: 'OK', onPress: () => {fetchPosts(); toggleOverlay()}},
      ],);
  })
  }

  const deletePost = () => {
    const payload = {id};
    fetch(`http://87.100.203.8:3001/api/products/deletePost`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            
        },
        body: JSON.stringify(payload),
    }).then(async res => { 
      const jsonRes = await res.json();
      Alert.alert("Message", jsonRes.message,
      [
        {text: 'OK', onPress: () => fetchPosts()},
      ],);
  })
    
    }



    const clearAsyncStorage = async() => {
        AsyncStorage.clear();
    }
    

   
  

    return(
      <View   >
        <Text style={styles.heading}>Profile</Text>
        <Text style={styles.title}>Welcome {profile.username}!</Text>
        <View style={styles.inputs}>
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View >
          <Text>modify your post</Text>
      <View>
        <TextInput placeholder="Title"   onChangeText={setTitle} />
        <TextInput  placeholder="Price" keyboardType='numeric' maxLength={6} onChangeText={setPrice} />
        <TextInput  placeholder="description"  onChangeText={setDescription} />
        <TouchableOpacity
          onPress={openImageLibrary}
        
        >
          {postImage ? (
            <Image
              source={{ uri: postImage }}
              style={{ width: 50, height: 50 }}
            />
          ) : (
            <Text >Upload Image</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity >
          <Text  onPress={modifyPost}>
            Upload
          </Text>
          </TouchableOpacity>
       
      </View>
    </View>
      </Overlay>
    </View>
    <View> 
    <FlatList
    style={styles.container}
        keyExtractor={item => item._id}
        data={posts}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: { _id, title, id, price,description, image}, index }) => (
     
          <View key={_id} style={styles.card}  >
            <View style={styles.cardImgWrapper} >
             <Image style={[styles.image]} source={{uri: image}}/>
            </View>
            <View style={{flex:2, justifyContent:"space-evenly"}}>
            <Text>{title}</Text>
            <Text>Price: {price}€</Text>
            <Text numberOfLines={4}>{description}</Text>
            </View>
            
            
            <View style={styles.cardInfo}>
            <TouchableOpacity onPress={() =>toggleOverlay()} onPressIn={() => setId(_id)} >
            <Image
                          source={tools}
                          style={{
                              width: 30,
                              height: 30
                          }}
                      />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showAlert()} onPressIn={() => setId(_id)} >
            <Image   
                          source={trash}
                          style={{
                              width: 30,
                              height: 30
                          }}
                      />
            </TouchableOpacity>
           </View>
          </View>
          

         
        )}
      />
  </View>
  <View style={{}}>
      <Text style={[
              styles.button,
              { backgroundColor: "#BEB7A4", color: 'black', borderRadius: 8 },
            ]} onPress={
    () => {  setIsLoggedIn(false);
             onLoginReceiveTOKEN(null);
             setProfile("");
             setId("");
             clearAsyncStorage()}}> Log Out</Text>
     </View>
  
    
      </View>)
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent:"space-between" ,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  container: {
     
    height:400,
    
    
  },
  heading: {
  fontSize: 30,
  
 
  marginTop: '15%',
  marginBottom: '5%',
  textAlign: "center",
  color: 'black',
  },
  
  inputs: {
  width: '100%',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '10%',
  },  
  button: {
    textAlign: 'center',
    marginTop:20,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.5,
  },
  image: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',

  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    color: 'black',
    textAlign: "center",
    fontSize: 30,
  },
  cardInfo: {
    justifyContent: 'space-between',
  },
  });


export default ProfileScreen