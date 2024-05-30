import React, { useEffect, useState, useRef} from 'react';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import LottieView from 'lottie-react-native';

// import { useSelector } from 'react-redux';

const CheckEmailScreen = ({navigation}) => {
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    //Function to check if the current time has exceeded one hour from the provided timestamp
  const hasExceededOneHour = (timestamp) => {
    const oneHourInMilliseconds = 60 * 60 * 1000; // 1 hour in milliseconds
    const currentTime = firebase.firestore.Timestamp.now().toMillis();
    const emailSentTime = timestamp.toMillis();
    return (currentTime - emailSentTime) > oneHourInMilliseconds;
  };
  const containerRef = useRef(null);

  useEffect(() => {

    const checkEmailVerification = async () => {
      try {
        const user = firebase.auth().currentUser;
        await user.reload();
        // Store the current timestamp in Firestore when sending the email
        const emailSentTimestamp = firebase.firestore.Timestamp.now();
        if (user && user.emailVerified && !hasExceededOneHour(emailSentTimestamp)) {
          // Email is verified, update Firestore accordingly
          await firebase.firestore().collection('users').doc(user.uid).update({
            isEmailVerified: true
          });
          setVerificationComplete(true);
        } 
        
      } catch (error) {
        setErrorMessage('Email verification failed. Please try again:'+  error.message);
      }
    };

    // const animation = lottie.loadAnimation({
    //   container: containerRef.current,
    //   renderer: 'svg',
    //   loop: true,
    //   autoplay: true,
    //   path: './assets/verification.json',
    // });
      // Set a timer to destroy the animation
    // const animationTimeout = setTimeout(() => {
    //   animation.destroy(); 
    // }, 5000); // Example: Destroy after 5 seconds

    return () => {
      checkEmailVerification();
      //clearTimeout(animationTimeout); // Clear the timeout
    };
  }, [verificationComplete]);

  const handleResendEmail = async () => {
    try {
      const user = firebase.auth().currentUser;
      await user.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://freefallexperiment-dev.firebaseapp.com'
      })
      console.log('Verification email resent');
    } catch (error) {
      setErrorMessage('Error resending verification email:'+ error.message);
    }
  };

  return (
    <View style={styles.container}>
              
              {errorMessage && 
          <Text style={styles.error}>{errorMessage}</Text>}
      {verificationComplete ? (
        <>
          <Text style={styles.text}>Email Verified!</Text>

          {/* <View style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px' }} ref={containerRef} /> */}
          <LottieView
            style={{ flex: 1, width: 200, height: 200 }}
            source={require('../assets/verification.json')}
            autoPlay
            loop
          /> 
          
         
          <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Continue </Text> 
          </Pressable>   
        </>
      ) : (
        <>
          <Text style={styles.text}>Check Your Email</Text>
          <Text style={styles.text}>A verification link has been sent to your email.</Text>

          <Pressable style={styles.button} onPress={handleResendEmail}>
            <Text style={styles.buttonText}>Resend Email </Text> 
          </Pressable> 
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red', 
    fontWeight: 'bold',
    textAlign: 'center',
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
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
});

export default CheckEmailScreen;
