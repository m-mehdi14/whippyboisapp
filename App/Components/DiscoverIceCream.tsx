/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const DiscoverIceCream = ({data}: any) => {
  const image = data.filter((item: any) => item.titleValue === 'Product Six');
  // console.log(image);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.Heading}>Discover Icecream</Text>
      </View>

      {/* Image */}
      <View>
        <Image
          // source={require("../../assets/driverImage3.png")}
          source={{uri: image[0]?.imageValue}}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 10,
            //   add shadow
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        />
        <View style={styles.borderBottom}></View>
      </View>
    </View>
  );
};

export default DiscoverIceCream;

const styles = StyleSheet.create({
  container: {
    margin: 22,
  },
  Heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  borderBottom: {
    borderBottomWidth: 1,
    marginTop: 25,
  },
});
