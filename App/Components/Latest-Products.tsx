/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useCurrentUser} from '../../hooks/currentUser';
import Icon from 'react-native-vector-icons/Ionicons';
import {deleteProduct} from '../../hooks/getProducts';

const LatestProducts = ({data}: any) => {
  const user: any = useCurrentUser();
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
            {item?.userEmail === user?.user?.email && (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'red',
                    padding: 5,
                    borderRadius: 5,
                    position: 'absolute',
                    top: 3,
                    right: 14,
                    padding: 3,
                  }}
                  onPress={() => deleteProduct(item.id)}>
                  <Icon name="close" size={17} color={'white'} />
                </TouchableOpacity>
              </>
            )}
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
    position: 'relative',
  },
  image: {
    width: 150,
    height: 180,
    borderRadius: 10,
  },
});
