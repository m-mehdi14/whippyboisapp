/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {Linking, StyleSheet, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeStackNav from './HomeStackNav';
import Icon from 'react-native-vector-icons/Ionicons';
import MapStackNav from './MapStackNav';
import DrvierPostScreen from '../Screens/DrvierPostScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import messaging from '@react-native-firebase/messaging';

const Tab = createBottomTabNavigator();

const NAVIGATION_IDS = ['notification'];

function buildDeepLinkFromNotificationData(data: any) {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'notification') {
    return 'myapp://notification';
  }
  // if (navigationId === 'settings') {
  //   return 'myapp://settings';
  // }
  // const postId = data?.postId;
  // if (typeof postId === 'string') {
  //   return `myapp://post/${postId}`;
  // }
  console.warn('Missing postId');
  return null;
}

const linking: any = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      driverhome: {
        // Assuming "HomeStackNav" is accessed via "driverhome" tab
        screens: {
          home: 'home',
          notification: 'notification', // Correct path to the notification screen
          addproduct: 'addproduct',
        },
      },
      map: 'map',
      driverPost: 'driverPost',
      profile: 'profile',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
};

export default function DriverTabNav() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Tab.Navigator
        initialRouteName="driverhome"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#FECC1D',
          },
        }}>
        <Tab.Screen
          name="driverhome"
          component={HomeStackNav}
          options={{
            title: 'WhippyBois',
            headerShown: false,
            tabBarIcon: ({size, focused}) => (
              <Icon
                name="home"
                size={size}
                color={focused ? 'black' : 'white'}
                style={{
                  backgroundColor: focused ? 'white' : 'black',
                  borderRadius: 50,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="map"
          component={MapStackNav}
          options={{
            title: 'WhippyBois',
            headerShown: false,
            tabBarIcon: ({size, focused}) => (
              <Icon
                name="location"
                size={size}
                color={focused ? 'black' : 'white'}
                style={{
                  backgroundColor: focused ? 'white' : 'black',
                  borderRadius: 50,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="driverPost"
          component={DrvierPostScreen}
          options={{
            title: 'WhippyBois',
            headerShown: false,
            tabBarIcon: ({size, focused}) => (
              <Icon
                name="clipboard"
                size={size}
                color={focused ? 'black' : 'white'}
                style={{
                  backgroundColor: focused ? 'white' : 'black',
                  borderRadius: 50,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            title: 'WhippyBois',
            tabBarIcon: ({size, focused}) => (
              <Icon
                name="person-outline"
                size={size}
                color={focused ? 'black' : 'white'}
                style={{
                  backgroundColor: focused ? 'white' : 'black',
                  borderRadius: 50,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 35,
    left: 20,
    right: 20,
    borderRadius: 15,
    backgroundColor: 'black',
    height: 65,
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    // borderWidth: 6,
    padding: 1,
  },
});
