/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const RecommendedProducts = ({data}: any) => {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <View>
        <Text style={styles.Heading}>We Recommend</Text>
        <View style={styles.borderBottom}></View>
      </View>

      {/* Image Slider */}
      <FlatList
        data={data}
        horizontal={true}
        renderItem={({item, index}) => (
          <View>
            <Image
              source={{uri: item?.imageValue}}
              style={{
                width: 183,
                height: 247,
                marginHorizontal: 15,
                margin: 13,
                marginLeft: 3,
                borderRadius: 10,
                backgroundColor: '#EBEBEB',
              }}
              key={index}
            />
          </View>
        )}
      />
    </View>
  );
};

export default RecommendedProducts;

const styles = StyleSheet.create({
  container: {
    margin: 22,
  },
  Heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  borderBottom: {
    borderBottomWidth: 1,
    marginTop: 15,
  },
});
