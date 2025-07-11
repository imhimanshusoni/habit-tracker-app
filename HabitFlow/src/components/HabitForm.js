import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import React from 'react';

export default function HabitForm({
  title,
  setTitle,
  description,
  setDescription,
  frequency,
  setFrequency,
  onSubmit,
  creating,
  error,
}) {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Add New Habit</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Description (optional)"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#888"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={frequency}
          onValueChange={setFrequency}
          style={styles.picker}
        >
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, creating && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={creating}
      >
        <Text style={styles.buttonText}>
          {creating ? 'Creating...' : 'Create Habit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    borderTopWidth: 0,
    paddingTop: 12,
    marginTop: 16,
    marginBottom: 90,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: '#111',
    borderWidth: 1,
    borderColor: '#eee',
  },
  pickerContainer: {
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    color: '#808080',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A86FF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#3A86FF',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#d72631',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '400',
  },
});
