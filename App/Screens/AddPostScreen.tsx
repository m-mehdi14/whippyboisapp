/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCurrentUser} from '../../hooks/currentUser';
import Geolocation from '@react-native-community/geolocation';
import {registerBooking} from '../../hooks/register-booking';
import {TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddPostScreen() {
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();

  const [date, setDate] = useState(new Date());
  const [quantity, setquantity] = useState('');
  const [number, setnumber] = useState('');
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [location, setLocation] = useState(null);
  // const [errorMsg, setErrorMsg] = useState(null);
  // console.log("Location ---> ", location.coords);
  const [isLoading, setisLoading] = useState(false);
  console.log(userLocation);

  useEffect(() => {
    // notificationButton();
    requestLocationPermission(); // Request location permissions
  }, []);

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event: any, selectedTime: any) => {
    setShowTimePicker(false);
    if (selectedTime !== undefined) {
      const selectedDate = new Date(selectedTime);
      setDate(selectedDate);
    }
  };

  /**
   * Request Location Permission
   */
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getUserLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getUserLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  /**
   * Get User Location
   */
  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position?.coords);
        setUserLocation(position?.coords as any);
        setLocation(position as any); // Update location state
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  /**
   * Register Your Booking
   */
  const handleSubmitButton = async () => {
    setisLoading(true);
    let response = await registerBooking({
      quatity: quantity,
      date: date,
      number: number,
      address: address,
      location: location as any,
      user: user,
    });
    setisLoading(false);
    if (response.success) {
      Alert.alert('Booked', response.success);
    }
    if (!response.success) {
      Alert.alert('Booking unsuccessfully !', response.error);
    }
    setquantity('');
    setnumber('');
    setAddress('');
    setDate(new Date());
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop: insets.top}]}
      behavior="padding"
      keyboardVerticalOffset={Platform.select({ios: 0, android: 25})}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.headingText}>Whippy Bois</Text>
          <Text style={styles.subHeading}>Booking</Text>

          <View>
            <TextInput
              style={{
                // backgroundColor: '#CFCFCF',
                backgroundColor: '#737373',
                height: 59,
                width: 298,
                marginTop: 20,
                borderRadius: 10,
                padding: 10,
                color: '#000',
              }}
              placeholder="How many ice cream ?"
              placeholderTextColor={'#fff'}
              keyboardAppearance="default"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={e => setquantity(e)}
            />
            {/* Date && Time */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // backgroundColor: '#CDCDCD',
                backgroundColor: '#737373',
                height: 81,
                width: 298,
                marginTop: 20,
                borderRadius: 10,
                justifyContent: 'space-between',
                paddingHorizontal: 50,
              }}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text
                  style={{
                    color: '#fff',
                  }}>
                  Date
                </Text>
              </TouchableOpacity>
              <View style={styles.verticalLine} />
              <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <Text
                  style={{
                    color: '#fff',
                  }}>
                  Time
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                testID="timePicker"
                value={date}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            {/* Show Date and time */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // backgroundColor: '#CDCDCD',
                backgroundColor: '#737373',
                // height: 50,
                width: 298,
                marginTop: 20,
                borderRadius: 10,
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <TouchableOpacity>
                <Text
                  style={{
                    color: '#fff',
                  }}>
                  {date.toDateString()}
                </Text>
              </TouchableOpacity>
              {/* <View style={styles.verticalLine} /> */}
              <TouchableOpacity>
                <Text
                  style={{
                    color: '#fff',
                  }}>
                  {date.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Contact Number */}
            <TextInput
              style={{
                // backgroundColor: '#CFCFCF',
                backgroundColor: '#737373',
                height: 42,
                width: 298,
                marginTop: 20,
                borderRadius: 10,
                padding: 10,
              }}
              placeholder="Contact Number ?"
              placeholderTextColor={'#fff'}
              keyboardAppearance="default"
              keyboardType="number-pad"
              value={number}
              onChangeText={e => setnumber(e)}
            />

            <TextInput
              style={{
                // backgroundColor: '#CFCFCF',
                backgroundColor: '#737373',
                height: 77,
                width: 298,
                marginTop: 20,
                borderRadius: 10,
                padding: 10,
                marginBottom: 90,
                alignItems: 'flex-start',
              }}
              multiline={true}
              placeholder="Address for Delivery ?"
              placeholderTextColor={'#fff'}
              value={address}
              onChangeText={e => setAddress(e)}
            />

            {/* Submit Button */}
            <TouchableOpacity
              disabled={isLoading}
              onPress={() => handleSubmitButton()}
              style={styles.logoutButton}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#E4E4E4',
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 35,
    alignItems: 'center',
    width: '100%',
  },
  headingText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    color: '#000',
  },
  verticalLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#000',
  },
  logoutButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    // marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#000',
    position: 'absolute',
    bottom: 30,
    left: '25%',
  },
});
