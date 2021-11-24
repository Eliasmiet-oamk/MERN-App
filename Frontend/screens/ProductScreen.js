
import React, {useState}from 'react';
import {
    Text,
    View,
    Image,
    SafeAreaView,
    StyleSheet,
  } from 'react-native'
  import {useRoute} from '@react-navigation/native';





const ProductScreen = () => {


    const route = useRoute();

    const {item: { _id, id,title,county,contactInfo,seller,city,category,delivery,price,description, image}, index}= route.params;

    function renderItemInfo(){
        return(
        <View>
         
         <Image style={[styles.image]} source={{uri: image}}/>
         <Text style={{alignSelf:"center", marginBottom:10, marginTop: 10, fontWeight: 'bold',}} > {title}</Text>
         <Text style={{alignSelf:"center",  marginLeft:10, marginRight:10}}  >{description}</Text>
         <View style={{flexDirection: 'row',justifyContent:"space-evenly", marginTop:10 }}  >
         <View  >
         <Text  >Seller's Information</Text>
         <Text  >Seller: {seller} </Text>
         <Text  >{contactInfo}</Text>
         <Text style={{ fontWeight: 'bold'}} >Price: {price}€</Text>
         </View>
         <View >
        <Text>LOCATION INFORMATION:</Text>
         <Text  >County: {county}</Text>
         <Text  >City: {city}</Text>
         <Text  >Delivey: {delivery}</Text>
         </View>
         </View>
        </View>)
    }

    return(
        <SafeAreaView >
           {renderItemInfo()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
   
   
   
    image: {
      width:400,
      height:400,
      alignSelf: 'center',
      
  
    }
  })


export default ProductScreen