import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const SettingsStack = createStackNavigator();



const Settings = () => {


  const navigation = useNavigation();

  return (

   

      <ScrollView style={styles.container}> 


            {/* App Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Preferences</Text>
                <TouchableOpacity style={styles.settingItem}>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingDescription}>Light / Dark</Text>
                </TouchableOpacity> 
                {/* Add more settings items here */}
            </View>

            {/* Support Section */}
            {/* ... Similar structure as above */}

            {/* About Section */}
            {/* ... Similar structure as above */} 
      </ScrollView>

   
    
  );
};

const SettingsScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={Settings} options={{
                    headerShown: false
                  }}/>

    </SettingsStack.Navigator>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Main background color 
    padding: 20,
  },
  section: {
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    marginBottom: 20, 
    paddingBottom: 15, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',  
    marginBottom: 5,
  },
  sectionDescription: {
    color: '#777', 
  },
  settingItem: {
    // Add flexDirection: 'row', alignItems: 'center', if needed 
    paddingVertical: 10,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingDescription: {
    color: '#999', 
  },
});

export default SettingsScreen;
