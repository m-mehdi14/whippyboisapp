/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {View, Text} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native';

const DriverDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <View>
        <Text style={styles.titleText}>WHIPPY BOIS</Text>
        {/* Description */}
        <View>
          <Text style={styles.descriptionText}>
            Bringing Sweet Swirls and Smiles to Your Neighborhood!
          </Text>
        </View>
        {/* Button */}
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity
            style={styles.button}
            //@ts-ignore
            onPress={() => nav.navigate('driversignup')}>
            <Text style={styles.buttonText}>Next</Text>
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
    // justifyContent: "center",
  },
  titleText: {
    fontSize: 72,
    // color: "#30D0D0", // Assuming this is the color for the text
    color: '#FF0000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  descriptionText: {
    fontSize: 24,
    color: 'black',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 50,
    padding: 10,
    paddingTop: 0,
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
});
