import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, ScrollView, Switch, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getEmployeeAvailability, submitAvailability } from '../services/api';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = ['lunch', 'dinner'];

export default function AvailabilityPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user?.token) return;
      const data = await getEmployeeAvailability(user.token);
      const formatted = {};

      data.forEach(item => {
        if (!formatted[item.day_of_week]) {
          formatted[item.day_of_week] = {};
        }
        formatted[item.day_of_week][item.period] = item.available;
      });

      setAvailability(formatted);
    };

    fetchAvailability();
  }, [user]);

  const toggleSwitch = (day, period) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: !prev?.[day]?.[period]
      }
    }));
  };

  const handleSubmit = async () => {
    const payload = [];
    for (const day of days) {
      for (const period of periods) {
        payload.push({
          day_of_week: day,
          period,
          available: !!availability?.[day]?.[period]
        });
      }
    }

    for (const entry of payload) {
      try {
        await submitAvailability(user.token, entry);
      } catch (err) {
        console.error('Submit error:', err.message);
      }
    }

    alert('Availability updated!');
  };

  const handleLogout = () => {
    setUser(null);
    router.replace('/');
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Set Your Weekly Availability</Text>

      {days.map(day => (
        <View key={day} style={{ marginBottom: 15 }}>
          <Text style={{ fontWeight: 'bold' }}>{day}</Text>
          {periods.map(period => (
            <View key={period} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Text style={{ width: 80 }}>{period}</Text>
              <Switch
                value={!!availability?.[day]?.[period]}
                onValueChange={() => toggleSwitch(day, period)}
              />
            </View>
          ))}
        </View>
      ))}

      <Button title="Save Availability" onPress={handleSubmit} />
      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}