import React, { useEffect, useState } from 'react';
import {Text, View, Image} from 'react-native'
import { DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons';
import MainScreen from './MainScreen';
import SettingsScreen from './SettingsScreen';
import EditProfileScreen from './EditProfileScreen';
import ResultGraphScreen from './ResultGraphScreen';
import Logout from './Logout';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser } from '../redux/actions/index'

import { TouchableOpacity } from 'react-native-gesture-handler';
import LineChartExample from './LineChartExample';


const CustomDrawer = ({fetchUser, currentUser}) => {

     const [username, setUsername] = useState('')
     const [profilePicture, setProfilePicture] = useState('')
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username);
            setProfilePicture(currentUser.profilePicture);
        } else {
            fetchUser();
        }
            
        }, [fetchUser, currentUser]);

    

    const Drawer = createDrawerNavigator();


    return (

    <Drawer.Navigator drawerContent = { (props) => {

        return (

            <SafeAreaView>
            <View style={ {
                height:200,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: '#f4f4f4',
                borderBottomWidth: 1,
                backgroundColor: 'grey'


            }}>

                <Image
                    source={profilePicture ? { uri: profilePicture } : require('.././assets/profile-icon.jpeg')}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                    }} 
                />
                <Text
                    style={{
                        fontSize: 22,
                        marginVertical: 6,
                        fontWeight: 'bold',
                        color: '#111'
                    }}
                >
                  {username}

                </Text>

            </View>
            <DrawerItemList {...props}  />
        </SafeAreaView>

        )
        
        }}
        
        >

        <Drawer.Screen
              name="Main"
              component={MainScreen}
              options ={{ drawerIcon: () => (
                  <AntDesign name="home" size={24} color="black" />
                  )}}
          >

          </Drawer.Screen>
          <Drawer.Screen
              name="Settings"
              component={SettingsScreen}
              options ={{ drawerIcon: () => (
                  <AntDesign name="setting" size={24} color="black" />
                  )}}
          />
                    <Drawer.Screen
              name="ResultGraphScreen"
              component={ResultGraphScreen}
              options ={{ drawerIcon: () => (
                <Octicons name="graph" size={24} color="black" />
                  )}}
          />
          <Drawer.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options ={{ drawerIcon: () => (
                  <AntDesign name="user" size={24} color="black" />
                  )}}
          />

          <Drawer.Screen
              name="Logout"
              component={Logout}
              options ={{ drawerIcon: () => (
                  <MaterialIcons name="logout" size={24} color="black" />
                  )}}
          />



      </Drawer.Navigator>

    
        )

}



const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    
});
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);