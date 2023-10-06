import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AddActivityScreen from './screens/AddActivityScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddHabitScreen from './screens/AddHabitScreen';
import Header from './components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [successfulDays, setSuccessfulDays] = useState(0);
  const [habitCounts, setHabitCounts] = useState({});
  const [userHabits, setUserHabits] = useState([]);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const fetchStartDate = async () => {
      const storedStartDate = await AsyncStorage.getItem('appStartDate');
      if (!storedStartDate) {
        const currentDate = moment().format('YYYY-MM-DD');
        await AsyncStorage.setItem('appStartDate', currentDate);
        setTotalDays(1);
      } else {
        const startDate = moment(storedStartDate, 'YYYY-MM-DD');
        const currentDate = moment();
        const daysDifference = currentDate.diff(startDate, 'days') + 1;
        setTotalDays(daysDifference);
      }
    };

    const fetchSuccessfulDays = async () => {
      const storedSuccessfulDays = await AsyncStorage.getItem('successfulDays');
      if (storedSuccessfulDays) {
        setSuccessfulDays(parseInt(storedSuccessfulDays, 10));
      }
    };

    const fetchHabitCounts = async () => {
      const storedHabitCounts = await AsyncStorage.getItem('habitCounts');
      if (storedHabitCounts) {
        setHabitCounts(JSON.parse(storedHabitCounts));
      }
    };

    fetchStartDate();
    fetchSuccessfulDays();
    fetchHabitCounts();
  }, []);

  const updateSuccessfulDays = useCallback((count) => {
    setSuccessfulDays(count);
    AsyncStorage.setItem('successfulDays', count.toString());
  }, []);

  const updateHabitCounts = useCallback((counts) => {
    setHabitCounts(counts);
    AsyncStorage.setItem('habitCounts', JSON.stringify(counts));
  }, []);

  const updateUserHabits = useCallback((habits) => {
    setUserHabits(habits);
  }, []);

  const HomeScreenComponent = (props) => (
    <HomeScreen
      {...props}
      setSuccessfulDays={updateSuccessfulDays}
      successfulDays={successfulDays}
      habitCounts={habitCounts}
      setHabitCounts={updateHabitCounts}
      userHabits={userHabits}
      totalDays={totalDays}
    />
  );

  const StatisticsScreenComponent = (props) => (
    <StatisticsScreen
      {...props}
      successfulDays={successfulDays}
      habitCounts={habitCounts}
      totalDays={totalDays}
    />
  );

  const AddHabitScreenComponent = (props) => (
    <AddHabitScreen
      {...props}
      userHabits={userHabits}
      updateUserHabits={updateUserHabits}
    />
  );

  return (
    <View style={styles.container}>
      <NavigationContainer style={{ flex: 1, backgroundColor: '#246c5a' }}>
     
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: (props) => <Header {...props} />,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreenComponent}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="AddActivity" component={AddActivityScreen} />
          <Stack.Screen
            name="Statistics"
            component={StatisticsScreenComponent}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="AddHabit"
            component={AddHabitScreenComponent}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#246c5a', 
  },
});
