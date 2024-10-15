import { View, Text, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client'; // Import Socket.IO client

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    const route = useRoute();
    const { studentId, year, division } = route.params;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://192.168.43.25:5000/api/students/getNotification/${year}/${division}`);
                const notificationsWithTimestamp = response.data.map(notification => ({
                    ...notification,
                    timestamp: Date.now(), // Add current timestamp
                    attendanceMarked: false, // Add a flag to track attendance marking
                }));
                setNotifications(notificationsWithTimestamp); // Set fetched notifications
            } catch (error) {
                console.error('Error fetching notifications:', error);
                Alert.alert('Error', 'Failed to fetch notifications. Please try again later.');
            } finally {
                setLoading(false); // Ensure loading state is updated
            }
        };

        fetchNotifications();

        // Set up Socket.IO connection for real-time notifications
        const socket = io('http://192.168.43.25:5000');

        socket.on('notification', (data) => {
            console.log('Real-time notification received:', data);
            const notificationWithTimestamp = {
                ...data,
                timestamp: Date.now(), // Add current timestamp
                attendanceMarked: false, // Add attendanceMarked flag
            };
            setNotifications(prevNotifications => [notificationWithTimestamp, ...prevNotifications]);
            Alert.alert('New Notification', `${data.title}: ${data.message}`);

            // Remove notification after 5 minutes
            setTimeout(() => {
                setNotifications(prev => prev.filter(notification => notification._id !== notificationWithTimestamp._id));
            }, 5 * 60 * 1000); // 5 minutes (300 seconds)
        });

        return () => {
            socket.disconnect();
        };
    }, [year, division]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications(prevNotifications => prevNotifications.map(notification => {
                const timeElapsed = (Date.now() - notification.timestamp) / 1000; // Time elapsed in seconds
                const timeRemaining = 300 - timeElapsed; // Countdown from 5 minutes (300 seconds)
                return { ...notification, timeRemaining: timeRemaining > 0 ? timeRemaining : 0 }; // Ensure it doesn't go negative
            }));
        }, 1000); // Update every second

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    const handleNotificationPress = (notification) => {
        if (notification.attendanceMarked) {
            Alert.alert('Attendance Already Marked', 'You have already marked attendance for this notification.');
        } else {
            setSelectedNotification(notification);
            setModalVisible(true);
        }
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
    
        // Log the selected notification to ensure it contains the notificationId
        console.log('Selected Notification:', selectedNotification);
    
        const { subject, division, _id: notificationId } = selectedNotification;
    
        if (!notificationId) {
            Alert.alert('Error', 'Notification ID is missing. Cannot mark attendance.');
            return;
        }
    
        try {
            const response = await axios.post('http://192.168.43.25:5000/api/students/attendance/mark', {
                studentId,
                subject,
                division,
                notificationId, // Send the notification ID
            });
    
            // Check if the response indicates success
            if (response.status === 200) {
                // Update the notification to mark attendance as completed
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification._id === selectedNotification._id
                            ? { ...notification, attendanceMarked: true } // Update attendanceMarked status
                            : notification
                    )
                );
    
                Alert.alert('Attendance Marked Successfully', response.data.message);
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            Alert.alert('Error', 'Failed to mark attendance. Please try again.');
        } finally {
            setModalVisible(false);
            setSelectedNotification(null); // Clear selected notification
        }
    };
    

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
                {/* Display the countdown timer */}
                {item.timeRemaining > 0 ? (
                    <Text className="text-sm text-red-500">
                        Time remaining: {formatTime(item.timeRemaining)}
                    </Text>
                ) : (
                    <Text className="text-sm text-gray-500">Expired</Text>
                )}
                {/* Show "Attendance Marked" if already marked */}
                {item.attendanceMarked && (
                    <Text className="text-sm text-green-500">Attendance Marked</Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-4">Notifications</Text>

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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
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
