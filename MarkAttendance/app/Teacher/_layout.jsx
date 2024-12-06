// Teacher/TeacherNavigator.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeacherDashboard from './TeacherDashboard';
import TeacherAttendance from './TeacherAttendance';
import TeacherNotifications from './TeacherNotifications';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TeacherNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 54,
          backgroundColor: 'white',
          borderRadius: 5,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="TeacherDashboard"
        component={TeacherDashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={focused ? '#1A8FE3' : 'gray'}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherAttendance"
        component={TeacherAttendance}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'school' : 'school-outline'}
              color={focused ? '#1A8FE3' : 'gray'}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherNotifications"
        component={TeacherNotifications}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              color={focused ? '#1A8FE3' : 'gray'}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
