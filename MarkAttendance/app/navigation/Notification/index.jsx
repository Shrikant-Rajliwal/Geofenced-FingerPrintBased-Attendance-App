import { View, Text, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client'; // Import Socket.IO client
import * as Device from 'expo-device'; // Import Device from expo-device
import { LogBox } from 'react-native'; // For suppressing warnings

// Suppress all logs (YellowBox)
LogBox.ignoreAllLogs();

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
                const response = await axios.get(
                    `http://192.168.43.25:5000/api/students/getNotification/${year}/${division}`
                );
                const notificationsWithTimestamp = response.data.map(notification => ({
                    ...notification,
                    timestamp: Date.now(), // Add current timestamp
                    attendanceMarked: false, // Add a flag to track attendance marking
                }));
                setNotifications(notificationsWithTimestamp);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                Alert.alert('Error', 'Failed to fetch notifications. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();

        const socket = io('http://192.168.43.25:5000');
        socket.on('notification', (data) => {
            const notificationWithTimestamp = {
                ...data,
                timestamp: Date.now(),
                attendanceMarked: false,
            };
            setNotifications(prevNotifications => [notificationWithTimestamp, ...prevNotifications]);
            Alert.alert('New Notification', `${data.title}: ${data.message}`);

            setTimeout(() => {
                setNotifications(prev => prev.filter(notification => notification._id !== notificationWithTimestamp._id));
            }, 5 * 60 * 1000); // 5 minutes
        });

        return () => {
            socket.disconnect();
        };
    }, [year, division]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => {
                    const timeElapsed = (Date.now() - notification.timestamp) / 1000; // Time in seconds
                    const timeRemaining = 300 - timeElapsed; // Countdown from 5 minutes
                    return { ...notification, timeRemaining: timeRemaining > 0 ? timeRemaining : 0 };
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleNotificationPress = (notification) => {
        if (notification.attendanceMarked) {
            Alert.alert('Attendance Already Marked', 'You have already marked attendance for this notification.');
        } else {
            setSelectedNotification(notification);
            setModalVisible(true);
        }
    };

    const handleAttendanceMarking = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Mark Attendance with Fingerprint',
                fallbackLabel: 'Use Passcode',
            });

            if (result.success) {
                Alert.alert('Success', 'Fingerprint Authentication Successful!');
                handleFingerprintSubmit();
            } else {
                Alert.alert('Authentication Failed', 'Fingerprint not recognized. Please try again.');
            }
        } else {
            Alert.alert(
                'Biometric Unavailable',
                'Biometric authentication is not available. You can proceed without biometrics.',
                [
                    {
                        text: 'Mark Attendance Without Biometrics',
                        onPress: handleFingerprintSubmit,
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        }
    };

    const handleFingerprintSubmit = async () => {
        if (!selectedNotification) return;
    
        const { subject, division, _id: notificationId } = selectedNotification;
        const modelName = Device.modelName;
    
        try {
            const response = await axios.post('http://192.168.43.25:5000/api/students/attendance/mark', {
                studentId,
                subject,
                division,
                notificationId,
                deviceId: modelName,
            });
    
            const { showPopup, message } = response.data;
    
            if (!showPopup) {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification._id === selectedNotification._id
                            ? { ...notification, attendanceMarked: true }
                            : notification
                    )
                );
                Alert.alert('Success', message);
            } else {
                // Updated error message for device ID mismatch or any other failure
                Alert.alert('Error', 'Device ID mismatch. Please ensure you are using the correct device for marking attendance.');
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            // Updated error message for general failure to mark attendance
            Alert.alert('Error', 'Device ID mismatch. Please ensure you are using the correct device for marking attendance');
        } finally {
            setModalVisible(false);
            setSelectedNotification(null);
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
                {item.timeRemaining > 0 ? (
                    <Text className="text-sm text-red-500">
                        Time remaining: {formatTime(item.timeRemaining)}
                    </Text>
                ) : (
                    <Text className="text-sm text-gray-500">Expired</Text>
                )}
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
                            Please mark your attendance for {selectedNotification?.subject}.
                        </Text>
                        <Button title="Submit Fingerprint or Proceed" onPress={handleAttendanceMarking} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
