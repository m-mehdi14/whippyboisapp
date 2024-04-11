/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useCurrentUser} from '../../hooks/currentUser';
import {getProducts} from '../../hooks/getProducts';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native';
import {TextInput} from 'react-native';
import RecommendedProducts from '../Components/Recommended-Product';
import DiscoverIceCream from '../Components/DiscoverIceCream';
import LatestProducts from '../Components/Latest-Products';

export default function HomeScreen({navigation}: any) {
  const [role, setrole] = useState('');
  const currentUser: any = useCurrentUser();
  const [data, setdata] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.user) {
      setrole(currentUser.user.role);
    }
    notificationButton();
  }, [currentUser]);

  useEffect(() => {
    fetchData();

    // Clean up function
    return () => {
      // Any cleanup code can go here
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await getProducts();
      setdata(res);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  console.log('🚀 ~ HomeScreen ~ role:', role);

  const headerRightButtons = () => (
    <View style={{flexDirection: 'row'}}>
      {currentUser.user?.role === 'driver' && (
        <TouchableOpacity onPress={() => navigation.navigate('addproduct')}>
          <Icon
            name="clipboard"
            size={24}
            color={'black'}
            style={{marginRight: 15}}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('notification')}>
        <Icon
          name="notifications"
          size={24}
          color="black"
          style={{marginRight: 15}}
        />
      </TouchableOpacity>
    </View>
  );

  const notificationButton = () => {
    navigation.setOptions({
      headerRight: headerRightButtons,
    });
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView>
        {/* Heading */}
        <View
          style={{
            padding: 20,
          }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Ice Cream Lover?
          </Text>
          <Text
            style={{
              fontSize: 30,
              color: 'black',
            }}>
            Order & Eat.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchbar}>
          <TextInput
            placeholder="Search Your Icecream"
            style={{color: 'black', fontSize: 16}}
          />
          <Icon
            style={{
              position: 'absolute',
              right: 10,
              top: 20,
              color: 'black',
            }}
            name="search"
            size={25}
            color="black"
          />
        </View>

        {/* Recommended Products */}
        <RecommendedProducts data={data} />

        {/* Discover IceCream */}
        <DiscoverIceCream data={data} />

        {/* Latest Product */}
        <LatestProducts data={data} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  searchbar: {
    borderWidth: 1,
    margin: 23,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
    // backgroundColor: '#EBEBEB',
    backgroundColor: 'white',
    width: '65%',
    color: '#000',
  },
});