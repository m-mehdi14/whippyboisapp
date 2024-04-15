/* eslint-disable prettier/prettier */
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

interface SearchBarProps {
  placeholder: string;
  style: any;
  fetchAddress: (lat: any, lng: any) => void;
}

const SearchBar = ({placeholder, style, fetchAddress}: SearchBarProps) => {
  const apiKey = 'AIzaSyBuzqzsIcuhUYAovZzlaj8ANGsKNk6ZTgE';

  const onPressAddress = (data: any, details: any) => {
    console.log('Detaiks --> ', details);
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    fetchAddress(lat, lng);
  };
  return (
    <View style={style}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails={true}
        enablePoweredByContainer={false}
        // onPress={(data, details = null) => {
        //   // 'details' is provided when fetchDetails = true
        //   console.log(data, details);
        // }}
        onPress={onPressAddress}
        query={{
          key: `${apiKey}`,
          language: 'en',
        }}
        styles={{
          textInputContainer: styles.containerStyle,
          textInput: styles.textInput,
        }}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 30,
  },
  textInput: {
    // backgroundColor: '#747474',
    backgroundColor: 'white',
    color: '#000',
    fontSize: 17,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
  },
});
