/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';

export default function DrvierPostScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.content}>
        <Text style={styles.headingText}>Whippy Bois</Text>
        <Text style={styles.subHeading}>Bookings</Text>
        {/* Driver booking screen */}
        <View
          style={{
            // backgroundColor: '#F2C7C7',
            // backgroundColor: '#FF2D00',
            // backgroundColor: 'rgba(255, 45, 0, 0.66)', // 50% opacity
            backgroundColor: '#FFC300',
            height: 343,
            width: 344,
            borderRadius: 15,
            marginTop: 19,
            alignItems: 'flex-start',
            padding: 25,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: '#000',
            }}>
            Booking#1
          </Text>
          {/* Name */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              marginTop: 25,
              color: '#000',
            }}>
            John Alison
          </Text>
          {/* Date and Time */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 25,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '400',
                color: '#000',
              }}>
              Date
            </Text>
            <Text
              style={{
                marginLeft: 110,
                fontSize: 18,
                fontWeight: '400',
                color: '#000',
                marginTop: 0,
              }}>
              Time
            </Text>
          </View>

          {/* Number */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: '#000',
              marginTop: 25,
            }}>
            Number :
          </Text>
          {/* Address */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: '#000',
              marginTop: 25,
            }}>
            Address :
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
});
