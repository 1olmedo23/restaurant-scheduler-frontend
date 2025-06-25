import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function EmployeeHome() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.replace('/');
  };

  console.log('👤 Current user object:', user);


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Welcome, {user?.email || 'Employee'}!
      </Text>
      <Button title="View My Schedule" onPress={() => router.push('/schedule')} />
      <Button title="Set My Availability" onPress={() => router.push('/availability')} />
        {user?.user?.role === 'manager' && (
          <View style={{ marginTop: 20 }}>
            <Button title="Create New Shift" onPress={() => router.push('/create-shift')} />
          </View>
        )}
      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
    
  );
}