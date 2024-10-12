/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
import {
  deleteRoutesByDriverId,
  getDriverRouteData,
} from '../../hooks/RouteFunctions';
import messaging from '@react-native-firebase/messaging';
import {getAllRouteAcceptRequests} from '../../hooks/RideAccept';
import {
  DriverOnlineFunction,
  SendNotifyDriverArrive,
} from '../../hooks/notificationService';
import {useCurrentUser} from '../../hooks/currentUser';

export default function MapScreen() {
  const defaultLocation = {
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const user = useCurrentUser();
  // console.log('User ----> ', user?.user?.userId);

  const [userLocation, setUserLocation] = useState<any>(defaultLocation);
  const [location, setLocation] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cords, setCords] = useState({
    pickupCords: null,
    dropCords: null,
  });
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [routeRequests, setRouteRequests] = useState([]);
  // console.log('🚀 ~ MapScreen ~ routeRequests:', routeRequests);
  const [routesData, setRoutesData] = useState([]);
  const mapRef = useRef(null);
  // console.log(location);
  // console.log('Route Data ---> ', routesData);

  // console.log('Selected language  ---> ', selectedLanguage);

  useEffect(() => {
    requestLocationPermission();
    fetchAllRouteRequests();
    watchUserLocation();
    setModalVisible(false);
  }, []);

  useEffect(() => {
    const fetchDriverRouteData = async () => {
      try {
        const token = await messaging().getToken();

        const routes = await getDriverRouteData(user?.user?.userId as any);
        setRoutesData(routes);
        if (routes.length > 0) {
          const latestRoute = routes[routes.length - 1];
          setCords({
            pickupCords: {
              latitude: latestRoute.pickUpCords.latitude,
              longitude: latestRoute.pickUpCords.longitude,
            },
            dropCords: {
              latitude: latestRoute.DestinationCords.latitude,
              longitude: latestRoute.DestinationCords.longitude,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching driver route data:', error);
      }
    };

    fetchDriverRouteData();
  }, []);

  useEffect(() => {
    if (userLocation && cords && routesData.length > 0) {
      const loc2 = {
        latitude: cords?.pickupCords?.latitude,
        longitude: cords?.pickupCords?.longitude,
      };
      // const distance = getDistance(userLocation, cords.dropCords);
      const distance = getDistance(userLocation, loc2);
      if (distance < 50) {
        routesData.forEach((route: any) => {
          deleteRoutesByDriverId(user?.user?.userId)
            .then(() => {
              console.log(
                'Routes successfully deleted due to proximity for driver ID:',
                route.driverId,
              );
            })
            .catch(error => {
              console.error(
                'Failed to delete routes for driver ID:',
                route.driverId,
                error,
              );
            });
        });
      }
    }
  }, [userLocation, cords.dropCords, routesData]);

  const fetchAllRouteRequests = async () => {
    const requests = await getAllRouteAcceptRequests();
    setRouteRequests(requests);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log('🚀 ~ getUserLocation ~ position:', position);
        // console.log(position?.coords);
        setUserLocation(position?.coords);
        setLocation(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getCordinatesFromUser = (data: any) => {
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

  const watchUserLocation = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('WATCH-USER-LOCATION --->', position.coords);
        setUserLocation({latitude, longitude});
        checkProximity({latitude, longitude});
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  };

  const checkProximity = (currentLocation: any) => {
    console.log('🚀 ~ checkProximity ~ currentLocation:', currentLocation);
    routeRequests.forEach((request): any => {
      const distance = getDistance(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          latitude: request?.location.latitude,
          longitude: request?.location.longitude,
        },
      );

      if (distance < 50) {
        SendNotifyDriverArrive(request?.driverId)
          .then(() => {
            console.log('Notification sent to driver at location.');
          })
          .catch(error => {
            console.error('Error sending notification:', error);
          });
      }
    });
  };

  const getDistance = (loc1: any, loc2: any) => {
    const radlat1 = (Math.PI * loc1.latitude) / 180;
    const radlat2 = (Math.PI * loc2.latitude) / 180;
    const theta = loc1.longitude - loc2.longitude;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344 * 1000;
    return dist;
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
            }}
          />
        </TouchableOpacity>
      </View>
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
        {routeRequests?.map((request: any) => (
          <>
            <Marker
              key={request?.id}
              coordinate={{
                latitude: request?.location.latitude,
                longitude: request?.location.longitude,
              }}
              title={`Request from ${request?.name}`}
            />
            <Circle
              center={{
                latitude: request?.location.latitude,
                longitude: request?.location.longitude,
              }}
              radius={100}
            />
          </>
        ))}
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
        {cords?.pickupCords && cords?.dropCords && (
          <>
            <MapViewDirections
              origin={cords?.pickupCords}
              destination={cords?.dropCords}
              strokeWidth={3}
              strokeColor="blue"
              apikey="AIzaSyBuzqzsIcuhUYAovZzlaj8ANGsKNk6ZTgE"
              optimizeWaypoints={true}
              onReady={result => {
                if (cords.pickupCords && cords.dropCords) {
                  mapRef?.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: 30,
                      bottom: 300,
                      left: 30,
                      top: 100,
                    },
                  });
                }
              }}
              onError={errorMessage => {
                console.log('GMAPS route request error:', errorMessage);
              }}
            />
          </>
        )}
        {/* {routesData?.map((route: any, index: any) => (
          <MapViewDirections
            key={index}
            origin={{
              latitude: route.pickUpCords.latitude,
              longitude: route.pickUpCords.longitude,
            }}
            destination={{
              latitude: route.DestinationCords.latitude,
              longitude: route.DestinationCords.longitude,
            }}
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
            onError={errorMessage => {
              console.log('GMAPS route request error:', errorMessage);
            }}
          />
        ))} */}
      </MapView>

      <View style={styles.flexView}>
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
              <View
                style={{
                  marginTop: 30,
                  width: '100%',
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
                      label="Offline"
                      value="offline"
                      style={{
                        color: 'red',
                      }}
                    />
                    <Picker.Item
                      label="Online"
                      value="online"
                      style={{
                        color: 'green',
                      }}
                    />
                  </Picker>
                </View>
              </View>

              <AddRoute
                getData={getCordinatesFromUser}
                cords={cords.dropCords}
              />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    borderRadius: 3,
    backgroundColor: '#000',
  },
  text: {
    color: '#bbb',
    fontSize: 34,
    marginTop: 100,
  },
});
