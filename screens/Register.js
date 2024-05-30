import React, { useState } from 'react'
import {Pressable, TextInput, View, Text, StyleSheet} from 'react-native'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useNavigation } from '@react-navigation/native';
import GoogleSignInButton from './GoogleSignInButton';


const Register = ()  =>{

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEmailVerified, setIsEmailVerified] = useState(false);



  const [errorMessage, setErrorMessage] = useState('');

  

  
  const [isValid, setIsValid] = useState(true);

  const navigation = useNavigation();

  const handleFocus = (setState) => () => {
    setErrorMessage('');
    setState(setState || '');
  };

    

    const onRegister = async () => {



        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match');
          return;
        }

        firebase.auth().createUserWithEmailAndPassword(email,password).then((result) => {

          firebase.firestore().collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({
            username,
            email,
            isEmailVerified

          })
            console.log(result);

            setErrorMessage(''); // Clear errors on succes
            
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            

            sendVerificationEmail(); // Call the function to send the email



              

            
            
        }).catch((error) => {
            console.log(error);
            setErrorMessage(error.message ); // Display error message
        });

    }

    const sendVerificationEmail = async () => {
      try {



        const user = firebase.auth().currentUser;

        
        //const verificationCode = generateCode();

        
        await user.sendEmailVerification({
          handleCodeInApp: true,
          url: 'https://freefallexperiment-dev.firebaseapp.com'
        })

        setIsEmailVerified(false);
       
          //alert('Verification email sent')
          
          

        // Optionally, set up a timeout mechanism 
      } catch (error) {
         // Handle errors sending the verification email
      }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.heading}>Enter your personal details to sign up for this app</Text>
            
        {/* Display Error Message if Available */}
        {errorMessage && 
          <Text style={styles.error}>{errorMessage}</Text>}

            <View style={styles.formContainer}>
            <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666" // Light gray color
          value={username}
          onChangeText={setUsername}
          onFocus={handleFocus(setUsername)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666" // Light gray color
            value={email}
            onChangeText={setEmail}
            onFocus={handleFocus(setEmail)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666" // Light gray color
            value={password}
            onChangeText={setPassword}
            onFocus={handleFocus(setPassword)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#666" // Light gray color
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={handleFocus(setConfirmPassword)}
            secureTextEntry
          />
            
            {/* Links for Forgot Password and Login */}  
            <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
                    Forgot Password?
            </Text>
           
            <Text onPress={() => navigation.navigate('Login')}>
              Already have an account? 
              <Text style={styles.link}> Sign In</Text>
            </Text>
            
           

            <Text style={styles.placeholderText}>or continue with Google</Text>

      

            <GoogleSignInButton customText={"Sign Up with google"} />

          

         
            <Pressable style={styles.button} onPress={onRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>

            </View>
        </View>
    )
  }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    heading: {
      fontSize: 14, // Adjust for desired heading size
      color: '#333', // Dark text color (or as preferred)
      marginBottom: 15, // Optional spacing below
    },
    placeholderText: {
      color: '#999', // Light colored black (adjust as needed)
      fontSize: 16,
    },
    formContainer: {
      width: '100%',
      backgroundColor: '#99DEC0',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'blue',
      borderRadius: 5,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    googleButton: {
      backgroundColor: 'red',
      borderRadius: 5,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    error: {
      color: 'red', 
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
  },
  link: {
    color: 'blue', // Style as a clickable link 
    marginTop: 10,
  },
  });
  

export default Register;