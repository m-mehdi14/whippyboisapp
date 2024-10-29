/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
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

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Define logic to detect if the device is a tablet

export default function HomeScreen({navigation}: any) {
  const [role, setrole] = useState('');
  const currentUser: any = useCurrentUser();
  const [data, setdata] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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

  useEffect(() => {
    const filteredProducts = data.filter((product: any) => {
      return product.titleValue.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredData(filteredProducts);
  }, [search, data]);

  const fetchData = async () => {
    try {
      const res = await getProducts();
      setdata(res);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const headerRightButtons = () => (
    <View style={{flexDirection: 'row'}}>
      {currentUser.user?.role === 'driver' && (
        <TouchableOpacity onPress={() => navigation.navigate('addproduct')}>
          <Icon
            name="clipboard"
            size={isTablet ? 32 : 24} // Increase icon size for tablet
            color={'black'}
            style={{marginRight: 15}}
          />
        </TouchableOpacity>
      )}
      {currentUser?.user?.role === 'customer' && (
        <TouchableOpacity onPress={() => navigation.navigate('notification')}>
          <Icon
            name="notifications"
            size={isTablet ? 32 : 24} // Increase icon size for tablet
            color="black"
            style={{marginRight: 15}}
          />
        </TouchableOpacity>
      )}
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
          style={[
            styles.headerContainer,
            isTablet && styles.headerContainerTablet,
          ]}>
          <Text
            style={[styles.headerText, isTablet && styles.headerTextTablet]}>
            Ice Cream Lover?
          </Text>
          <Text
            style={[
              styles.subHeaderText,
              isTablet && styles.subHeaderTextTablet,
            ]}>
            Order & Eat.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchbar, isTablet && styles.searchbarTablet]}>
          <TextInput
            placeholder="Search Your Icecream"
            style={[styles.searchInput, isTablet && styles.searchInputTablet]}
            placeholderTextColor={'#000'}
            onChangeText={setSearch}
            value={search}
          />
          <Icon
            style={styles.searchIcon}
            name="search"
            size={isTablet ? 30 : 25} // Larger search icon for tablets
            color="black"
          />
        </View>

        {/* Recommended Products */}
        <RecommendedProducts data={data} />

        {/* Discover IceCream */}
        <DiscoverIceCream data={data} />

        {/* Latest Product */}
        <LatestProducts data={filteredData.length > 0 ? filteredData : data} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  headerContainer: {
    padding: 20,
  },
  headerContainerTablet: {
    padding: 40, // Increase padding for tablet
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  headerTextTablet: {
    fontSize: 40, // Increase font size for tablets
  },
  subHeaderText: {
    fontSize: 30,
    color: 'black',
  },
  subHeaderTextTablet: {
    fontSize: 40, // Increase font size for tablets
  },
  searchbar: {
    borderWidth: 1,
    margin: 23,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#EBEBEB',
    width: '65%',
    color: '#000',
  },
  searchbarTablet: {
    width: '50%', // Adjust width for tablets
    padding: 15,
  },
  searchInput: {
    color: 'black',
    fontSize: 16,
  },
  searchInputTablet: {
    fontSize: 20, // Larger text input for tablets
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 20,
    color: 'black',
  },
});
