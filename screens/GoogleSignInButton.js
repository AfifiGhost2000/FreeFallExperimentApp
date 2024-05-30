import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { FontAwesome5 } from '@expo/vector-icons';

const GoogleSignInButton = ({navigation, customText}) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '971844536299-o8155mu6egcng0k3lhlcgseccnan88te.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      // Handle successful sign-in with Google, e.g., send token to your backend
      navigation.navigate('EmailVerification')
      console.log('Google Sign-In Successful');
    }
  }, [response]);

  return (
    
        <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()} // Replace with your actual sign-in logic
        >
            <FontAwesome5 name="google" size={20} color="white" />
            <Text style={styles.googleText}>{customText}</Text>
        </TouchableOpacity>

  );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DB4437', // Google red color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20, // Add spacing above the button
        marginBottom: 20, // Add spacing below the button
      },
      
      googleText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
   
});

export default GoogleSignInButton;
