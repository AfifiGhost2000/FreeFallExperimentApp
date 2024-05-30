import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Alert, Modal, TouchableWithoutFeedback  } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import {BlurView } from 'expo-blur';



import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser } from '../redux/actions/index'
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

const EditProfileScreen = ({currentUser, fetchUser, navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);



  useEffect(() => {
    // Simulate fetching user data (replace with your actual logic)

    fetchUser();
    setUsername(currentUser.username);
    setEmail(currentUser.email);
    setFullname(currentUser?.fullname ?? '');
    setAge(currentUser?.age ?? '');
    setPhoneNumber(currentUser?.phoneNumber ?? '');
    setGender(currentUser?.gender ?? '');
    setBio(currentUser?.bio ?? '');
    setProfilePicture(currentUser?.profilePicture ?? '');
      
  }, [fetchUser]);

  const BlurOverlay = ({ isModalVisible }) => {
    return isModalVisible ? (
        <BlurView 
            style={styles.blurOverlay} 
            blurType="light" // Adjust the type of blur as needed
            intensity={10}   // Adjust the intensity of the blur
        /> 
    ) : null;
};

  const handleCameraPress = async () => {

    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();

    if (cameraStatus !== 'granted') {
      alert('Sorry, we need camera permissions to use this feature.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // You can also allow videos
        allowsEditing: true,
        aspect: [1, 1], // Enforce square aspect ratio (for profile photo)
        quality: 0.8,  // Adjust quality if needed
    });
  
    if (!result.cancelled) {
      setProfilePicture(result.assets[0].uri);
    }

    setShowPopup(false);

  }

  const handleLibraryPress = async () => {
    // Ask the user for permission to access the media library 
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to choose an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.assets[0].uri);
 
    }
    setShowPopup(false);
  };



  const handleSave = async () => {
    setIsSaving(true);

    let currentUserId = firebase.auth().currentUser.uid;

    try {
      // 1. Upload Image (if changed)
      let profilePictureUrl = profilePicture;
      if (profilePicture && !profilePicture.startsWith('http')) { // Check if the image was updated
        const response = await fetch(profilePicture); 
        const blob = await response.blob();          
        const uploadTask = firebase.storage().ref().child(`profilePictures/${currentUserId}/${Math.random().toString(36)}`).put(blob);

        await uploadTask; // Wait for the upload to complete  
        // profilePictureUrl = await uploadTask.ref.getDownloadURL()

        const taskProgress = snapshot => {
          console.log(`transferred: ${snapshot.bytesTransferred}`);
        }

        const taskError = snapshot => {
          console.log(snapshot)
        }

        const taskCompleted = () => {
          uploadTask.snapshot.ref.getDownloadURL().then((snapshot) => {
            profilePictureUrl = snapshot;
            // 2. Save user details into Firestore users document
          firebase.firestore().collection('users').doc(currentUserId).update({
            username,
            email, 
            fullname,
            age,
            gender,
            phoneNumber,
            bio,
            profilePicture: profilePictureUrl,
            creation: firebase.firestore().FieldValue.serverTimestamp()
          }).then((function () {
              navigation.popToTop();
          }));
            console.log(snapshot)
          });
        }

        uploadTask.on("state_changed", taskProgress, taskError, taskCompleted);
      }

      

      Alert.alert('Success', 'Your profile has been updated!');
    } catch (error) {
      Alert.alert('Error', 'There was an error saving your profile. Please try again.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <ScrollView style={styles.container}> 

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <Image source={require('.././assets/profile-icon.jpeg')} style={styles.profilePicture} />
          )}

          <TouchableOpacity onPress={()=>setShowPopup(true)} style={styles.uploadIconContainer}>
            <AntDesign name="upload" size={24} color="black" /> 
          </TouchableOpacity>
        </View>

        <BlurOverlay isModalVisible={showPopup} /> 
          {showPopup && (

              <Modal visible={showPopup} transparent={true} onRequestClose={() => setShowPopup(false)}>

                <TouchableWithoutFeedback onPress={() => setShowPopup(false)}>
                
                  <View style={styles.popupContent}>
                    <TouchableOpacity onPress={handleLibraryPress} mode="outlined" style={styles.popupButton}>
                      <MaterialIcons name="photo-library" size={24} color="black" />  
                      <Text>Choose from Library</Text>
                      
                    </TouchableOpacity>
                
                    <TouchableOpacity onPress={handleCameraPress} mode="outlined" style={styles.popupButton}>
                      <AntDesign name="camera" size={24} color="black" />
                      <Text>Use Camera</Text>
                    </TouchableOpacity>
                  </View>

                  </TouchableWithoutFeedback>

                </Modal>
              

            
          )}

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.textInput}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.textInput} editable={false} />

        {/* Full name */}
        <Text style={styles.label}>Full name</Text>
        <TextInput value={fullname} onChangeText={setFullname} style={styles.textInput} />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.textInput}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.textInput}
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[styles.radio, gender === 'male' && styles.selectedRadio]}
            onPress={() => setGender('male')}
          >
            <Text>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radio, gender === 'female' && styles.selectedRadio]}
            onPress={() => setGender('female')}
          >
            <Text>Female</Text>
          </TouchableOpacity>

          </View>

        {/* Bio */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          style={styles.bioInput}
          multiline={true}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  uploadIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
    padding: 5,
    borderRadius: 5,
  },
  
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
  profilePicturePlaceholderText: {
    color: '#aaa',
  },
  label: {
    color: '#555', // Slightly dark gray
    fontWeight: '600',
    marginBottom: 5, 
  },

  textInput: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5,
    padding: 10, 
    marginBottom: 10,
  },

  bioInput: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5,
    padding: 10, 
    marginBottom: 10,
    height: 100,
  },  

  saveButton: {
    backgroundColor: '#007AFF', // Sample primary color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 40
  },

  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radio: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: 'blue', // Example color for selected radio
  },
  popupContent: {
    padding: 20,
    backgroundColor: 'white',
    position: 'absolute', 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 10, // Adjust for desired curvature
    borderWidth: 1, 
    borderColor: 'lightgray', // Subtle border
    // ... add box shadow for visual depth ...
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', // Example shadow
  },
  popupButton: {
    marginVertical: 5,
    backgroundColor: 'white', // Match the card background
    padding: 15,
    borderRadius: 8,  
  },
  blurOverlay: {
    position: 'absolute', 
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden'
},
  

});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser
});
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
