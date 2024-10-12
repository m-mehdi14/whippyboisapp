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
  ActivityIndicator,
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
  const [time, setTime] = useState(new Date());
  const [quantity, setQuantity] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission(); // Request location permissions
  }, []);

  // useEffect(() => {
  //   if (user && user.user && user.user.userId) {
  //     fetchBookings(); // Fetch bookings once user is available
  //   }
  // }, [user]);

  // const fetchBookings = async () => {
  //   try {
  //     const response = await getBookingsByUserId(user.user.userId);
  //     console.log('Bookings response:', response);
  //     if (response.success) {
  //       setBookings(response.data);
  //     } else {
  //       Alert.alert('Error', response.error);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //     Alert.alert('Error', 'Failed to fetch bookings.');
  //   } finally {
  //     setFetchingBookings(false);
  //   }
  // };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      console.log('Selected date:', selectedDate); // Logging selected date
    }
  };

  const handleTimeChange = (event: any, selectedTime: any) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      console.log('Selected time:', selectedTime); // Logging selected time
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
      (position: any) => {
        console.log(position?.coords);
        setUserLocation(position.coords);
        setLocation(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  /**
   * Register Your Booking
   */
  const handleSubmitButton = async () => {
    if (!user || !user.user || !user?.user?.userId) {
      Alert.alert('Error', 'User is not available.');
      return;
    }

    setIsLoading(true);
    let selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours());
    selectedDateTime.setMinutes(time.getMinutes());

    console.log('Booking data:', {
      quatity: quantity,
      date: selectedDateTime,
      number: number,
      address: address,
      location: location,
      user: user,
    }); // Logging booking data

    let response = await registerBooking({
      quatity: quantity,
      date: selectedDateTime,
      number: number,
      address: address,
      location: location as any,
      user: user,
    });
    setIsLoading(false);
    if (response.success) {
      Alert.alert('Booked', response.success);
      setQuantity('');
      setNumber('');
      setAddress('');
      setDate(new Date());
      setTime(new Date());
    } else {
      Alert.alert('Booking unsuccessful!', response.error);
    }
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
              style={styles.input}
              placeholder="How many ice creams?"
              placeholderTextColor={'#fff'}
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
            />
            {/* Date & Time */}
            <TouchableOpacity
              style={styles.dateTimeContainer}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateTimeText}>Select Date</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeContainer}
              onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateTimeText}>Select Time</Text>
            </TouchableOpacity>
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
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            {/* Show Date and time */}
            <View style={styles.displayDateTimeContainer}>
              <Text style={styles.displayDateTimeText}>
                {date.toDateString()}
              </Text>
              <Text style={styles.displayDateTimeText}>
                {time.toLocaleTimeString()}
              </Text>
            </View>

            {/* Contact Number */}
            <TextInput
              style={styles.input}
              placeholder="Contact Number?"
              placeholderTextColor={'#fff'}
              keyboardType="number-pad"
              value={number}
              onChangeText={setNumber}
            />

            {/* Address */}
            <TextInput
              style={[styles.input, styles.addressInput]}
              multiline={true}
              placeholder="Address for Delivery?"
              placeholderTextColor={'#fff'}
              value={address}
              onChangeText={setAddress}
            />

            {/* Submit Button */}
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleSubmitButton}
              style={styles.submitButton}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.submitButtonText}>Book Now</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
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
  input: {
    backgroundColor: '#737373',
    height: 59,
    width: 298,
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    color: '#fff',
  },
  addressInput: {
    height: 77,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  dateTimeContainer: {
    alignItems: 'center',
    backgroundColor: '#737373',
    height: 59,
    width: 298,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  dateTimeText: {
    color: '#fff',
  },
  verticalLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#000',
  },
  displayDateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#737373',
    width: 298,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 20,
  },
  displayDateTimeText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#000',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
