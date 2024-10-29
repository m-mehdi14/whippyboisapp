/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import {getNotification} from '../../hooks/RouteFunctions';
import Geolocation from '@react-native-community/geolocation';
import {RideAccept, getAllRouteAcceptRequests} from '../../hooks/RideAccept';
import {useCurrentUser} from '../../hooks/currentUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore, doc, getDoc, updateDoc, setDoc} from 'firebase/firestore';
import {app} from '../../hooks/firebaseConfig';

const {width, height} = Dimensions.get('window');
const isTablet = width >= 768; // Check if the device is a tablet

export default function NotificationScreen() {
  const [pickUpAddress, setpickUpAddress] = useState('');
  const [userLocation, setUserLocation] = useState<any>(null);
  const [routes, setRoutes] = useState([]); // State to store routes
  const [dropAddress, setdropAddress] = useState('');
  const [pressCount, setPressCount] = useState(0); // State to track button presses
  const [showPopup, setShowPopup] = useState(false);
  const [clickCounts, setClickCounts] = useState(0);
  const [customCode, setCustomCode] = useState('');
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]); // State to track disabled buttons
  const [notifications, setNotifications] = useState<any[]>([]); // State to store notifications with timestamps

  const user: any = useCurrentUser();

  useEffect(() => {
    fetchDriverRouteData();
    requestLocationPermission();
    fetchCustomCode();
    loadDisabledButtons();
  }, []);

  const loadDisabledButtons = async () => {
    try {
      const disabledButtonsString = await AsyncStorage.getItem(
        'disabledButtons',
      );
      if (disabledButtonsString) {
        setDisabledButtons(JSON.parse(disabledButtonsString));
      }
    } catch (error) {
      console.error('Failed to load disabled buttons from storage:', error);
    }
  };

  const saveDisabledButtons = async (buttons: string[]) => {
    try {
      await AsyncStorage.setItem('disabledButtons', JSON.stringify(buttons));
    } catch (error) {
      console.error('Failed to save disabled buttons to storage:', error);
    }
  };

  const fetchDriverRouteData = async () => {
    try {
      const token = await messaging().getToken();
      const routes = await getNotification();
      if (routes.length > 0) {
        const timestampedRoutes = routes.map((route: any) => ({
          ...route,
          createdAt: route.createdAt ? route.createdAt.toMillis() : null, // Convert Firestore Timestamp to milliseconds
        }));
        setRoutes(timestampedRoutes);
        setNotifications(timestampedRoutes);
        const latestRoute = routes[routes.length - 1];
        setpickUpAddress(latestRoute?.pickUpCords?.pickUpAddress);
        setdropAddress(latestRoute?.DestinationCords?.dropAddress);
      }
      await getAllRouteAcceptRequests();
    } catch (error) {
      console.error('Error fetching driver route data:', error);
    }
  };

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

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation(position?.coords);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchCustomCode = async () => {
    const db = getFirestore(app);
    const userId = user?.user?.email;
    const userDoc = doc(db, 'userClicks', userId);

    try {
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists() && docSnap.data().customCode) {
        const customCode = docSnap.data().customCode;
        setCustomCode(customCode);
      } else {
        console.log('No custom code available.');
      }
    } catch (error) {
      console.error('Failed to fetch custom code:', error);
    }
  };

  const handleYesPress = async (routeId: string) => {
    if (disabledButtons.includes(routeId)) {
      return;
    }

    try {
      const db = getFirestore(app);
      const token = await messaging().getToken();
      const userId = user?.user?.email;
      const userDoc = doc(db, 'userClicks', userId);

      if (user?.user?.name && token && userLocation) {
        await RideAccept(user?.user?.name, token, userLocation).then(() => {
          Alert.alert('Driver is on his way!');
          setDisabledButtons([...disabledButtons, routeId]);
          saveDisabledButtons([...disabledButtons, routeId]);
        });

        try {
          const docSnap = await getDoc(userDoc);
          let count = docSnap.exists() ? docSnap.data().clickCount + 1 : 1;

          if (docSnap.exists()) {
            const data = docSnap.data();
            count = data.clickCount + 1;
            if (count < 11) {
              await updateDoc(userDoc, {clickCount: count});
            } else if (count === 11) {
              const customCode = generateCustomCode();
              await updateDoc(userDoc, {clickCount: 1, customCode: customCode});
              setCustomCode(customCode);
              count = 1;
            }
          } else {
            count = 1;
            await setDoc(userDoc, {clickCount: count});
          }

          setClickCounts(count);
          setShowPopup(true);
        } catch (error) {
          console.error('Error on updating click count: ', error);
        }
      }
    } catch (error) {
      console.error('Error on ride acceptance: ', error);
    }
  };

  const generateCustomCode = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const filterNotifications = (notifications: any[]) => {
    const now = new Date().getTime();
    const twelveHours = 12 * 60 * 60 * 1000;
    return notifications.filter(notification => {
      if (notification.createdAt) {
        return now - notification.createdAt <= twelveHours;
      }
      return false;
    });
  };

  const renderItem = ({item}: any) => (
    <View
      style={[
        styles.notificationBox,
        isTablet && styles.notificationBoxTablet,
      ]}>
      {item.pickUpCords?.pickUpAddress &&
        item.DestinationCords?.dropAddress && (
          <>
            <View
              style={[
                styles.addressCard,
                isTablet && styles.addressCardTablet,
              ]}>
              <Icon name="location-sharp" size={24} color="#1565C0" />
              <Text
                style={[
                  styles.addressText,
                  isTablet && styles.addressTextTablet,
                ]}>
                <Text style={{fontWeight: 'bold'}}>Pickup :</Text>{' '}
                {item.pickUpCords.pickUpAddress}
              </Text>
            </View>
            <View
              style={[
                styles.addressCard,
                isTablet && styles.addressCardTablet,
              ]}>
              <Icon name="location-sharp" size={24} color="#C62828" />
              <Text
                style={[
                  styles.addressText,
                  isTablet && styles.addressTextTablet,
                ]}>
                <Text style={{fontWeight: 'bold'}}>Drop :</Text>{' '}
                {item.DestinationCords.dropAddress}
              </Text>
            </View>
          </>
        )}

      <View
        style={[
          styles.notificationContent,
          isTablet && styles.notificationContentTablet,
        ]}>
        <Text
          style={[
            styles.notificationText,
            isTablet && styles.notificationTextTablet,
          ]}>
          Whippy Bois is On Your Route Today!!!
        </Text>
        <Text
          style={[
            styles.notificationSubText,
            isTablet && styles.notificationSubTextTablet,
          ]}>
          Do you want something?
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleYesPress(item.driverId)}
            style={[
              styles.buttonYes,
              disabledButtons.includes(item.driverId) && styles.buttonDisabled,
            ]}
            disabled={disabledButtons.includes(item.driverId)}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={filterNotifications(notifications)}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    width: '100%',
  },
  content: {
    flex: 1,
    marginTop: 15,
    width: '90%',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  notificationBox: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 10,
    padding: 0,
    marginBottom: 10,
    marginLeft: 3,
  },
  notificationBoxTablet: {
    padding: 20, // Increased padding for tablets
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 13,
  },
  addressCardTablet: {
    padding: 20, // Increased padding for tablets
  },
  addressText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#424242',
    marginRight: 30,
  },
  addressTextTablet: {
    fontSize: 20, // Larger font for tablets
  },
  notificationContent: {
    backgroundColor: '#B4B4B4',
    padding: 15,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  notificationContentTablet: {
    padding: 25, // Increased padding for tablets
  },
  notificationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationTextTablet: {
    fontSize: 22, // Larger font for tablets
  },
  notificationSubText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
  },
  notificationSubTextTablet: {
    fontSize: 19, // Larger font for tablets
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
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  list: {
    width: '100%',
  },
});
