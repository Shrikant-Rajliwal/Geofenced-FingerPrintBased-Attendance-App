import React, { useState, useLayoutEffect } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function StudentLogin() {
    const [PRN, setPRN] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleLogin = async () => {
        if (!PRN || !password) {
            Alert.alert("Input Error", "Please enter both PRN and password.");
            return; // Exit if validation fails
        }
        
        setLoading(true); // Start loading state
        try {
            const response = await axios.post('http://192.168.43.25:5000/api/students/loginStudent', {
                prn: PRN,
                password: password,
            });
    
            console.log('Full response:', response.data); // Log the entire response
    
            if (response.data.message === "Login successful") {
                const studentId = response.data.studentId; // Extract studentId
                const year = response.data.year; // Assuming year is part of the response
                const division = response.data.division; // Assuming division is part of the response
                console.log(studentId, year, division);
                
                // Navigate to the notification page with studentId, year, and division
                router.push({
                    pathname: 'navigation/Notification', // Update this to your notification page path
                    params: { studentId: studentId, year: year, division: division }, // Pass the studentId, year, and division
                });
            } else {
                console.error('Login failed:', response.data.message);
                Alert.alert("Login Failed", response.data.message); // Show alert on login failure
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert("Error", "An error occurred during login.");
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    return (
        <ImageBackground
            // Temporarily replace with a remote URL to check for any local image issues
            source={require('../../assets/images/loginBackground.png')}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View className="flex-1 justify-center items-center">
                <View className="flex items-center w-full justify-center mt-36 text-center">
                    <Text className="text-2xl text-black font-semibold" style={{ color: '#1A8FE3' }}>
                        Student Login
                    </Text>
                </View>

                <View className="flex justify-center mt-28">
                    <View className="relative w-4/5 flex-row border-b-2" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            className="flex-1 h-10 p-2 ml-2"
                            placeholder="PRN"
                            placeholderTextColor="#888"
                            style={{ color: '#000000' }}
                            onChangeText={setPRN}
                            value={PRN}
                            maxLength={12}
                            keyboardType='numeric'
                        />
                    </View>
                    <View className="relative w-4/5 flex-row border-b-2 mt-8" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            className="flex-1 h-10 p-2 ml-2"
                            placeholder="Password"
                            placeholderTextColor="#888"
                            secureTextEntry={true}
                            style={{ color: '#000000' }}
                            onChangeText={setPassword}
                            value={password}
                        />
                    </View>
                    <TouchableOpacity onPress={() => router.push('/ForgotPassword')}>
                        <Text className="ml-1 font-semibold text-blue-800">Forgot Password?</Text>
                    </TouchableOpacity>

                    <View className="flex justify-center items-center">
                        {loading ? (
                            <ActivityIndicator size="large" color="#1A8FE3" />
                        ) : (
                            <TouchableOpacity className="w-1/2 py-2 px-4 mt-10 rounded-xl" onPress={handleLogin} style={{ backgroundColor: '#1A8FE3', width: 270 }}>
                                <Text className="text-white text-lg font-bold text-center">Login</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity onPress={() => router.push('/StudentRegister')}>
                        <Text className="mt-5 text-gray-700 text-center">Don't have an account? <Text className="font-bold text-blue-800 underline">Signup</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}
