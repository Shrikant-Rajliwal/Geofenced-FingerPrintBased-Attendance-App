import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import axios from 'axios'; // Import axios for handling API calls
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function StudentSignup() {
  const router = useRouter(); // For navigation
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [PRN, setPRN] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [year, setYear] = useState(""); // New state for year input
  const [yearValid, setYearValid] = useState(false); // State for year validation
  
  const [usernameValid, setUsernameValid] = useState(false);
  const [mobileValid, setMobileValid] = useState(false);
  const [PRNValid, setPRNValid] = useState(false);

  const [division, setDivision] = useState(''); // State for division
  const [divisionVerify, setDivisionVerify] = useState(false); // State for division verification

  // Handle division input and validation
  function handleDivision(text) {
    setDivision(text.toUpperCase()); // Convert input to uppercase
    if (["A", "B", "C"].includes(text.toUpperCase())) {
      setDivisionVerify(true); // Set division verification state to true
    } else {
      setDivisionVerify(false); // Set division verification state to false
    }
  }

  // Handle year input and validation
  function handleYearChange(text) {
    setYear(text.toUpperCase());
    if (["FE", "SE", "TE", "BE"].includes(text.toUpperCase())) {
      setYearValid(true); // Year is valid if it matches one of these values
    } else {
      setYearValid(false);
    }
  }

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the header for this screen
    });
  }, [navigation]);

  // Input validation handlers
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

  const handleSubmit = () => {
    if (usernameValid && mobileValid && PRNValid && yearValid && divisionVerify) {
      const studentData = {
        username,
        mobile,
        prn: PRN,
        year,
        division,
        password,
      };

      axios
        .post('http://192.168.43.25:5000/api/students/createStudent', studentData)
        .then((res) => {
          if (res.data.status === 'OK') {
            Alert.alert('Registration Successful!');
            router.push('/StudentLogin'); // Navigate to student login page
          } else {
            Alert.alert(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      Alert.alert('Please fill in all the required fields correctly.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/loginBackground.png')} // Background image
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
          <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8 }}>
            <TextInput
              className="flex-1 h-10 p-2 ml-2"
              placeholder="Username"
              placeholderTextColor="#888"
              style={{ color: '#000000' }}
              onChangeText={handleUsernameChange}
              value={username}
            />
          </View>

          {/* Mobile Input */}
          <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8 }}>
            <TextInput
              className="flex-1 h-10 p-2 ml-2"
              placeholder="Mobile Number"
              placeholderTextColor="#888"
              style={{ color: '#000000' }}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={handleMobileChange}
              value={mobile}
            />
          </View>

          {/* PRN Input */}
          <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8 }}>
            <TextInput
              className="flex-1 h-10 p-2 ml-2"
              placeholder="PRN"
              placeholderTextColor="#888"
              style={{ color: '#000000' }}
              maxLength={12}
              keyboardType="numeric"
              onChangeText={handlePRNChange}
              value={PRN}
            />
          </View>

          {/* Year Input */}
          <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8 }}>
            <TextInput
              className="flex-1 h-10 p-2 ml-2"
              placeholder="Year (FE, SE, TE, BE)"
              placeholderTextColor="#888"
              style={{ color: '#000000' }}
              value={year}
              onChangeText={handleYearChange}
            />
            {year.length > 0 && (
              <Text
                className={`absolute right-0 p-2 ${yearValid ? 'text-green-500' : 'text-red-500'}`}
              >
                {yearValid ? '✔' : '✘'}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8 }}>
            <TextInput
              className="flex-1 h-10 p-2 ml-2"
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              style={{ color: '#000000' }}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              className="absolute right-2"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text className="text-gray-600">{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          {/* Division Input */}
          <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8 }}>
            <TextInput
              className="flex-1 h-10 p-2 ml-2"
              placeholder="Division (A, B, C)"
              placeholderTextColor="#888"
              style={{ color: '#000000' }}
              value={division}
              onChangeText={handleDivision}
            />
            {division.length > 0 && (
              <Text
                className={`absolute right-0 p-2 ${divisionVerify ? 'text-green-500' : 'text-red-500'}`}
              >
                {divisionVerify ? '✔' : '✘'}
              </Text>
            )}
          </View>

          {/* Signup Button */}
          <TouchableOpacity className="w-1/2 py-2 px-4 rounded-md mt-8" onPress={handleSubmit} style={{ backgroundColor: '#1A8FE3', width: 270 }}>
            <Text className="text-white text-lg font-bold text-center">Signup</Text>
          </TouchableOpacity>

          {/* Navigate to Login */}
          <TouchableOpacity onPress={() => router.push('/StudentLogin')}>
            <Text className="mt-5 text-gray-700">
              Already have an account? <Text className="text-blue-800 underline">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
