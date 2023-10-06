import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';

const HomeScreen = ({ route, navigation, successfulDays, setSuccessfulDays, habitCounts, setHabitCounts }) => {
  const [userHabits, setUserHabits] = useState([]);
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [randomHeaderText, setRandomHeaderText] = useState('');

  const [showCongratulations, setShowCongratulations] = useState(false);

  useEffect(() => {
    const headerTexts = [
      "Select your habits for the day and make it count!",
      "Time to build some positive habits. Choose yours now!",
      "Let's make today productive. Pick your habits!",
      "Your habits, your progress. Select your daily goals!",
    ];

    setRandomHeaderText(headerTexts[Math.floor(Math.random() * headerTexts.length)]);
  }, []);

  useEffect(() => {
    const fetchUserHabits = async () => {
      try {
        const savedHabits = await AsyncStorage.getItem('userHabits');
        if (savedHabits) {
          setUserHabits(JSON.parse(savedHabits));
        }

        else if (route.params && route.params.userHabits) {
          setUserHabits(route.params.userHabits);
        }
      } catch (error) {
        console.error('Error loading userHabits:', error);
      }
    };

    fetchUserHabits();
  }, [route.params]);

  const toggleHabit = (habitName) => {
    if (!showCongratulations) { 
      if (selectedHabits.includes(habitName)) {
        setSelectedHabits(selectedHabits.filter((habit) => habit !== habitName));
      } else if (selectedHabits.length < 3) {
        setSelectedHabits([...selectedHabits, habitName]);
      }
    }
  };

  useEffect(() => {
    const currentDate = moment();
    const checkLastSelectionDate = async () => {
      const lastSelectionDateStr = await AsyncStorage.getItem('lastSelectionDate');
      const lastSelectionDate = moment(lastSelectionDateStr);

      if (!lastSelectionDate || !isSameDay(lastSelectionDate, currentDate)) {
        setShowCongratulations(false);
      } else {
        setShowCongratulations(true);
      }
    };

    checkLastSelectionDate();
  }, [successfulDays]);

  const isSameDay = (date1, date2) => {
    return date1.isSame(date2, 'day');
  };

  const progress = (selectedHabits.length / 3) * 100;

  const handleHabitsDone = async () => {
    const currentDate = moment();

    const lastSelectionDateStr = await AsyncStorage.getItem('lastSelectionDate');
    const lastSelectionDate = moment(lastSelectionDateStr);

    if (!lastSelectionDate || !isSameDay(lastSelectionDate, currentDate)) {

      setShowCongratulations(true);
      setSuccessfulDays(successfulDays + 1);

      const updatedCounts = { ...habitCounts };
      selectedHabits.forEach((habit) => {
        updatedCounts[habit] = (updatedCounts[habit] || 0) + 1;
      });
      setHabitCounts(updatedCounts);

      await AsyncStorage.setItem('lastSelectionDate', currentDate.format('YYYY-MM-DD'));
 
    } else {

      setShowCongratulations(false);
    }
  };

  return (
    <ScrollView>
    <Header />
      <Text style={styles.headerText}>{randomHeaderText}</Text>

      {userHabits.map((habit) => (
        <View
          key={habit}
          style={{
            backgroundColor: selectedHabits.includes(habit) ? 'lightgray' : 'white',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
          }}
        >
          <Text
            onPress={() => toggleHabit(habit)}
            style={{ fontSize: 16, color: selectedHabits.includes(habit) ? 'black' : 'black' }}
          >
            {habit}
          </Text>
        </View>
      ))}

      <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 12 }}>
        Progress: {selectedHabits.length} / 3
      </Text>
      <ProgressBar progress={progress / 100} color="#74acca" style={{ height: 5, marginTop: 10 }} />

      <Text style={{ fontSize: 18, padding: 6, marginTop: 24, marginLeft: 5 }}>
        Today's Habits
      </Text>

      {showCongratulations ? (
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 8 }}> Habits done for today! 🎉</Text>
      ) : (
        selectedHabits.length === 0 ? (
          <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 8 }}>No habits done yet</Text>
        ) : (
          selectedHabits.map((habitName) => (
            <View key={habitName} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
              <Text style={{ fontSize: 16 }}>{habitName}</Text>
            </View>
          ))
        )
      )}

    {!showCongratulations && selectedHabits.length === 3 && (
        <Button title="Habits Done!" color="#74acca" onPress={handleHabitsDone} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#246c5a',
    padding: 16,
    textShadowColor: 'rgba(128, 128, 128, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
});

export default HomeScreen;