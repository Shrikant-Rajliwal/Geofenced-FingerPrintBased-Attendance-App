import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';

const StudentProfile = () => {
  try {
    return (
      <ImageBackground
        // Replace with remote URL temporarily to test
        source={require('../../../assets/images/profileBackground.png')}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            // Replace with remote URL temporarily to test
            source={require('../../../assets/images/profile.jpg')}
            style={{
              height: 155,
              width: 155,
              borderRadius: 999,
              borderColor: 'white',
              borderWidth: 2,
              marginTop: 143,
            }}
          />
          <Text style={{ color: 'black', marginTop: 8, fontSize: 20, fontWeight: 'bold' }}>
            Jessica Johnson
          </Text>
          <Text style={{ color: 'black', marginVertical: 2, fontSize: 20, fontWeight: '600' }}>
            Roll No: 123456
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: '600', marginRight: 10 }}>
              Class: BE
            </Text>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: '600' }}>
              Section: C
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#33B7FF',
              borderRadius: 10,
              marginTop: 30,
            }}
          >
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '600' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  } catch (error) {
    console.error("Error rendering the component:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>Error loading the profile screen.</Text>
      </View>
    );
  }
};

export default StudentProfile;
