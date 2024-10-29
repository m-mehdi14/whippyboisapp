/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import React, {useState} from 'react';
import SearchBar from '../Components/SearchBar';
import CustomButton from '../Components/CustomButton';
import {ChangeRouteNotify} from '../../hooks/notificationService';
import {saveCoordinatesToFirebase} from '../../hooks/RouteFunctions';
import {getGeocode} from '../../hooks/getLocationName';
import {useNavigation} from '@react-navigation/native';
import {useCurrentUser} from '../../hooks/currentUser';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Detect tablet screens

export default function ChangeRouteScreen(props: any) {
  const navigation = useNavigation();
  const [state, setState] = useState<any>({
    pickUpCords: {},
    DestinationCords: {},
  });
  const {pickUpCords, DestinationCords} = state;
  const user = useCurrentUser();

  // Fetch PickUp cords
  const fetchAddressCords = async (lat: any, lng: any) => {
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
    if (
      pickUpCords.latitude &&
      pickUpCords.longitude &&
      DestinationCords.latitude &&
      DestinationCords.longitude
    ) {
      try {
        const pickUpAddress = await getGeocode(
          pickUpCords.latitude,
          pickUpCords.longitude,
        );
        const dropAddress = await getGeocode(
          DestinationCords.latitude,
          DestinationCords.longitude,
        );

        const updatedState = {
          pickUpCords: {...pickUpCords, pickUpAddress},
          DestinationCords: {...DestinationCords, dropAddress},
        };
        setState(updatedState);

        await saveCoordinatesToFirebase(
          pickUpCords,
          DestinationCords,
          user?.user?.userId,
        );

        props.route.params.getCordinates(updatedState);
        navigation.goBack();

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
      style={[
        styles.container,
        isTablet && styles.containerTablet, // Apply tablet-specific styles
      ]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="Enter your pickup location ?"
            style={styles.searchBar}
            fetchAddress={fetchAddressCords}
          />
        </View>
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="Enter your drop location ?"
            style={styles.searchBar}
            fetchAddress={fetchDropLocationCords}
          />
        </View>

        <CustomButton
          text="Search"
          style={[styles.button, isTablet && styles.buttonTablet]} // Adjust button style for tablets
          onPress={onSearchPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 30,
  },
  containerTablet: {
    padding: 30, // Increase padding for tablet screens
  },
  searchBarContainer: {
    marginBottom: 30,
  },
  searchBar: {
    // Add custom search bar styles if needed
  },
  button: {
    width: '100%',
  },
  buttonTablet: {
    width: '80%', // Make button smaller on tablets
    alignSelf: 'center', // Center button on tablets
  },
});
