import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HabitCard({ habit, onComplete, onEdit, onDelete }) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleValue = new Animated.Value(1);
  
  const isCompletedToday = habit.completedDates?.some(
    date => dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'),
  );

  // Calculate weekly progress
  const getWeeklyProgress = () => {
    const startOfWeek = dayjs().startOf('week');
    const completedThisWeek = habit.completedDates?.filter(date => 
      dayjs(date).isAfter(startOfWeek)
    ).length || 0;
    
    return Math.min(completedThisWeek, 7); // Max 7 days in a week
  };

  const weeklyProgress = getWeeklyProgress();
  const progressPercentage = (weeklyProgress / 7) * 100;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      style={[
        styles.card,
        isCompletedToday && styles.completedCard,
        {
          transform: [{ scale: scaleValue }],
          opacity: isCompletedToday ? 0.9 : 1,
        },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                isCompletedToday && styles.completedTitle,
              ]}
              numberOfLines={1}
            >
              {habit.title}
            </Text>
            {isCompletedToday && (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
                <Text style={styles.completedText}>Done</Text>
              </View>
            )}
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.iconButton, styles.editButton]}
              onPress={onEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="edit" size={20} color="#3A86FF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, styles.deleteButton]}
              onPress={onDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="delete-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {habit.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {habit.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          {!isCompletedToday ? (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={onComplete}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add-task" size={20} color="white" />
              <Text style={styles.completeButtonText}>Complete Today</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedContainer}>
              <Text style={styles.completedMessage}>Great job today!</Text>
            </View>
          )}
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {weeklyProgress}/7 days this week
            </Text>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  completedCard: {
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  completedTitle: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: 'rgba(58, 134, 255, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  completedContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  completedMessage: {
    color: '#2e7d32',
    fontWeight: '500',
    fontSize: 14,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  completedText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});
