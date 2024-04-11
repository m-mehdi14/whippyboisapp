/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

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
          <View style={styles.card}>
            <Text style={styles.titleText}>WHIPPY BOIS</Text>
            <Text style={styles.descriptionText}>
              Best Ice Cream in the Town!
            </Text>
            <View
              style={{
                zIndex: 10,
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  //@ts-ignore
                  navigation.navigate('selectionScreen');
                  console.log('CLicked!');
                }}>
                <Text style={styles.buttonText}>GET STARTED</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/car1.png')}
                style={styles.image}
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
    // backgroundColor: "#30D0D0",
    backgroundColor: '#FECC1D',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    width: '70%',
    height: '100%',
    marginTop: 200,
  },
  titleText: {
    fontSize: 60,
    // color: "#ffffff",
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 25,
    fontWeight: 'bold',
  },
  descriptionText: {
    // color: "#ffffff",
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
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
  buttonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
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
});
