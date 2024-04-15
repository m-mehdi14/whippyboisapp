/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import {getDriverRouteData} from '../../hooks/RouteFunctions';
import Geolocation from '@react-native-community/geolocation';
import {RideAccept, getAllRouteAcceptRequests} from '../../hooks/RideAccept';
import {useCurrentUser} from '../../hooks/currentUser';
import {Alert} from 'react-native';

export default function NotificationScreen() {
  const [pickUpAddress, setpickUpAddress] = useState('');
  const [userLocation, setUserLocation] = useState<any>(null);
  console.log('🚀 ~ NotificationScreen ~ userLocation:', userLocation);
  const [location, setLocation] = useState<any>(null);
  console.log('🚀 ~ NotificationScreen ~ location:', location);
  console.log('🚀 ~ NotificationScreen ~ pickUpAddress:', pickUpAddress);
  const [dropAddress, setdropAddress] = useState('');
  console.log('🚀 ~ NotificationScreen ~ dropAddress:', dropAddress);
  const user: any = useCurrentUser();
  console.log('User ----> ', user);

  useEffect(() => {
    const fetchDriverRouteData = async () => {
      try {
        const token = await messaging().getToken();
        var routes = await getDriverRouteData(token);
        if (routes.length > 0) {
          // Assuming the latest route is the one we want
          const latestRoute = routes[routes.length - 1];
          setpickUpAddress(latestRoute?.pickUpCords?.pickUpAddress);
          setdropAddress(latestRoute?.DestinationCords?.dropAddress);
        }
        const data = await getAllRouteAcceptRequests();
        console.log('Data --- > ', data);
      } catch (error) {
        console.error('Error fetching driver route data:', error);
      }
    };

    fetchDriverRouteData();
  }, []);

  useEffect(() => {
    // notificationButton();
    requestLocationPermission(); // Request location permissions
  }, []);

  /**
   * Request Location Permission
   */
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getUserLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getUserLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  /**
   * Get User Location
   */
  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('🚀 ~ getUserLocation ~ position:', position);
        console.log(position?.coords);
        setUserLocation(position?.coords);
        setLocation(position); // Update location state
        // setCords(prevCords => ({
        //   ...prevCords,
        //   pickupCords: {
        //     latitude: position?.coords?.latitude,
        //     longitude: position?.coords?.longitude,
        //   },
        // }));
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleYesPress = async () => {
    try {
      const token = await messaging().getToken();

      // Call the RideAccept function
      if (user?.user?.name && token && userLocation) {
        await RideAccept(user?.user?.name, token, userLocation).then(() => {
          Alert.alert('Driver is on his way!');
        });
      }
    } catch (error) {
      console.error('Error on ride acceptance: ', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Unified Notification Box */}
        <View style={styles.notificationBox}>
          {pickUpAddress && dropAddress && (
            <>
              <View style={styles.addressCard}>
                <Icon name="location-sharp" size={24} color="#1565C0" />
                <Text style={styles.addressText}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                    }}>
                    Pickup :
                  </Text>{' '}
                  {pickUpAddress}
                </Text>
              </View>
              <View style={styles.addressCard}>
                <Icon name="location-sharp" size={24} color="#C62828" />
                <Text style={styles.addressText}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                    }}>
                    Drop :{' '}
                  </Text>
                  {dropAddress}
                </Text>
              </View>
            </>
          )}

          <View
            style={{
              backgroundColor: '#B4B4B4',
              padding: 15,
              width: '100%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text style={styles.notificationText}>
              Whippy Bois is On Your Route Today!!!
            </Text>
            <Text style={styles.notificationSubText}>
              Do you want something?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleYesPress}
                style={styles.buttonYes}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.buttonNo}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        {/* Second Box */}
        <View
          style={{
            backgroundColor: '#B4B4B4',
            height: 60,
            // width: 320,
            width: '100%',
            marginTop: 10,
            borderRadius: 10,
            padding: 15,
            alignItems: 'center',
            flexDirection: 'row',
            marginHorizontal: 'auto',
          }}>
          <Icon name="notifications" size={30} color="black" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginLeft: 10,
              color: '#000',
            }}>
            Driver Is On Your Location!!!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 15,
    width: '95%',
    alignItems: 'center',
  },
  notificationBox: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 10,
    padding: 0,
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 13,
  },
  addressText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#424242',
    marginRight: 30,
  },
  notificationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationSubText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonYes: {
    height: 41,
    backgroundColor: '#70C552',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
  buttonNo: {
    height: 41,
    backgroundColor: '#DD4B4B',
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
