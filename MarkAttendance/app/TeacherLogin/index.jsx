import React, { useState ,useLayoutEffect } from 'react';
import { Link } from "expo-router";
import { Image, View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router'; 
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


export default function TeacherLogin() {
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileVerify, setMobileVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the header for this screen
    });
  }, [navigation]);

  function handleMobile(text) {
    setMobile(text);

    // Verify if the mobile number is valid (10 digits)
    if (/^[1-9]\d{9}$/.test(text)) {
      setMobileVerify(true);
    } else {
      setMobileVerify(false);
    }
  }

  function handleSubmit() {
    const loginData = {
      mobile,
      password,
    };

    axios.post("http://192.168.43.25:5000/api/teachers/loginTeacher", loginData)
      .then(res => {
        console.log(res.data);
        if (res.data.status === 'OK') {
          Alert.alert("Login Successful!!");
          router.push('Teacher/TeacherDashboard');
        } else {
          Alert.alert(res.data.message || "Login Failed");
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Error during login");
      });
  }

  return (
    <ImageBackground
    source={require('../../assets/images/loginBackground.png')}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View className="flex-1 justify-center items-center">

        {/* Logo at the Top */}
        {/* <View>
          <Text className="text-3xl">LOGIN</Text>
        </View> */}

        <View className=" flex items-center w-full justify-center mt-36 text-center">
          {/* <View className="flex-1 h-px bg-gray-600 mx-1"></View> */}
          <Text className="text-2xl text-black font-semibold" style={{ color: '#1A8FE3'  }}>
            Professor Login
          </Text>
          {/* <View className="flex-1 h-px bg-gray-600 mx-1"></View> */}
        </View>


        <View className="flex justify-center mt-28">

        <View className="relative w-4/5 flex-row border-b-2" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                  className="flex-1 h-10 p-2 ml-2"
                  placeholder="Mob No"
                  placeholderTextColor="#888"
                  style={{ color: '#000000' }}
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={handleMobile}
                  value={mobile}
                />
                {mobile.length < 1 ? null : mobileVerify ? (
                  <Text style={{ color: 'green', marginRight: 8 }}>✔️</Text>
                ) : (
                  <Text style={{ color: 'red', marginRight: 8 }}>❌</Text>
                )}
        </View>



        <View className="relative w-4/5 flex-row border-b-2 mt-8" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            className="flex-1 h-10 p-2 ml-2"
            placeholder="Password"
            placeholderTextColor="#888"
            style={{ color: '#000000' }}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            className="absolute right-2"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ color: '#888' }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/ForgotPassword')}>
          <Text className=" ml-1 font-semibold text-blue-800">Forgot Password?</Text>
        </TouchableOpacity>

        </View>


        {/* Password Input */}
        

        {/* Login Button */}
        <TouchableOpacity
          className=" w-1/2 py-2 px-4 mt-10 rounded-xl"
          onPress={handleSubmit}
          disabled={!mobileVerify || !password}
          style={{ backgroundColor: '#1A8FE3' , width: 270}} // Disable if mobile or password is invalid
        >
          <Text className="text-white text-lg font-bold text-center">Login</Text>
        </TouchableOpacity>

        {/* Signup Navigation */}
        <TouchableOpacity onPress={() => router.push('/TeacherRegister')}>
          <Text className="mt-5">Don't have an account? <Text className="text-blue-700 underline">Signup</Text></Text>
        </TouchableOpacity>

        {/* Forgot Password Navigation */}
       

      </View>
    </ImageBackground>
  );
}
