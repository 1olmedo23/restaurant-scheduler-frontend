import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CreateShift() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [position, setPosition] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [shifts, setShifts] = useState([]);

  const positionOptions = [
    'Server', 'Assistant', 'Server 1', 'Server 2', 'Sushi',
    'Expo', 'Busser 1', 'Busser 2', 'Host 1', 'Host 2', 'FLOAT'
  ];

  const timeOptions = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
    '22:00', 'close'
  ];

  const lunchRoles = ['Server', 'Assistant'];
  const dinnerRoles = [
    'Server 1', 'Server 2', 'Sushi', 'Expo', 'Busser 1',
    'Busser 2', 'Host 1', 'Host 2', 'FLOAT'
  ];

  const today = new Date();
  const calendarDates = Array.from({ length: 28 }).map((_, index) => {
    const d = new Date();
    d.setDate(today.getDate() + index);
    return d;
  });

  const formatDate = (d) => d.toISOString().split('T')[0];
  const getMonthName = (d) => d.toLocaleString('default', { month: 'short' });

  const loadShifts = async () => {
    try {
      const res = await fetch('http://192.168.0.8:5000/api/shifts', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setShifts(data || []);
    } catch (err) {
      console.error('Failed to fetch shifts:', err);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await fetch('http://192.168.0.8:5000/api/employees', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    if (user?.user?.role === 'manager') {
      loadEmployees();
      loadShifts();
    }
  }, []);

  const handleCreateShift = async () => {
    if (!selectedDate || !startTime || !endTime || !position) {
      Alert.alert('Missing Fields', 'Please complete all required fields.');
      return;
    }

    try {
      const res = await fetch('http://192.168.0.8:5000/api/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          shift_date: selectedDate,
          start_time: startTime,
          end_time: endTime,
          position,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      if (selectedEmployeeId) {
        const assignRes = await fetch('http://192.168.0.8:5000/api/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            shift_id: data.shift.id,
            employee_id: selectedEmployeeId,
          }),
        });

        const assignData = await assignRes.json();
        if (!assignRes.ok) throw assignData;
      }

      Alert.alert('✅ Shift Created');
      setStartTime('');
      setEndTime('');
      setPosition('');
      setSelectedEmployeeId('');
      loadShifts();
    } catch (err) {
      console.error('Create shift error:', err);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  const getShiftsByRole = (role) => {
    return shifts.filter((s) => {
      const shiftDate = new Date(s.shift_date).toISOString().split('T')[0];
      return shiftDate === selectedDate && s.position === role;
    });
  };

  if (user?.user?.role !== 'manager') {
    return (
      <View style={{ padding: 20 }}>
        <Text>Access denied. This page is only for managers.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Manager Shift Builder</Text>

      {/* Calendar Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {calendarDates.map((date, index) => {
          const formatted = formatDate(date);
          const isSelected = selectedDate === formatted;
          const showMonth =
            index === 0 || date.getMonth() !== calendarDates[index - 1].getMonth();

          return (
            <View
              key={formatted}
              style={{ width: '14.28%', alignItems: 'center', marginBottom: 6, padding: 2 }}>
              {showMonth && (
                <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 2 }}>
                  {getMonthName(date)}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => setSelectedDate(formatted)}
                style={{
                  padding: 6,
                  backgroundColor: isSelected ? '#4CAF50' : '#f0f0f0',
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: isSelected ? '#388E3C' : '#ccc',
                }}>
                <Text style={{ fontSize: 12, color: isSelected ? 'white' : 'black' }}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {selectedDate !== '' && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Create Shift for {selectedDate}
          </Text>

          <Text>Start Time:</Text>
          <View style={{ borderWidth: 1, marginBottom: 10 }}>
            <Picker selectedValue={startTime} onValueChange={setStartTime}>
              <Picker.Item label="-- Select --" value="" />
              {timeOptions.map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </View>

          <Text>End Time:</Text>
          <View style={{ borderWidth: 1, marginBottom: 10 }}>
            <Picker selectedValue={endTime} onValueChange={setEndTime}>
              <Picker.Item label="-- Select --" value="" />
              {timeOptions.map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </View>

          <Text>Position:</Text>
          <View style={{ borderWidth: 1, marginBottom: 10 }}>
            <Picker selectedValue={position} onValueChange={setPosition}>
              <Picker.Item label="-- Select --" value="" />
              {positionOptions.map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </View>

          <Text>Assign to Employee:</Text>
          <View style={{ borderWidth: 1, marginBottom: 10 }}>
            <Picker selectedValue={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <Picker.Item label="-- Optional --" value="" />
              {employees.map((emp) => (
                <Picker.Item key={emp.id} label={emp.name || emp.email} value={emp.id} />
              ))}
            </Picker>
          </View>

          <Button title="Create Shift" onPress={handleCreateShift} />
        </View>
      )}

      {/* Schedule Grid */}
      {selectedDate !== '' && (
        <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Schedule for {selectedDate}
          </Text>

          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Lunch</Text>
          {lunchRoles.map((role) => (
            <Text key={role} style={{ marginBottom: 5 }}>
              {role}:{' '}
              {getShiftsByRole(role)
                .map((s) => {
                  const emp = employees.find((e) => e.id === s.employee_id);
                  return `${emp?.email || 'Unassigned'} (${s.start_time})`;
                })
                .join(', ') || '—'}
            </Text>
          ))}

          <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>Dinner</Text>
          {dinnerRoles.map((role) => (
            <Text key={role} style={{ marginBottom: 5 }}>
              {role}:{' '}
              {getShiftsByRole(role)
                .map((s) => {
                  const emp = employees.find((e) => e.id === s.employee_id);
                  return `${emp?.email || 'Unassigned'} (${s.start_time})`;
                })
                .join(', ') || '—'}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}