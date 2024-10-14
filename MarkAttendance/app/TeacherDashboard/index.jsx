import { View, Text, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

export default function TeacherDashboard() {
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
      // Clear the input fields after sending the notification
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
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Teacher Dashboard</Text>

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
          marginBottom: 10,
        }}
      />

      <Button title="Send Notification" onPress={handleSendNotification} color="blue" />
    </View>
  );
}
