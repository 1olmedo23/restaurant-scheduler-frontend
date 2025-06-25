// src/app/create-shift.js
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Platform, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CreateShift() {
  const { user } = useAuth();
  const router = useRouter();

  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [position, setPosition] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const positionOptions = ['Server', 'Host', 'Busser', 'Manager'];
  const timeOptions = [
    '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00',
    '22:00', 'close'
  ];

  // Restrict access to managers
  if (user?.user?.role !== 'manager') {
    return (
      <View style={{ padding: 20 }}>
        <Text>Access denied. This page is only for managers.</Text>
      </View>
    );
  }

  // Fetch employee list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://192.168.0.8:5000/api/employees', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setEmployees(data); // data is already an array
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  const handleCreateShift = async () => {
    if (!shiftDate || !startTime || !endTime || !position) {
      Platform.OS === 'web'
        ? alert('Please complete all required fields.')
        : Alert.alert('Missing Fields', 'Please complete all required fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.8:5000/api/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          shift_date: shiftDate,
          start_time: startTime,
          end_time: endTime,
          position: position,
          employee_id: selectedEmployeeId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('❌ Server Error:', data);
        Platform.OS === 'web'
          ? alert(`❌ Failed: ${data.message || 'Error'}`)
          : Alert.alert('❌ Failed to create shift', data.message || '');
        return;
      }

      console.log('✅ Response Data:', data);

      Platform.OS === 'web'
        ? alert('✅ Shift Created: The shift was created successfully.')
        : Alert.alert('✅ Shift Created', 'The shift was created successfully.');

      setShiftDate('');
      setStartTime('');
      setEndTime('');
      setPosition('');
      setSelectedEmployeeId('');
    } catch (error) {
      console.error('❌ Error:', error);
      Platform.OS === 'web'
        ? alert('❌ Network Error')
        : Alert.alert('❌ Error', 'There was a problem creating the shift.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
        Create New Shift
      </Text>

      <Text>Select Date:</Text>
      <View style={{ borderWidth: 1, marginBottom: 10 }}>
        <Picker
          selectedValue={shiftDate}
          onValueChange={(val) => setShiftDate(val)}
        >
          <Picker.Item label="-- Select a date --" value="" color="gray" />
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            const formatted = date.toISOString().split('T')[0];
            return (
              <Picker.Item
                key={formatted}
                label={formatted}
                value={formatted}
                color="black"
              />
            );
          })}
        </Picker>
      </View>

      <Text>Start Time:</Text>
      <View style={{ borderWidth: 1, marginBottom: 10 }}>
        <Picker
          selectedValue={startTime}
          onValueChange={(val) => setStartTime(val)}
        >
          <Picker.Item label="-- Select start time --" value="" color="gray" />
          {timeOptions.map((time) => (
            <Picker.Item key={time} label={time} value={time} color="black" />
          ))}
        </Picker>
      </View>

      <Text>End Time:</Text>
      <View style={{ borderWidth: 1, marginBottom: 10 }}>
        <Picker
          selectedValue={endTime}
          onValueChange={(val) => setEndTime(val)}
        >
          <Picker.Item label="-- Select end time --" value="" color="gray" />
          {timeOptions.map((time) => (
            <Picker.Item key={time} label={time} value={time} color="black" />
          ))}
        </Picker>
      </View>

      <Text>Position:</Text>
      <View style={{ borderWidth: 1, marginBottom: 10 }}>
        <Picker
          selectedValue={position}
          onValueChange={(val) => setPosition(val)}
        >
          <Picker.Item label="-- Select a position --" value="" color="gray" />
          {positionOptions.map((pos) => (
            <Picker.Item key={pos} label={pos} value={pos} color="black" />
          ))}
        </Picker>
      </View>

      <Text>Assign to Employee (optional):</Text>
      <View style={{ borderWidth: 1, marginBottom: 20 }}>
        <Picker
          selectedValue={selectedEmployeeId}
          onValueChange={(val) => setSelectedEmployeeId(val)}
        >
          <Picker.Item
            label="-- Select an employee --"
            value=""
            color="gray"
          />
          {employees.map((emp) => (
            <Picker.Item
              key={emp.id}
              label={emp.name || emp.email}
              value={emp.id}
              color="black"
            />
          ))}
        </Picker>
      </View>

      <Button title="Create Shift" onPress={handleCreateShift} />
    </View>
  );
}