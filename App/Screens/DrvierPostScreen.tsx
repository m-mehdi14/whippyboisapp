/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {
  getBookingsDetails,
  updateBookingStatus,
} from '../../hooks/getBookingsDetails';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Detect tablet screen

export default function DriverPostScreen() {
  const insets = useSafeAreaInsets();
  const [booking, setBooking] = useState([]);
  console.log('Booking Details Fetched ---> ', booking);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBookingsDetails();
      setBooking(res);
    };

    fetchData();
  }, []);

  const handleBookingPress = async (bookingId: any) => {
    try {
      // Define a meaningful status message
      const statusMessage =
        'Your booking is being processed. A driver will contact you shortly';

      await updateBookingStatus(bookingId, statusMessage);
      Alert.alert(
        'Status Updated',
        'Customer will be notified that a driver will contact them shortly.',
      );
      // Refresh the booking list after updating the status
      const res = await getBookingsDetails();
      setBooking(res);
    } catch (error) {
      console.error('Error updating booking status:', error);
      Alert.alert('Error', 'Failed to update booking status.');
    }
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity onPress={() => handleBookingPress(item.id)}>
      <View
        style={[
          styles.bookingContainer,
          isTablet && styles.bookingContainerTablet,
        ]}>
        <Text
          style={[
            styles.bookingHeading,
            isTablet && styles.bookingHeadingTablet,
          ]}>
          Booking
        </Text>
        <View
          style={[
            styles.bookingDetails,
            isTablet && styles.bookingDetailsTablet,
          ]}>
          <Text
            style={[
              styles.bookingDetailText,
              isTablet && styles.bookingDetailTextTablet,
            ]}>
            Name: {item.name}
          </Text>
          <Text
            style={[
              styles.bookingDetailText,
              isTablet && styles.bookingDetailTextTablet,
            ]}>
            Date: {item.booking.date.toDate().toDateString()}
          </Text>
          <Text
            style={[
              styles.bookingDetailText,
              isTablet && styles.bookingDetailTextTablet,
            ]}>
            Time: {item.booking.date.toDate().toLocaleTimeString()}
          </Text>
          <Text
            style={[
              styles.bookingDetailText,
              isTablet && styles.bookingDetailTextTablet,
            ]}>
            Number: {item.booking.number}
          </Text>
          <Text
            style={[
              styles.bookingDetailText,
              isTablet && styles.bookingDetailTextTablet,
            ]}>
            Address: {item.booking.address}
          </Text>
          <Text
            style={[
              styles.bookingDetailText,
              isTablet && styles.bookingDetailTextTablet,
            ]}>
            Status: {item.booking.status || 'Pending'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text
            style={[styles.headingText, isTablet && styles.headingTextTablet]}>
            Whippy Bois
          </Text>
          <Text
            style={[styles.subHeading, isTablet && styles.subHeadingTablet]}>
            Bookings
          </Text>
        </View>
        {booking?.length === 0 ? (
          <Text
            style={[
              styles.noBookingText,
              isTablet && styles.noBookingTextTablet,
            ]}>
            No booking available
          </Text>
        ) : (
          <FlatList
            data={booking}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    marginTop: 35,
    width: '100%',
  },
  headingText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    alignItems: 'center',
  },
  headingTextTablet: {
    fontSize: 40, // Larger font size for tablet
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    color: '#000',
    alignItems: 'center',
  },
  subHeadingTablet: {
    fontSize: 24, // Larger font size for tablet
  },
  bookingContainer: {
    backgroundColor: '#FFC300',
    borderRadius: 15,
    marginVertical: 15,
    padding: 15,
    width: '100%',
    marginHorizontal: 10,
  },
  bookingContainerTablet: {
    padding: 25, // Larger padding for tablet
  },
  bookingHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  bookingHeadingTablet: {
    fontSize: 26, // Larger font size for tablet
  },
  bookingDetails: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
  },
  bookingDetailsTablet: {
    padding: 20, // Larger padding for tablet
  },
  bookingDetailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  bookingDetailTextTablet: {
    fontSize: 22, // Larger font size for tablet
  },
  flatListContent: {
    paddingHorizontal: 20,
    width: '100%',
    paddingBottom: 150,
  },
  noBookingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  noBookingTextTablet: {
    fontSize: 24, // Larger font size for tablet
  },
});
