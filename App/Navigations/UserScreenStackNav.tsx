/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {View, Text, StyleSheet, Linking} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStackNav from './HomeStackNav';
import AddPostScreen from '../Screens/AddPostScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import messaging from '@react-native-firebase/messaging';
import PreviousBookingsScreen from '../Screens/PreviousBookingsScreen';

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

export default function UserScreenStackNav() {
  const stack = createStackNavigator();
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Tab.Navigator
        initialRouteName="homenav"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#FECC1D',
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name="homenav"
          component={HomeStackNav}
          options={{
            title: 'Whippy Bois',
            tabBarIcon: ({color, size, focused}) => (
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
          name="post"
          component={AddPostScreen}
          options={{
            title: 'Post',
            tabBarIcon: ({color, size, focused}) => (
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
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({color, size, focused}) => (
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
        <Tab.Screen
          name="previousBooking"
          component={PreviousBookingsScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({color, size, focused}) => (
              <Icon
                name="list"
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
