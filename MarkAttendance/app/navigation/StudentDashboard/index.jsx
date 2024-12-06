import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Import the icon set you want to use

export default function StudentDashboard() {

  const router = useRouter();
  const navigation = useNavigation();
  
  // State to hold the current date and time
  const [currentDateTime, setCurrentDateTime] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the header for this screen
    });
  }, [navigation]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      };
      setCurrentDateTime(now.toLocaleString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <ImageBackground
      source={require('../../../assets/images/studentDashboard.png')} // Adjust the path to your local image
      style={{ flex: 1 }}
    >
      {/* StatusBar with custom color */}
      <StatusBar 
        translucent={true} 
        barStyle="light-content" // Light text and icons for dark background
        backgroundColor="#33B7FF" // Making the status bar transparent
      />

      <View className="flex-1">
        <View className="absolute top-4 right-3">
          <TouchableOpacity onPress={() => { /* Handle notification icon press */ }}>
            <FontAwesome
              name="bell" // Use the name of the icon you want
              size={23} // Adjust size as needed
              style={{ color: '#1A8FE3', backgroundColor: "#ffffff", padding: 6, borderRadius: 20 }}
              className="rounded-md" // Adjust color as needed
            />
          </TouchableOpacity>
        </View>

        <View className="absolute top-14 left-7">
          <Text className="text-xl text-white">
            Welcome Back Aman
          </Text>

          <Text className="text-2xl text-white mt-3">
            Let's mark today's {"\n"}attendance!
          </Text>
        </View>

        <View className="absolute top-48 right-3 mt-3">
          {/* Current Date and Time Display */}
          <Text className="text-white">
            {currentDateTime}
          </Text>
        </View>

      </View>
    </ImageBackground>
  );
}
