import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TeacherDashboard() {
  const navigation = useNavigation();
  const [currentDateTime, setCurrentDateTime] = useState('');

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the header for this screen
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Set the StatusBar to be translucent and visible */}
      <StatusBar translucent={true} barStyle="light-content" backgroundColor="#33B7FF" />

      <View className="flex-1 bg-white">
        {/* Header Section */}
        <View style={{ backgroundColor: "#33B7FF" }} className="bg-blue-400 h-48 rounded-b-2xl justify-start pt-5 px-6">
          <Text className="text-white text-xl font-bold">Teacher Dashboard</Text>
          <Text className="text-white mt-5 text-4xl font-semibold">Welcome...!</Text>

          {/* Current Date and Time Display */}
          <View className="absolute top-40 right-3 mt-2">
            <Text className="text-white text-sm">{currentDateTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
