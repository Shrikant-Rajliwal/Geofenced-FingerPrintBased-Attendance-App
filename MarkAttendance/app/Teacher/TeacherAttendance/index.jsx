// Example for TeacherNotification.js
import React ,{useLayoutEffect} from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function TeacherAttendance() {


  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the header for this screen
    });
  }, [navigation]);






  return (
    <View>
      <Text>Teacher TeacherAttendance Screen</Text>
    </View>
  );
}
