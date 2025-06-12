import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function EmployeeHome() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Welcome, {user?.email || 'Employee'}!
      </Text>
      <Button title="View My Schedule" onPress={() => router.push('/schedule')} />
    </View>
  );
}
