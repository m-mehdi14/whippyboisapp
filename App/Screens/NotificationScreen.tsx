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
import {FlatList} from 'react-native';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {app} from '../../hooks/firebaseConfig';
import {Modal} from 'react-native';
import Draggable from 'react-native-draggable';

export default function NotificationScreen() {
  const [pickUpAddress, setpickUpAddress] = useState('');
  const [userLocation, setUserLocation] = useState<any>(null);
  const [routes, setRoutes] = useState([]); // State to store routes
  console.log('🚀 ~ NotificationScreen ~ userLocation:', userLocation);
  const [location, setLocation] = useState<any>(null);
  console.log('🚀 ~ NotificationScreen ~ location:', location);
  console.log('🚀 ~ NotificationScreen ~ pickUpAddress:', pickUpAddress);
  const [dropAddress, setdropAddress] = useState('');
  const [pressCount, setPressCount] = useState(0); // State to track button presses
  const [showPopup, setShowPopup] = useState(false);
  const [clickCounts, setClickCounts] = useState(0);
  const [customCode, setCustomCode] = useState('');
  console.log('🚀 ~ NotificationScreen ~ dropAddress:', dropAddress);
  const user: any = useCurrentUser();
  console.log('User ----> ', user);

  useEffect(() => {
    const fetchDriverRouteData = async () => {
      try {
        const token = await messaging().getToken();
        var routes = await getDriverRouteData(token);
        if (routes.length > 0) {
          setRoutes(routes);
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
  useEffect(() => {
    fetchCustomCode();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

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
  const fetchCustomCode = async () => {
    const db = getFirestore(app);
    const userId = user?.user?.email; // Assuming email is unique and used as a user ID
    const userDoc = doc(db, 'userClicks', userId);

    try {
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists() && docSnap.data().customCode) {
        const customCode = docSnap.data().customCode;
        setCustomCode(customCode); // Set the custom code in the state
      } else {
        console.log('No custom code available.');
      }
    } catch (error) {
      console.error('Failed to fetch custom code:', error);
    }
  };

  const handleYesPress = async () => {
    try {
      const db = getFirestore(app);
      const token = await messaging().getToken();
      const userId = user?.user?.email;
      const userDoc = doc(db, 'userClicks', userId);

      // Call the RideAccept function
      if (user?.user?.name && token && userLocation) {
        await RideAccept(user?.user?.name, token, userLocation).then(() => {
          Alert.alert('Driver is on his way!');
        });

        try {
          const docSnap = await getDoc(userDoc);
          // let count = 0;
          let count = docSnap.exists() ? docSnap.data().clickCount + 1 : 1;

          if (docSnap.exists()) {
            const data = docSnap.data();
            count = data.clickCount + 1;
            if (count < 11) {
              await updateDoc(userDoc, {clickCount: count});
            } else if (count === 11) {
              const customCode = generateCustomCode();
              await updateDoc(userDoc, {clickCount: 1, customCode: customCode});
              setCustomCode(customCode); // Update the custom code state
              count = 1; // Reset count
            }
          } else {
            count = 1; // Initialize the count
            await setDoc(userDoc, {clickCount: count});
          }

          // Update local state
          setClickCounts(count);
          setShowPopup(true); // Show the popup automatically after button press
        } catch (error) {
          console.error('Error on updating click count: ', error);
        }
      }
    } catch (error) {
      console.error('Error on ride acceptance: ', error);
    }
  };

  // Function to generate a custom code
  const generateCustomCode = () => {
    return Math.random().toString(36).substr(2, 9); // Example of generating a simple code
  };

  const PopupModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPopup}
      onRequestClose={() => {
        setShowPopup(false);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Get a free ice cream on your 11th purchase!
          </Text>
          <Text style={styles.modalText}>Click Count: {clickCounts}</Text>
          {customCode && (
            <Text style={styles.modalText}>Your Code: {customCode}</Text>
          )}
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => setShowPopup(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Add Draggable Icon to the UI
  const DraggableIcon = () => (
    <Draggable
      x={-10} // X position on screen
      y={50} // Y position on screen
      renderColor="red" // Color of the draggable component
      // renderShape="circle" // Shape of the draggable component
      onShortPressRelease={() => setShowPopup(true)} // Show the popup on click
      renderText="🍦" // Emoji as an icon
      isCircle
      renderSize={44}
    />
  );

  // Render Item for FlatList
  const renderItem = ({item}: any) => (
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
        <Text style={styles.notificationSubText}>Do you want something?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleYesPress} style={styles.buttonYes}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.buttonNo}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView> */}
      <View style={styles.content}>
        {/* Unified Notification Box */}
        <FlatList
          data={routes}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.driverId}
          style={styles.list}
        />

        {/* {customCode ? (
          <View style={styles.codeDisplay}>
            <Text>Your Custom Code: {customCode}</Text>
          </View>
        ) : null} */}
        <DraggableIcon />
        <PopupModal />
        {/* Second Box */}
        {/* <View
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
        </View> */}
      </View>
      {/* </ScrollView> */}
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
    // marginBottom: 10,
  },
  notificationBox: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 10,
    padding: 0,
    marginBottom: 10,
    marginLeft: 3,
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
  list: {
    width: '100%',
  },
  codeDisplay: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background for modal overlay
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    height: 250,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '700',
    color: '#000',
    fontSize: 20,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
