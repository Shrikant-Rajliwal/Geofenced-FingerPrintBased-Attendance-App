import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 54,
          elevation: 0,
          backgroundColor: 'white',
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="StudentDashboard/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', paddingTop: 10 }}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={focused ? '#1A8FE3' : 'gray'}
                size={24}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: focused ? 'bold' : 'normal',
                  color: focused ? '#1A8FE3' : 'gray',
                  marginTop: 1,
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      {/* <Tabs.Screen
        name="TeacherDashboard/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', paddingTop: 10 }}>
              <Ionicons
                name={focused ? 'school' : 'school-outline'}
                color={focused ? '#1A8FE3' : 'gray'}
                size={24}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: focused ? 'bold' : 'normal',
                  color: focused ? '#1A8FE3' : 'gray',
                  marginTop: 1,
                }}
              >
                Teacher
              </Text>
            </View>
          ),
        }}
      /> */}
      <Tabs.Screen
        name="Notification/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', paddingTop: 10 }}>
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                color={focused ? '#1A8FE3' : 'gray'}
                size={24}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: focused ? 'bold' : 'normal',
                  color: focused ? '#1A8FE3' : 'gray',
                  marginTop: 1,
                }}
              >
                Notifications
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="StudentProfile/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', paddingTop: 10 }}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                color={focused ? '#1A8FE3' : 'gray'}
                size={24}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: focused ? 'bold' : 'normal',
                  color: focused ? '#1A8FE3' : 'gray',
                  marginTop: 1,
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
