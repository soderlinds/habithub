import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const StatisticsScreen = ({ successfulDays, habitCounts, totalDays }) => {
 
  const successRate = (successfulDays / totalDays) * 100;

    const habitColors = [
      '#A9DFF0',
      '#C1CDC0', 
      '#E6E6E6', 
      '#95ac93', 
      '#74acca', 
      '#B8E0D2', 
      '#D1D1D1',
    ];
  
    
    const pieChartData = Object.entries(habitCounts).map(([habit, count], index) => ({
      name: habit,
      population: count,
      color: habitColors[index % habitColors.length], 
      legendFontColor: 'black', 
      legendFontSize: 15,
    }));
  
    pieChartData.sort((a, b) => b.population - a.population);
    
    const chartConfig = {
      backgroundColor: 'transparent',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

  return (
    <ScrollView>
      <Text style={styles.headerText}>Statistics</Text>
      <View style={styles.statContainer}>
        <Text style={styles.statLabel}>Total days:</Text>
        <Text style={styles.statValue}>{totalDays}</Text>
      </View>
      <View style={styles.statContainer}>
        <Text style={styles.statLabel}>Successful days:</Text>
        <Text style={styles.statValue}>{successfulDays}</Text>
      </View>
      <View style={styles.statContainer}>
        <Text style={styles.statLabel}>Success rate:</Text>
        <Text style={styles.statValue}>{successRate.toFixed(2)}%</Text>
      </View>
      
      <Text style={styles.headerText2}>Habits</Text>
      <PieChart
        data={pieChartData}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      {pieChartData.map(({ name, population, color }) => (
        <View key={name} style={styles.habitContainer}>
        </View>
      
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    marginBottom: 16,
    color: '#2e2e2e',
    margin: 16,
  },
  headerText2: {
    marginTop: 35,
    fontSize: 22,
    marginBottom: 16,
    color: '#2e2e2e',
    margin: 16,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  statLabel: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 18,
  },

});

export default StatisticsScreen;