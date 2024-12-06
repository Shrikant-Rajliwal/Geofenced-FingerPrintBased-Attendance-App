import { View, Text, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function TeacherNotifications() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the header for this screen
    });
  }, [navigation]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [year, setYear] = useState('');
  const [division, setDivision] = useState('');
  const [subject, setSubject] = useState('');

  const handleSendNotification = async () => {
    if (!title || !message || !year || !division || !subject) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.43.25:5000/api/teachers/sendNotification', {
        title,
        message,
        year,
        division,
        subject,
      });
      Alert.alert('Success', response.data.message);
      setTitle('');
      setMessage('');
      setYear('');
      setDivision('');
      setSubject('');
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Send Notifications</Text>
      </View>

      {/* Centered Inputs and Button */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 400 }}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Year (e.g., BE,TE,SE)"
            value={year}
            onChangeText={setYear}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Division (e.g., A)"
            value={division}
            onChangeText={setDivision}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              marginBottom: 20,
            }}
          />
          <View style={{ marginTop: 20 }}>
            <Button title="Send Notification" onPress={handleSendNotification} />
          </View>
        </View>
      </View>
    </View>
  );
}
