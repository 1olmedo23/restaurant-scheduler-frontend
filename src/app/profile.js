import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>You are logged in as: {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}