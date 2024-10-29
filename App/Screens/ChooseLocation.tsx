/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import SearchBar from '../Components/SearchBar';
import CustomButton from '../Components/CustomButton';
import {getAllFcmTokens} from '../../hooks/notificationService';
import {getGeocode} from '../../hooks/getLocationName';
import {ChooseLocationSaveCords} from '../../hooks/RouteFunctions';
import {useCurrentUser} from '../../hooks/currentUser';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Detect tablet screen

export default function ChooseLocation(props: any) {
  const navigation = useNavigation();
  const [state, setState] = useState<any>({
    pickUpCords: {},
    DestinationCords: {},
  });
  const user: any = useCurrentUser();
  const {pickUpCords, DestinationCords} = state;

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

        await ChooseLocationSaveCords(
          pickUpCords,
          DestinationCords,
          user?.user?.userId,
        );

        props.route.params.getCordinates(updatedState);
        navigation.goBack();

        await getAllFcmTokens(pickUpAddress, dropAddress);
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
        isTablet && styles.containerTablet, // Adjust container style for tablets
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
    padding: 30, // Adjust padding for tablet screens
    paddingTop: 40, // Extra padding at the top for tablets
  },
  searchBarContainer: {
    marginBottom: 30,
  },
  searchBar: {
    // Add custom styles for the search bar if needed
  },
  button: {
    width: '100%',
  },
  buttonTablet: {
    width: '80%', // Make the button smaller on tablet screens
    alignSelf: 'center', // Center the button on tablets
  },
});
