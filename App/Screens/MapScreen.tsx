/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Circle, Marker} from 'react-native-maps';
import ImagePath from '../../hooks/ImagePath';
import MapViewDirections from 'react-native-maps-directions';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';
import AddRoute from '../Components/AddRoute';

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cords, setCords] = useState({
    pickupCords: null,
    dropCords: null,
  });
  const [selectedLanguage, setSelectedLanguage] = useState();
  const mapRef = useRef(null);
  // console.log(location);

  useEffect(() => {
    // notificationButton();
    requestLocationPermission(); // Request location permissions
    setModalVisible(false);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
        setCords(prevCords => ({
          ...prevCords,
          pickupCords: {
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          },
        }));
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getCordinatesFromUser = (data: any) => {
    // console.log("Data is On Map Screen ----> ", data);

    // Saved this Coordinates in the use State.
    setCords({
      ...cords,
      pickupCords: {
        latitude: data?.pickUpCords?.latitude,
        longitude: data?.pickUpCords?.longitude,
      },
      dropCords: {
        latitude: data?.DestinationCords?.latitude,
        longitude: data?.DestinationCords?.longitude,
      },
    });
  };

  if (!userLocation) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 70,
          zIndex: 20,
          right: 20,
        }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon
            name="more-horizontal"
            size={20}
            style={{
              color: 'white',
              backgroundColor: 'black',
              padding: 4,
              borderRadius: 50,
              elevation: 0,
              shadowOpacity: 0,
              shadowRadius: 0,
              // borderWidth: 6,
            }}
          />
        </TouchableOpacity>
      </View>
      {userLocation && (
        <>
          {/* <AddRoute getData={getCordinatesFromUser} /> */}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude,
              longitude: userLocation?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}>
            {cords?.pickupCords && (
              <>
                <Marker
                  coordinate={cords?.pickupCords}
                  title="Your Location"
                  description="This is your current location"
                  image={ImagePath?.isCurrentLoc}
                />
                <Circle center={cords?.pickupCords} radius={100} />
              </>
            )}
            {cords?.dropCords && (
              <Marker
                coordinate={cords?.dropCords}
                title="Drop Location"
                image={ImagePath?.isGreenMarker}
              />
            )}
            <MapViewDirections
              origin={cords?.pickupCords}
              destination={cords?.dropCords}
              strokeWidth={3}
              strokeColor="blue"
              apikey="AIzaSyBuzqzsIcuhUYAovZzlaj8ANGsKNk6ZTgE"
              optimizeWaypoints={true}
              onReady={result => {
                mapRef?.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 30,
                    bottom: 300,
                    left: 30,
                    top: 100,
                  },
                });
              }}
            />
          </MapView>
        </>
      )}

      <View style={styles.flexView}>
        {/* <View>
          <Button title="Show Bottom Sheet" onPress={toggleModal} />
        </View> */}

        <Modal
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          isVisible={isModalVisible}
          swipeDirection={['right', 'down']}
          onSwipeComplete={toggleModal}
          animationIn={'bounceInUp'}
          animationOut={'bounceOutDown'}
          animationInTiming={900}
          animationOutTiming={500}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={500}
          style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.center}>
              <View style={styles.barIcon} />
              {/* <Text>Welcome to bottom sheet Testing</Text> */}
              <View
                style={{
                  marginTop: 30,
                  width: '100%',
                  // flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#000',
                    }}>
                    Set Status
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                  }}>
                  <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedLanguage(itemValue)
                    }
                    dropdownIconColor={'#000'}>
                    <Picker.Item
                      label="Online"
                      value="online"
                      style={{
                        color: 'green',
                      }}
                    />
                    <Picker.Item
                      label="Offline"
                      value="offline"
                      style={{
                        color: 'red',
                      }}
                    />
                  </Picker>
                </View>
              </View>

              <AddRoute getData={getCordinatesFromUser} />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  formContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sheetContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: 'blue',
  },
  sheetContent: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
  },
  flexView: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    // backgroundColor: '#161616',
    backgroundColor: '#C3C3C3',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 300,
    paddingBottom: 20,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barIcon: {
    width: 60,
    height: 5,
    // backgroundColor: '#bbb',
    borderRadius: 3,
    backgroundColor: '#000',
  },
  text: {
    color: '#bbb',
    fontSize: 34,
    marginTop: 100,
  },
});
