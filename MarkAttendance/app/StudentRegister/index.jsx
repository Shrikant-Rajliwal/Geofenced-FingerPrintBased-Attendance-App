import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import axios from 'axios'; // Import axios for handling API calls
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device'; // Import Device from expo-device

export default function StudentSignup() {
  const router = useRouter(); // For navigation
  const navigation = useNavigation();

  // State variables
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [PRN, setPRN] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [year, setYear] = useState(""); 
  const [division, setDivision] = useState(''); 

  // Validation states
  const [usernameValid, setUsernameValid] = useState(false);
  const [mobileValid, setMobileValid] = useState(false);
  const [PRNValid, setPRNValid] = useState(false);
  const [yearValid, setYearValid] = useState(false);
  const [divisionVerify, setDivisionVerify] = useState(false); 

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Handle input changes and validations
  const handleUsernameChange = (text) => {
    setUsername(text);
    setUsernameValid(text.length > 1);
  };

  const handleMobileChange = (text) => {
    setMobile(text);
    setMobileValid(/^[1-9]\d{9}$/.test(text)); // Validate mobile number
  };

  const handlePRNChange = (text) => {
    setPRN(text);
    setPRNValid(/^\d{12}$/.test(text)); // Validate PRN (12 digits)
  };

  const handleYearChange = (text) => {
    setYear(text.toUpperCase());
    setYearValid(["FE", "SE", "TE", "BE"].includes(text.toUpperCase()));
  };

  const handleDivisionChange = (text) => {
    setDivision(text.toUpperCase());
    setDivisionVerify(["A", "B", "C"].includes(text.toUpperCase()));
  };

  const handleSubmit = async () => {
    if (usernameValid && mobileValid && PRNValid && yearValid && divisionVerify) {
      try {
        // Use modelName instead of deviceId
        const modelName = Device.modelName || 'Unknown Device';

        const studentData = {
          username,
          mobile,
          prn: PRN,
          year,
          division,
          password,
          deviceId: modelName, // Use modelName here
        };
  
        console.log('Sending registration data:', studentData);
  
        const response = await axios.post('http://192.168.43.25:5000/api/students/createStudent', studentData);
        console.log('API response:', response.data);
  
        if (response.data.status === 'OK') {
          Alert.alert('Registration Successful!', 'You can now log in.');
          router.push('/StudentLogin');
        } else {
          Alert.alert('Registration Failed', response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        Alert.alert('Registration Error', error.response?.data?.message || error.message || 'An unknown error occurred.');
      }
    } else {
      Alert.alert('Please fill in all the required fields correctly.');
    }
  };

  console.log('Available Device methods:', Object.keys(Device));
  

  return (
    <ImageBackground
    source={{ uri: 'https://via.placeholder.com/300' }}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View className="flex-1 justify-center items-center p-4">
        <View className="w-full items-center mt-36">
          <Text className="text-2xl text-black font-semibold" style={{ color: '#1A8FE3' }}>
            Student Signup
          </Text>
        </View>

        <View className="w-full items-center mt-2">
          {/* Username Input */}
          <InputField 
            placeholder="Username"
            value={username}
            onChangeText={handleUsernameChange}
            valid={usernameValid}
          />
          
          {/* Mobile Input */}
          <InputField 
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={handleMobileChange}
            keyboardType="numeric"
            maxLength={10}
            valid={mobileValid}
          />

          {/* PRN Input */}
          <InputField 
            placeholder="PRN"
            value={PRN}
            onChangeText={handlePRNChange}
            keyboardType="numeric"
            maxLength={12}
            valid={PRNValid}
          />

          {/* Year Input */}
          <InputField 
            placeholder="Year (FE, SE, TE, BE)"
            value={year}
            onChangeText={handleYearChange}
            valid={yearValid}
          />

          {/* Password Input */}
          <InputField 
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightButton={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text className="text-gray-600">{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            }
          />

          {/* Division Input */}
          <InputField 
            placeholder="Division (A, B, C)"
            value={division}
            onChangeText={handleDivisionChange}
            valid={divisionVerify}
          />

          {/* Signup Button */}
          <TouchableOpacity className="w-1/2 py-2 px-4 rounded-md mt-8" onPress={handleSubmit} style={{ backgroundColor: '#1A8FE3', width: 270 }}>
            <Text className="text-white text-lg font-bold text-center">Signup</Text>
          </TouchableOpacity>

          {/* Navigate to Login */}
          <TouchableOpacity onPress={() => router.push('/StudentLogin')} className="mt-4">
            <Text style={{ color: '#1A8FE3' }}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// Reusable InputField Component
const InputField = ({ placeholder, value, onChangeText, valid, keyboardType, maxLength, secureTextEntry, rightButton }) => (
  <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8 }}>
    <TextInput
      className="flex-1 h-10 p-2 ml-2"
      placeholder={placeholder}
      placeholderTextColor="#888"
      style={{ color: '#000000' }}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      secureTextEntry={secureTextEntry}
    />
    {valid !== undefined && (
      <Text className={`absolute right-0 p-2 ${valid ? 'text-green-500' : 'text-red-500'}`}>
        {valid ? '✔' : '✘'}
      </Text>
    )}
    {rightButton}
  </View>
);
