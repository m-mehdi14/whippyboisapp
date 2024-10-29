/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Detect tablet screen

const DriverDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <View>
        <Text style={[styles.titleText, isTablet && styles.titleTextTablet]}>
          WHIPPY BOIS
        </Text>

        <View>
          <Text
            style={[
              styles.descriptionText,
              isTablet && styles.descriptionTextTablet,
            ]}>
            Bringing Sweet Swirls and Smiles to Your Neighborhood!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isTablet && styles.buttonTablet]}
            //@ts-ignore
            onPress={() => nav.navigate('driversignup')}>
            <Text
              style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DriverDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 72,
    color: '#FF0000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  titleTextTablet: {
    fontSize: 96, // Larger font size for tablets
  },
  descriptionText: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    marginTop: 50,
    padding: 10,
    paddingTop: 0,
  },
  descriptionTextTablet: {
    fontSize: 32, // Larger font size for tablets
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FECC1D',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 130,
    marginVertical: 5,
    zIndex: 10,
  },
  buttonTablet: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    width: 180, // Larger button for tablets
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTextTablet: {
    fontSize: 24, // Larger font size for tablets
  },
});
