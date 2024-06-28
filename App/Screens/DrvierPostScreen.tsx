/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {View, Text, SafeAreaView, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {getBookingsDetails} from '../../hooks/getBookingsDetails';

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

  const renderItem = ({item}: any) => (
    <View style={styles.bookingContainer}>
      <Text style={styles.bookingHeading}>Booking</Text>
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingDetailText}>Name: {item.name}</Text>
        <Text style={styles.bookingDetailText}>
          Date: {item.booking.date.toDate().toDateString()}
        </Text>
        <Text style={styles.bookingDetailText}>
          Time: {item.booking.date.toDate().toLocaleTimeString()}
        </Text>
        <Text style={styles.bookingDetailText}>
          Number: {item.booking.number}
        </Text>
        <Text style={styles.bookingDetailText}>
          Address: {item.booking.address}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={styles.headingText}>Whippy Bois</Text>
          <Text style={styles.subHeading}>Bookings</Text>
        </View>
        {booking?.length === 0 ? (
          <Text style={styles.noBookingText}>No booking available</Text>
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
  subHeading: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    color: '#000',
    alignItems: 'center',
  },
  bookingContainer: {
    backgroundColor: '#FFC300',
    borderRadius: 15,
    marginVertical: 15,
    padding: 15,
    width: '100%',
    marginHorizontal: 10,
  },
  bookingHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  bookingDetails: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
  },
  bookingDetailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
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
});
