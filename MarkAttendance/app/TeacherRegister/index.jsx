import { Image, View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import React, { useState ,useLayoutEffect} from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


export default function TeacherRegister() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");

    // const router = useRouter();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the header for this screen
    });
  }, [navigation]);

    const handleSubmit = async () => {
        const teacherData = {
            username,
            mobile,
            email,
            password
        };
    
        try {
            const response = await axios.post("http://192.168.43.25:5000/api/teachers/createTeacher", teacherData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 'OK') {
                Alert.alert("Registration Successful!");
                router.push('/TeacherLogin');
            } else {
                Alert.alert("Registration Failed", response.data.message || "Unknown error");
            }
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            Alert.alert("Error", "An error occurred while registering. Please try again.");
        }
    };

    return (
        <ImageBackground
        source={require('../../assets/images/loginBackground.png')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View className="flex-1 justify-center items-center p-4 mt-10">

                

                <View className="flex-row items-center w-full justify-centere mt-28 ">
                    {/* <View className="flex-1 h-px bg-gray-600 mx-1"></View> */}
                    <Text className="text-2xl text-black font-semibold text-center" style={{ color: '#1A8FE3'  }}>
                       Professor Register 
                    </Text>
                    {/* <View className="flex-1 h-px bg-gray-600 mx-1"></View> */}
                </View>

                <View className="w-full items-center mt-16">

                    {/* Username Input */}
                    <View className="relative w-11/12 flex-row border-b-2" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            className="flex-1 h-10 p-2 ml-2"
                            placeholder="Username"
                            placeholderTextColor="#888"
                            style={{ color: '#000000' }}
                            onChangeText={setUsername}
                            value={username}
                        />
                    </View>

                    {/* Mobile Input */}
                    <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            className="flex-1 h-10 p-2 ml-2"
                            placeholder="Mobile Number"
                            placeholderTextColor="#888"
                            style={{ color: '#000000' }}
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={setMobile}
                            value={mobile}
                        />
                    </View>

                    {/* Email Input */}
                    <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            className="flex-1 h-10 p-2 ml-2"
                            placeholder="Email"
                            placeholderTextColor="#888"
                            style={{ color: '#000000' }}
                            keyboardType="email-address"
                            onChangeText={setEmail}
                            value={email}
                        />
                    </View>

                    {/* Password Input */}
                    <View className="relative w-11/12 flex-row border-b-2 mt-3" style={{ borderBottomColor: '#1A8FE3', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
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

                    {/* Signup Button */}
                    <TouchableOpacity className=" w-1/2 py-2 px-4 rounded-md mt-8" onPress={handleSubmit} style={{ backgroundColor: '#1A8FE3' , width: 270}}>
                        <Text className="text-white text-lg font-bold text-center">Signup</Text>
                    </TouchableOpacity>

                    {/* Navigate to Login */}
                    <TouchableOpacity onPress={() => router.push('/TeacherLogin')}>
                        <Text className="mt-5 text-gray-700">
                            Already have an account? <Text className="text-blue-800 underline">Login</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ImageBackground>
    );
}
