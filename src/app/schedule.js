import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMySchedule } from '../services/api';

export default function Schedule() {
  const { user, setUser } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user?.token) return;

      const res = await getMySchedule(user.token);
      setSchedule(res.schedule || []);
    };

    fetchSchedule();
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    router.replace('/');
  };

  const renderShift = ({ item }) => {
    const shiftDate = new Date(item.shift_date).toLocaleDateString();
    const start = item.start_time?.slice(0, 5);
    const end = item.end_time?.slice(0, 5);
    const position = item.position || 'N/A';
    const status = item.status || '—';

    return (
      <Text style={{ marginBottom: 10 }}>
        {shiftDate} | {start} - {end} | {position} | {status}
      </Text>
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>My Schedule</Text>

      {schedule.length === 0 ? (
        <Text>No shifts scheduled</Text>
      ) : (
        <FlatList
          data={schedule}
          keyExtractor={(item) => item.schedule_id?.toString() ?? Math.random().toString()}
          renderItem={renderShift}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}