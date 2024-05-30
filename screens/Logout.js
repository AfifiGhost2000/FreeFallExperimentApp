import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  } from 'react-native';





import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { clearData } from '../redux/actions/index'


const Logout = ({currentUser}) => {

    useEffect(() => {

        handleLogout();
        clearData();

        

    }, [currentUser]);

    const handleLogout = () => {

        firebase.auth().signOut();

    };



}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
  });
  const mapDispatchToProps = (dispatch) => bindActionCreators({clearData}, dispatch)
  
  export default connect(mapStateToProps, mapDispatchToProps)(Logout);