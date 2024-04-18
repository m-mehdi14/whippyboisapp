/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const LatestProducts = ({data}: any) => {
  let num = 2;
  return (
    <View style={styles.container}>
      <FlatList
        key={num}
        data={data}
        numColumns={num}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Image source={{uri: item?.imageValue}} style={styles.image} />
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: 'black',
                marginTop: 4,
              }}>
              {item?.titleValue}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default LatestProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 110,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 15,
  },
  image: {
    width: 150,
    height: 180,
    borderRadius: 10,
  },
});
