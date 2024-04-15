/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import SearchBar from '../Components/SearchBar';
import CustomButton from '../Components/CustomButton';
import {StyleSheet} from 'react-native';
import {ChangeRouteNotify} from '../../hooks/notificationService';
import {saveCoordinatesToFirebase} from '../../hooks/RouteFunctions';
import {getGeocode} from '../../hooks/getLocationName';
import {useNavigation} from '@react-navigation/native';

export default function ChangeRouteScreen(props: any) {
  const navigation = useNavigation();
  const [state, setState] = useState<any>({
    pickUpCords: {},
    DestinationCords: {},
  });
  const {pickUpCords, DestinationCords} = state;
  // console.log('PickUp Location ---> ', pickUpCords);
  // console.log('Drop Location ----> ', DestinationCords);
  // const onDone = () => {
  //   props.route.params.getCordinates({
  //     pickUpCords,
  //     DestinationCords,
  //   });
  //   navigation.goBack();
  // };

  // Fetch PickUp cords
  const fetchAddressCords = async (lat: any, lng: any) => {
    // console.log("Pick Up lat --->", lat);
    // console.log("Pick Up Lng ---> ", lng);
    const addressName = await getGeocode(lat, lng);
    setState({
      ...state,
      pickUpCords: {
        latitude: lat,
        longitude: lng,
        pickUpAddress: addressName,
      },
    });
  };

  // Fetch drop location cords

  const fetchDropLocationCords = async (lat: any, lng: any) => {
    // console.log("Drop lat --->", lat);
    // console.log("Drop lng ---> ", lng);
    const addressName = await getGeocode(lat, lng);
    setState({
      ...state,
      DestinationCords: {
        latitude: lat,
        longitude: lng,
        dropAddress: addressName,
      },
    });
  };

  const onSearchPress = async () => {
    // Check if we have both pickup and dropoff coordinates
    if (
      pickUpCords.latitude &&
      pickUpCords.longitude &&
      DestinationCords.latitude &&
      DestinationCords.longitude
    ) {
      try {
        // Fetch the address names
        const pickUpAddress = await getGeocode(
          pickUpCords.latitude,
          pickUpCords.longitude,
        );
        const dropAddress = await getGeocode(
          DestinationCords.latitude,
          DestinationCords.longitude,
        );

        // Update the state with the new addresses
        const updatedState = {
          pickUpCords: {...pickUpCords, pickUpAddress},
          DestinationCords: {...DestinationCords, dropAddress},
        };
        setState(updatedState);

        // Save the coordinates to Firebase
        await saveCoordinatesToFirebase(pickUpCords, DestinationCords);

        // After notification is sent successfully, pass the coordinates back
        props.route.params.getCordinates(updatedState);
        // Navigate back to the previous screen
        navigation.goBack();
        // Now send the notification with the addresses
        await ChangeRouteNotify(pickUpAddress, dropAddress);
        console.log('Notification sent with pick up and drop off addresses.');
      } catch (error) {
        console.error('Error during the search process:', error);
      }
    } else {
      console.log(
        'Cannot proceed without both pickup and dropoff coordinates.',
      );
    }
  };

  return (
    <View
      style={{
        padding: 15,
        flex: 1,
        width: '100%',
        // marginTop: 20,
        backgroundColor: '#ffffff',
        paddingTop: 30,
      }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            marginBottom: 30,
          }}>
          {/* <AddressPicker /> */}
          <SearchBar
            placeholder="Enter your pickup location ?"
            style={{}}
            fetchAddress={fetchAddressCords}
          />
        </View>
        {/* Drop Location */}
        <View
          style={{
            marginBottom: 30,
          }}>
          <SearchBar
            placeholder="Enter your drop location ?"
            style={{}}
            fetchAddress={fetchDropLocationCords}
          />
        </View>

        {/* <CustomButton text="Search" style={styles.button} onPress={onDone} /> */}
        <CustomButton
          text="Search"
          style={styles.button}
          onPress={onSearchPress}
        />

        {/* <CustomButton
          text="Send Notification"
          style={styles.button}
          onPress={() =>
            getAllFcmTokens(pickUpCords.pickUpAddress, DestinationCords)
          }
        /> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
    backgroundColor: '#ECECEC',
    width: '90%', // Adjust the width as needed
  },
  button: {
    width: '100%', // Adjust the width as needed
  },
});
