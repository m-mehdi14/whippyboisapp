/* eslint-disable prettier/prettier */

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // You can adjust the threshold as per your tablet size preferences

const SelectionScreen = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        {/* Title Text */}
        <Text style={[styles.titleText, isTablet && styles.titleTextTablet]}>
          WHIPPY BOIS
        </Text>

        {/* Question Text */}
        <Text
          style={[styles.questionText, isTablet && styles.questionTextTablet]}>
          Are you?
        </Text>

        {/* Line and Arrow Image */}
        <Image
          source={require('../../assets/arrow.png')} // Replace with the correct path to your line and arrow image
          style={[styles.lineArrow, isTablet && styles.lineArrowTablet]}
        />

        {/* Buttons for Customer and Driver */}
        <View
          style={[
            styles.buttonContainer,
            isTablet && styles.buttonContainerTablet,
          ]}>
          <TouchableOpacity
            // @ts-ignore
            onPress={() => nav.navigate('customersignup')}
            style={[styles.button, isTablet && styles.buttonTablet]}>
            <Text
              style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
              Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isTablet && styles.buttonTablet]}
            //@ts-ignore
            onPress={() => nav.navigate('driverdetailScreen')}>
            <Text
              style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
              Driver
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ice Cream Truck Image */}
        <Image
          source={require('../../assets/car1.png')} // Make sure this path is correct
          style={[styles.image, isTablet && styles.imageTablet]}
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
    fontSize: 48, // Adjusted for better scalability
    color: '#FF0000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  titleTextTablet: {
    fontSize: 90, // Larger font for tablets
    marginTop: 70,
  },
  questionText: {
    fontSize: 20,
    color: '#000000',
    marginVertical: 10,
  },
  questionTextTablet: {
    fontSize: 32, // Increase text size for tablets
    marginVertical: 20,
  },
  lineArrow: {
    height: 80, // Adjusted height for better scaling
    resizeMode: 'contain',
  },
  lineArrowTablet: {
    height: 140, // Larger size for tablet view
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonContainerTablet: {
    marginBottom: 40, // Increase space for tablet screens
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
  },
  buttonTablet: {
    paddingHorizontal: 30,
    paddingVertical: 20, // Increase padding for tablets
    width: 180, // Adjust button width for larger screens
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTextTablet: {
    fontSize: 26, // Larger font size for tablet
  },
  image: {
    width: 400, // Adjust image size for better scalability
    height: 400,
    resizeMode: 'contain',
    marginTop: -50,
    marginBottom: -10,
  },
  imageTablet: {
    width: 600, // Larger image size for tablet screens
    height: 600,
    marginTop: -100,
  },
});
