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
    // console.log('Detaiks --> ', details);
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
        // styles={{
        //   textInputContainer: styles.containerStyle,
        //   textInput: styles.textInput,
        // }}
        styles={{
          textInputContainer: styles.containerStyle,
          textInput: styles.textInput,
          // placeholderText: styles.placeholderText, // Ensure placeholder text is clearly visible
          listView: styles.listView, // Style for the list of suggestions
          description: {color: 'black'},
        }}
      />
    </View>
  );
};

export default SearchBar;

// const styles = StyleSheet.create({
//   containerStyle: {
//     borderRadius: 30,
//   },
//   textInput: {
//     backgroundColor: '#E4E4E4',
//     // backgroundColor: 'white',
//     color: '#000',
//     fontSize: 17,
//     shadowColor: 'black',
//     shadowOffset: {width: 0, height: 2},
//     height: 60,
//   },
// });

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 30,
  },
  textInput: {
    backgroundColor: '#E4E4E4',
    color: '#000000', // Make sure text is black
    fontSize: 17,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    height: 60,
  },
  placeholderText: {
    color: '#000000', // Set placeholder text color to black if needed
  },
  listView: {
    backgroundColor: '#FECC1D', // Background of the list can be white for better contrast
    color: '#0000', // Text color for the list items
  },
  poweredContainer: {
    display: 'none', // Hide powered by container if not required
  },
});
