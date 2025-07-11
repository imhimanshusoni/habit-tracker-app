import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import dayjs from 'dayjs';
import { Picker } from '@react-native-picker/picker';
import { habitsAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);

  // New states for habit creation form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const data = await habitsAPI.getHabits();
        setHabits(data);
      } catch (error) {
        console.error('Error loading habits:', error);
        Alert.alert('Error', 'Failed to load habits');
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  const isCompletedToday = habit => {
    const todayStr = dayjs().format('YYYY-MM-DD');
    return habit.completedDates.some(
      date => dayjs(date).format('YYYY-MM-DD') === todayStr,
    );
  };

  const completeHabit = async habit => {
    const today = dayjs().format('YYYY-MM-DD');

    try {
      const updatedHabit = await habitsAPI.completeHabit(habit._id, today);

      setHabits(prev =>
        prev.map(h => (h._id === updatedHabit._id ? updatedHabit : h)),
      );
    } catch (error) {
      console.error('Error completing habit:', error);
      Alert.alert('Error', 'Failed to complete habit');
    }
  };

  const createHabit = async () => {
    if (!title.trim()) {
      Alert.alert('Title is required');
      return;
    }

    setCreating(true);

    try {
      const newHabit = await habitsAPI.createHabit({
        title,
        description,
        frequency,
      });

      setHabits(prev => [...prev, newHabit]);
      setTitle('');
      setDescription('');
      setFrequency('daily');
      Alert.alert('Success', 'Habit created!');
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', error.message || 'Failed to create habit');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const todayHabits = habits.filter(h => h.frequency === 'daily');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Habits</Text>
      {todayHabits.length === 0 && (
        <Text>No daily habits yet. Create some!</Text>
      )}

      <FlatList
        data={todayHabits}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.habitItem}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  textDecorationLine: isCompletedToday(item)
                    ? 'line-through'
                    : 'none',
                  color: isCompletedToday(item) ? 'gray' : 'black',
                }}
              >
                {item.title}
              </Text>
              {item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : null}
            </View>
            {!isCompletedToday(item) && (
              <Button
                title="Complete"
                onPress={() => completeHabit(item)}
                color="#4CAF50"
              />
            )}
            {isCompletedToday(item) && <Text>✓ Completed</Text>}
          </View>
        )}
      />

      {/* Habit creation form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Add New Habit</Text>

        <TextInput
          placeholder="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          editable={!creating}
        />
        <TextInput
          placeholder="Description (optional)"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          editable={!creating}
        />

        {/* Picker for frequency */}
        {Platform.OS === 'android' ? (
          <Picker
            selectedValue={frequency}
            onValueChange={itemValue => setFrequency(itemValue)}
            enabled={!creating}
            style={styles.picker}
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
        ) : (
          // For iOS you can implement a different picker or input here
          <Text>Frequency: {frequency}</Text>
        )}

        <Button
          title={creating ? 'Creating...' : 'Create Habit'}
          onPress={createHabit}
          disabled={creating}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  description: { color: '#555', fontSize: 14, marginTop: 4 },
  form: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    marginBottom: 12,
  },
});
