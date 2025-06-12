import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMySchedule } from '../services/api';

export default function Schedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const data = await getMySchedule(user?.token);
      setSchedule(data);
    };
    fetchSchedule();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>My Upcoming Shifts:</Text>
      <FlatList
        data={schedule}
        keyExtractor={(item) => item.schedule_id.toString()}
        renderItem={({ item }) => (
          <Text>{item.shift_date} - {item.start_time} to {item.end_time}</Text>
        )}
      />
    </View>
  );
}