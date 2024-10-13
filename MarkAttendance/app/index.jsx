import { Link } from "expo-router";
import { View, Text, Image } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-gray-200 justify-between px-4 py-4">
      {/* Logo at the Top */}
      <View className="flex justify-center items-center mt-10">
        <Image
          source={require('../assets/images/logo.png')} // Make sure the path to your logo file is correct
          style={{ width: 150, height: 150 }} // Adjust width and height as per your logo size
          resizeMode="contain"
        />
      </View>

      <View className="mt-32 ml-6">
        {/* Title */}
        <Text className="text-2xl font-bold mb-2" style={{ color: '#1A8FE3', letterSpacing: 1  }}>Mark Attendance</Text>

        {/* Description */}
        <Text className="text-lg" style={{ color: '#1A8FE3' ,letterSpacing: 0.5 ,lineHeight:25 }}>
          You can't learn if you don't{"\n"}show up. Attendance is the{"\n"}first step to success.
        </Text>
      </View>

      <View className='flex justify-center items-center gap-6 mb-14'>
        {/* Teacher Login Link */}
        <Link href="/TeacherLogin">
          <View className="w-72 h-12 justify-center items-center rounded-xl mb-4" style={{ backgroundColor: '#1A8FE3' }}>
            <Text className="text-white text-xl text-center">Professor</Text>
          </View>
        </Link>

        {/* Student Login Link */}
        <Link href="/StudentLogin">
          <View className="bg-white border-2 w-72 h-12 justify-center items-center rounded-xl" style={{ borderColor: '#1A8FE3' }}>
            <Text className="text-xl text-center" style={{ color: '#1A8FE3' }}>Student</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}
