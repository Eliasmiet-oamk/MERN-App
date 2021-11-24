import React, { useEffect, useReducer, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput
} from 'react-native'
import { actionCreators, initialState, reducer } from '../Components/posts'
import {useNavigation, useIsFocused} from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';




function List( ) {
    const navigation = useNavigation();
    const [state, dispatch] = useReducer(reducer, initialState)
    const [search, setSearch] = useState("");
    const [masterDataSource, setMasterDataSource] = useState([]);


    const isFocused = useIsFocused();
  
    useEffect(() => {
      async function fetchPosts() {
        dispatch(actionCreators.loading())
  
        try {
          const response = await fetch(
            'http://87.100.203.8:8000/api/products/getproducts'
          )
          const posts = await response.json()
          dispatch(actionCreators.success(posts.reverse()))
          setMasterDataSource(posts)
        } catch (e) {
          dispatch(actionCreators.failure())
        }
      }
      if(isFocused){ 
        fetchPosts();
    }
    }, [isFocused])
  
    const { posts, loading, error, } = state
    


  
    if (loading) {
      return (
        <View style={styles.center}>
        
          <ActivityIndicator animating={true} />
        </View>
      )
    }
  
    if (error) {
      return (
        <View style={styles.center}>
          <Text>Failed to load products!</Text>
        </View>
      )
    }


    const searchFilterFunction = (text) => {

      if (text) {

        const newData = posts.filter(function (item) {
          const itemData = item.title
            ? item.title.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        dispatch(actionCreators.success(newData))
        setSearch(text);
      } else {
        
        dispatch(actionCreators.success(masterDataSource))
        setSearch(text);
        
      }
    };
  
    return (
    <View >
         <SearchBar style={styles.input}
          containerStyle={{backgroundColor: '#E0E2DB'}}
          inputStyle={{backgroundColor: '#E0E2DB'}}
          inputContainerStyle={{backgroundColor: '#E0E2DB'}}
          
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="Search.."
         
          value={search}
          lightTheme={true}
        />
      <FlatList
        style={styles.container}
        keyExtractor={item => item._id}
        data={posts}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: { _id, title, id, county,city,category,delivery,description,price,contactInfo,seller,image}, index }) => (
        <TouchableOpacity onPress={() => navigation.navigate("ProductScreen", {item: { _id, id,title,county,contactInfo,seller,city,category,delivery,price,description, image}, index})}>
          <View key={_id} style={styles.product}>
          <View style={styles.flex}>
          <Image
            source={{uri:image}}
            resizeMode="cover"
            style={styles.Img}
          />
        </View>
        <View style={styles.productInfo}>
          <Text>{title}</Text>
          <Text >Price  {price}€</Text>
        </View>
       
          </View>
          </TouchableOpacity>
         
        )}
      />
      </View>
    )
  }



  const styles = StyleSheet.create({
    container: {
     
      height:800,
      backgroundColor: '#E0E2DB',
      
      
    },
    productInfo: {
      padding: 5,
      width: '80%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent:"space-between",
      backgroundColor: '#BEB7A4',
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },  product: {
      height: 200,
      marginVertical: 10,
      shadowColor: '#999',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    flex: {
      flex: 1,
    },
      Img: {
      height: '100%',
      width: '80%',
      alignSelf: 'center',
      borderRadius: 8,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
    input: {
      width: '80%',
      borderBottomWidth: 1,
      borderBottomColor: "#BEB7A4",
      paddingTop: 10,
      fontSize: 16, 
      minHeight: 40,
      },
  })

  export default List;