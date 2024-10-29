/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Check if the device is a tablet

const SplashScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          paddingTop: insets.top,
          flex: 1,
        }}>
        <View style={styles.container}>
          <View style={[styles.card, isTablet && styles.cardTablet]}>
            <Text
              style={[styles.titleText, isTablet && styles.titleTextTablet]}>
              WHIPPY BOIS
            </Text>
            <Text
              style={[
                styles.descriptionText,
                isTablet && styles.descriptionTextTablet,
              ]}>
              Best Ice Cream in the Town!
            </Text>
            <View style={{zIndex: 10}}>
              <TouchableOpacity
                style={[styles.button, isTablet && styles.buttonTablet]}
                onPress={() => {
                  //@ts-ignore
                  navigation.navigate('selectionScreen');
                  console.log('CLicked!');
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    isTablet && styles.buttonTextTablet,
                  ]}>
                  GET STARTED
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/car1.png')}
                style={[styles.image, isTablet && styles.imageTablet]}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FECC1D',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    width: '70%',
    height: '100%',
    marginTop: 200,
  },
  cardTablet: {
    width: '60%', // Adjust width for tablet
    marginTop: 150, // Adjust margin for better centering
  },
  titleText: {
    fontSize: 60,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 25,
    fontWeight: 'bold',
  },
  titleTextTablet: {
    fontSize: 90, // Increase font size for tablets
    marginTop: 40,
  },
  descriptionText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  descriptionTextTablet: {
    fontSize: 24, // Increase font size for tablets
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTablet: {
    paddingHorizontal: 30,
    paddingVertical: 15, // Larger padding for tablets
    marginTop: 60, // Adjust margin for spacing
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTextTablet: {
    fontSize: 26, // Larger font size for tablets
  },
  imageContainer: {
    position: 'absolute',
    top: -50,
    width: '200%',
    alignItems: 'center',
  },
  image: {
    width: 550,
    height: 550,
    resizeMode: 'contain',
    marginTop: 250,
  },
  imageTablet: {
    width: 700, // Larger image size for tablets
    height: 700,
    marginTop: 300,
  },
});
