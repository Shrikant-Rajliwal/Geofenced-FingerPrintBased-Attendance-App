import { View, Text, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const route = useRoute();
    const { studentId, year, division } = route.params; // Destructure year, division from route params
    console.log(studentId, year, division);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Fetch notifications based on year and division
                const response = await axios.get(`http://192.168.43.25:5000/api/students/getNotification/${year}/${division}`);
                setNotifications(response.data); // Set fetched notifications
                setLoading(false); // Stop loading
            } catch (error) {
                console.error('Error fetching notifications:', error);
                Alert.alert('Error', 'Failed to fetch notifications. Please try again later.');
                setLoading(false);
            }
        };

        // Fetch notifications initially
        fetchNotifications();

        // Set up polling to fetch notifications every 10 seconds
        const intervalId = setInterval(fetchNotifications, 10000); // Fetch every 10 seconds

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [year, division]); // Fetch notifications whenever year or division changes

    const handleNotificationPress = (notification) => {
        setSelectedNotification(notification);
        setModalVisible(true);
    };

    const handleFingerprintAuthentication = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert('Device Error', 'Biometric authentication is not available on this device.');
            return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert('No Biometrics', 'No biometrics are enrolled on this device.');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Mark Attendance with Fingerprint',
            fallbackLabel: 'Use Passcode',
        });

        if (result.success) {
            Alert.alert('Fingerprint Authentication Successful', 'You have been counted!');
            handleFingerprintSubmit(); // Call attendance marking function
        } else {
            Alert.alert('Authentication Failed', 'Fingerprint not recognized. Please try again.');
        }
    };

    const handleFingerprintSubmit = async () => {
        if (!selectedNotification) return;

        const { subject, division } = selectedNotification;

        try {
            const response = await axios.post('http://192.168.43.25:5000/api/students/attendance/mark', {
                studentId, // Use the correct studentId here
                subject,
                division,
            });

            Alert.alert('Attendance Marked Successfully', response.data.message);
        } catch (error) {
            console.error('Error marking attendance:', error);
            Alert.alert('Error', 'Failed to mark attendance. Please try again.');
        } finally {
            setModalVisible(false);
            setSelectedNotification(null); // Clear selected notification
        }
    };

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            className="flex flex-row justify-between items-center p-4 border-b border-gray-200"
        >
            <View className="flex-1">
                <Text className="text-lg">{item.message}</Text>
                <Text className="text-sm text-gray-500">{item.date}</Text>
                <Text className="text-sm text-gray-700">Subject: {item.subject}</Text>
                <Text className="text-sm text-gray-700">Teacher: {item.teacher}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-4">Notifications</Text>

            {/* Display loading spinner or message */}
            {loading ? (
                <Text className="text-center text-gray-500">Loading notifications...</Text>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            {/* Modal for Fingerprint Submission */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white rounded-lg p-4 w-80">
                        <Text className="text-lg mb-4">
                            Please scan your fingerprint to mark attendance for {selectedNotification?.subject}.
                        </Text>
                        <Button title="Submit Fingerprint" onPress={handleFingerprintAuthentication} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
