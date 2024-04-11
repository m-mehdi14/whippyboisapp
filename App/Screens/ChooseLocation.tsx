/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import SearchBar from '../Components/SearchBar';
import CustomButton from '../Components/CustomButton';

export default function ChooseLocation(props: any) {
  const navigation = useNavigation();
  const [state, setState] = useState({
    pickUpCords: {},
    DestinationCords: {},
  });
  const {pickUpCords, DestinationCords} = state;
  const onDone = () => {
    props.route.params.getCordinates({
      pickUpCords,
      DestinationCords,
    });
    navigation.goBack();
  };

  // Fetch PickUp cords
  const fetchAddressCords = (lat: any, lng: any) => {
    // console.log("Pick Up lat --->", lat);
    // console.log("Pick Up Lng ---> ", lng);
    setState({
      ...state,
      pickUpCords: {
        latitude: lat,
        longitude: lng,
      },
    });
  };

  // Fetch drop location cords

  const fetchDropLocationCords = (lat: any, lng: any) => {
    // console.log("Drop lat --->", lat);
    // console.log("Drop lng ---> ", lng);
    setState({
      ...state,
      DestinationCords: {
        latitude: lat,
        longitude: lng,
      },
    });
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

        <CustomButton text="Search" style={styles.button} onPress={onDone} />
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
