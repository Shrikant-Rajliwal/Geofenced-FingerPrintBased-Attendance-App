// app/Navigation.jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Link } from 'expo-router';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="TeacherLogin" component={TeacherLogin} />
        <Stack.Screen name="StudentLogin" component={StudentLogin} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
