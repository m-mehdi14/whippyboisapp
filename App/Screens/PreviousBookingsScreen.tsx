/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCurrentUser} from '../../hooks/currentUser';
import {getBookingsByUserId} from '../../hooks/register-booking';

export default function PreviousBookingsScreen() {
  const insets = useSafeAreaInsets();
  const user: any = useCurrentUser();

  const [bookings, setBookings] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(true);

  useEffect(() => {
    if (user && user.user && user.user.userId) {
      fetchBookings(); // Fetch bookings once user is available
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response: any = await getBookingsByUserId(user?.user?.userId);
      console.log('Bookings response:', response);
      if (response.success) {
        setBookings(response.data);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch bookings.');
    } finally {
      setFetchingBookings(false);
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return isNaN(date) ? 'Invalid Date' : date.toDateString();
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp.toDate();
    return isNaN(date) ? 'Invalid Date' : date.toLocaleTimeString();
  };

  return (
    <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        <Text style={styles.headingText}>Whippy Bois</Text>
        <Text style={styles.subHeading}>Previous Bookings</Text>

        {fetchingBookings ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : bookings.length > 0 ? (
          <View style={styles.bookingsContainer}>
            {bookings.map((booking: any, index) => (
              <View key={index} style={styles.bookingItem}>
                <Text
                  style={
                    styles.bookingText
                  }>{`Ice Creams: ${booking.booking?.quatity}`}</Text>
                <Text style={styles.bookingText}>{`Date: ${formatDate(
                  booking.booking.date,
                )}`}</Text>
                <Text style={styles.bookingText}>{`Time: ${formatTime(
                  booking.booking.date,
                )}`}</Text>
                <Text
                  style={
                    styles.bookingText
                  }>{`Number: ${booking.booking.number}`}</Text>
                <Text
                  style={
                    styles.bookingText
                  }>{`Address: ${booking.booking.address}`}</Text>
                <Text style={styles.bookingText}>{`Status: ${
                  booking.booking.status || 'Pending'
                }`}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noBookingsText}>No bookings available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  headingText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginTop: 10,
  },
  bookingsContainer: {
    marginTop: 20,
    width: '90%',
  },
  bookingItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  bookingText: {
    color: '#000',
  },
  noBookingsText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    marginTop: 20,
  },
});
