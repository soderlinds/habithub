import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 

const AddHabitScreen = () => {
  const navigation = useNavigation(); 

  const [habit, setHabit] = useState('');
  const [userHabits, setUserHabits] = useState([]);

  useEffect(() => {
    loadUserHabits();
  }, []);

  const loadUserHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('userHabits');
      if (savedHabits) {
        setUserHabits(JSON.parse(savedHabits));
      }
    } catch (error) {
      console.error('Error loading userHabits:', error);
    }
  };

  const saveUserHabits = async (habits) => {
    try {
      await AsyncStorage.setItem('userHabits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving userHabits:', error);
    }
  };

  const handleAddHabit = () => {
    if (habit.trim() !== '') {
       const updatedHabits = [...userHabits, habit];
       setUserHabits(updatedHabits);
       saveUserHabits(updatedHabits);
       setHabit('');
       navigation.navigate('Home', { userHabits: updatedHabits });
    }
  }

  const handleRemoveHabit = (habitToRemove) => {
    const updatedHabits = userHabits.filter((h) => h !== habitToRemove);
    setUserHabits(updatedHabits);
    saveUserHabits(updatedHabits);
    navigation.navigate('Home', { userHabits: updatedHabits });
  };

  return (
    <ScrollView keyboardShouldPersistTaps='always'>
      <View style={styles.container}>
        <Text style={styles.title}>Add a New Habit</Text>
        <TextInput
          placeholder="Enter a new habit"
          value={habit}
          onChangeText={(text) => setHabit(text)}
          style={styles.input}
        />
        <Button title="Add Habit" color="#74acca" onPress={handleAddHabit} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Your Habits</Text>
        {userHabits.map((habitName) => (
          <TouchableOpacity
            key={habitName}
            onPress={() => handleRemoveHabit(habitName)}
            style={styles.habitItem}
          >
            <Text>{habitName}</Text>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#2e2e2e',
  },
  input: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  habitItem: {
    fontSize: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
  },
  removeText: {
    color: 'grey',
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
