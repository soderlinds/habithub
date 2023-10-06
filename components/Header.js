import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Header = () => {
  const navigation = useNavigation();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => {
          navigation.navigate('Home');
          closeMenu();
        }}
      >
        <Text style={styles.headerText}>Habit Hub</Text>
      </Pressable>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name={isMenuOpen ? 'close' : 'menu'} size={30} color="green" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuOpen}
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={styles.menu}>
            <Pressable
              onPress={() => {
                navigation.navigate('Home');
                closeMenu();
              }}
            >
              <Text style={styles.menuItem}>My daily habits</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('AddHabit');
                closeMenu();
              }}
            >
              <Text style={styles.menuItem}>Add habit</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('Statistics');
                closeMenu();
              }}
            >
              <Text style={styles.menuItem}>Statistics</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1, 
    borderColor: '#246c5a', 
    backgroundColor: 'white',
    marginTop: 30,
  },
  headerText: {
    color: '#246c5a',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    marginRight: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menu: {
    marginTop: 60,
    backgroundColor: 'white',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 16,
  },
  menuItem: {
    fontSize: 24,
    paddingVertical: 20,
  },
});

export default Header;