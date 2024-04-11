/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* First BOx */}
        <View
          style={{
            backgroundColor: '#B4B4B4',
            height: 148,
            // width: 320,
            width: '100%',
            borderRadius: 10,
            padding: 15,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
            }}>
            Whippy Bois is On Your Route Today!!!
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: '#000',
            }}>
            Do you want something?
          </Text>

          {/* Button */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={{
                height: 41,
                backgroundColor: '#70C552',
                borderRadius: 10,
                width: '45%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 41,
                backgroundColor: '#DD4B4B',
                borderRadius: 10,
                width: '45%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Second Box */}
        <View
          style={{
            backgroundColor: '#B4B4B4',
            height: 60,
            // width: 320,
            width: '100%',
            marginTop: 10,
            borderRadius: 10,
            padding: 15,
            alignItems: 'center',
            flexDirection: 'row',
            marginHorizontal: 'auto',
          }}>
          <Icon name="notifications" size={30} color="black" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginLeft: 10,
              color: '#000',
            }}>
            Driver Is On Your Location!!!
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
    alignItems: 'center',
    // justifyContent: "center",
    flex: 1,
    // width: '100%',
  },
  content: {
    flex: 1,
    marginTop: 15,
    width: '95%',
    alignItems: 'center',
  },
});
