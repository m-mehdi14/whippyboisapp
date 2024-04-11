/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeStackNav from './HomeStackNav';
import Icon from 'react-native-vector-icons/Ionicons';
import MapStackNav from './MapStackNav';
import DrvierPostScreen from '../Screens/DrvierPostScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();
export default function DriverTabNav() {
  return (
    <NavigationContainer>
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
