/* eslint-disable prettier/prettier */

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const SelectionScreen = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        {/* Title Text */}
        <Text style={styles.titleText}>WHIPPY BOIS</Text>

        {/* Question Text */}
        <Text style={styles.questionText}>Are you?</Text>

        {/* Line and Arrow Image */}
        <Image
          source={require('../../assets/arrow.png')} // Replace with the correct path to your line and arrow image
          style={styles.lineArrow}
        />

        {/* Buttons for Customer and Driver */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            // @ts-ignore
            onPress={() => nav.navigate('customersignup')}
            style={styles.button}>
            <Text style={styles.buttonText}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            //@ts-ignore
            onPress={() => nav.navigate('driverdetailScreen')}>
            <Text style={styles.buttonText}>Driver</Text>
          </TouchableOpacity>
        </View>

        {/* Ice Cream Truck Image */}
        <Image
          source={require('../../assets/car1.png')} // Make sure this path is correct
          style={styles.image}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 72,
    // color: "#30D0D0", // Assuming this is the color for the text
    color: '#FF0000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  questionText: {
    fontSize: 20,
    color: '#000000', // Assuming black for the question text
    marginVertical: 10, // Space above and below the question
  },
  lineArrow: {
    height: 100, // Adjust the height as necessary
    resizeMode: 'contain', // This will ensure the image is scaled properly
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20, // Space below the buttons
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    // backgroundColor: "#30D0D0", // Assuming this is the color for the buttons
    backgroundColor: '#FECC1D',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 130,
    marginVertical: 5,
    zIndex: 10,
  },
  buttonText: {
    // color: "#FFFFFF", // Assuming white for button text
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 550,
    height: 550,
    resizeMode: 'contain',
    marginTop: -110,
    marginBottom: -30,
  },
});
