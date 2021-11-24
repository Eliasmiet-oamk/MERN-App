import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Components/Header'
import List from '../Components/List'


function Home() {    


return(
  <SafeAreaView>
    {Header()}
   {List()}
  </SafeAreaView>
)
}



export default Home