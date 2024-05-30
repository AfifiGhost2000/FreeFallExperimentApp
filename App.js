// App.js
import 'react-native-gesture-handler';
import React, {useEffect, useState, useRef} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native'; // If using navigation
import LottieView from 'lottie-react-native';
//import lottie from 'lottie-web';


import { createStackNavigator } from '@react-navigation/stack';

import { View, Text, Platform } from 'react-native'
import Register from './screens/Register'; 
import Login from './screens/Login';
import CheckEmailScreen from './screens/CheckEmailScreen';
import ForgotPassword from './screens/ForgotPassword';
import CustomDrawer from './screens/CustomDrawer';


import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore'; // Add other services as needed



import {Provider} from 'react-redux'
import { configureStore, current } from '@reduxjs/toolkit';
// // import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers/index'
import thunk from 'redux-thunk'
import LineChartExample from './screens/LineChartExample';
import CustomSplashScreen from './screens/CustomSplashScreen';



const store = configureStore({ reducer: rootReducer })




// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzoxshaMUjlOADYh2oEuBHwo3sw7CSRB8",
  authDomain: "freefallexperiment-dev.firebaseapp.com",
  projectId: "freefallexperiment-dev",
  storageBucket: "freefallexperiment-dev.appspot.com",
  messagingSenderId: "971844536299",
  appId: "1:971844536299:web:519ee88a4030b1009cbbae",
  measurementId: "G-BCNNN8J02X"
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}
const App = () => {

const Stack = createStackNavigator();




const containerRef = useRef(null);
const [loggedIn, setLoggedIn] = useState(false);
const [loaded, setLoaded] = useState(false);
const [needsEmailCheck, setNeedsEmailCheck] = useState(false);

useEffect(() => {
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (!user ) {
      setLoggedIn(false); 

    } else {
      setLoggedIn(true);   

      const fetchUserData = async () => {
        const userId = firebase.auth().currentUser.uid;
        const userDocRef = firebase.firestore().collection('users').doc(userId);

        try {
            const userDoc = await userDocRef.get();
            if (!userDoc.data().isEmailVerified) {
                setNeedsEmailCheck(true);
            } 
            else {
              setNeedsEmailCheck(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    fetchUserData(); 

      
    }


    
  });

  const timer = setTimeout(() => {
    setLoaded(true);
  }, 3000); // Delay for 3 seconds
    
      //  const animation = lottie.loadAnimation({
      //   container: containerRef.current,
      //   renderer: 'svg',
      //   loop: true,
      //   autoplay: true,
      //   path: './assets/loading.json',
      // });
      //   // Set a timer to destroy the animation
      // const animationTimeout = setTimeout(() => {
      //   animation.destroy(); 
      // }, 5000); // Example: Destroy after 5 seconds

      return () => {
        unsubscribe;
        clearTimeout(timer);
      } // Cleanup function for useEffect



}, [needsEmailCheck]); 

if(!loaded) {
  return (
  <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

    <LottieView
            style={{  width: 200, height: 200 }}
            source={require('./assets/loading.json')}
            autoPlay
            loop
          /> 

  </View>
    
      /* <View style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px' }} ref={containerRef} /> */


  )
}
// || !firebase.auth().currentUser.emailVerified
if(!loggedIn ){

    return (

      <NavigationContainer>

        <Stack.Navigator initialRouteName = "CustomSplashScreen" >
                
                <Stack.Screen
                  name="CustomSplashScreen"
                  component={CustomSplashScreen}
                  options={{
                    headerShown: false
                  }}
               
                />
              
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{
                    headerShown: false
                  }}
               
                />

                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    headerShown: false
                  }}

                  />

                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                  options={{
                    headerShown: false
                  }}
               
                />





                
                
                
        </Stack.Navigator>
      </NavigationContainer>

    );
  }

  if (needsEmailCheck) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="CheckEmail"
            component={CheckEmailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false
                  }}

          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
    return (
      <Provider store={store}>

        <NavigationContainer>

          {/* <CustomDrawer /> */}

          
            <Stack.Navigator>



              <Stack.Screen
                    name="CustomDrawer"
                    component={CustomDrawer}
                    options={{
                      headerShown: false
                    }}

              /> 

                  


            </Stack.Navigator>

            

            
        </NavigationContainer>
      
      </Provider>

 
    );
  
};

export default App;
