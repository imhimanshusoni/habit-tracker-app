import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import { Picker } from '@react-native-picker/picker';
import { habitsAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [selectedTab, setSelectedTab] = useState('daily');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFrequency, setEditFrequency] = useState('daily');
  const [savingEdit, setSavingEdit] = useState(false);
  // New state for form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const data = await habitsAPI.getHabits();
        setHabits(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to load habits');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const completeHabit = async habit => {
    try {
      const updated = await habitsAPI.completeHabit(habit);
      setHabits(prev => prev.map(h => (h._id === updated._id ? updated : h)));
    } catch (err) {
      Alert.alert('Error', 'Could not complete habit');
    }
  };

  const createHabit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setCreating(true);
    setError('');
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
      setIsFormVisible(false); // Hide form after creation
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create habit');
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = habit => {
    setEditHabit(habit);
    setEditTitle(habit.title);
    setEditDescription(habit.description || '');
    setEditFrequency(habit.frequency);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditHabit(null);
    setEditTitle('');
    setEditDescription('');
    setEditFrequency('daily');
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Title is required');
      return;
    }
    setSavingEdit(true);

    try {
      const updatedHabit = await habitsAPI.updateHabit(editHabit._id, {
        title: editTitle,
        description: editDescription,
        frequency: editFrequency,
      });

      setHabits(prev =>
        prev.map(h => (h._id === updatedHabit._id ? updatedHabit : h)),
      );
      closeEditModal();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update habit');
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteHabit = habitId => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await habitsAPI.deleteHabit(habitId);
            setHabits(prev => prev.filter(h => h._id !== habitId));
          } catch {
            Alert.alert('Error', 'Failed to delete habit');
          }
        },
      },
    ]);
  };

  const filteredHabits = habits.filter(h => h.frequency === selectedTab);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3A86FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>Habits</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['daily', 'weekly', 'monthly'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredHabits.length === 0 && (
        <Text style={styles.emptyState}>
          No {selectedTab} habits. Add one below!
        </Text>
      )}

      <FlatList
        data={filteredHabits}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onComplete={() => completeHabit(item)}
            onEdit={() => openEditModal(item)}
            onDelete={() => deleteHabit(item._id)}
          />
        )}
        style={styles.habitsList}
      />

      {/* Habit Form */}
      {isFormVisible && (
        <HabitForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          frequency={frequency}
          setFrequency={setFrequency}
          onSubmit={createHabit}
          creating={creating}
          error={error}
        />
      )}

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsFormVisible(!isFormVisible)}
      >
        <Text style={styles.fabText}>{isFormVisible ? '−' : '+'}</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={closeEditModal}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Habit</Text>

            <TextInput
              placeholder="Title"
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              editable={!savingEdit}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Description (optional)"
              style={styles.input}
              value={editDescription}
              onChangeText={setEditDescription}
              editable={!savingEdit}
              placeholderTextColor="#888"
            />

            {Platform.OS === 'android' ? (
              <Picker
                selectedValue={editFrequency}
                onValueChange={setEditFrequency}
                enabled={!savingEdit}
                style={styles.picker}
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
              </Picker>
            ) : (
              <Text>Frequency: {editFrequency}</Text>
            )}

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={closeEditModal}
                disabled={savingEdit}
              />
              <Button
                title={savingEdit ? 'Saving...' : 'Save'}
                onPress={saveEdit}
                disabled={savingEdit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: '#3A86FF',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#3A86FF',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  habitsList: {
    flex: 1,
  },
  logoutBtn: {
    paddingHorizontal: 16,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3A86FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    position: 'absolute',
    top: 8,
    fontSize: 30,
    fontWeight: 'bold',
  },
});
