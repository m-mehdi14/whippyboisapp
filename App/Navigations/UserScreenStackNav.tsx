/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStackNav from './HomeStackNav';
import AddPostScreen from '../Screens/AddPostScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function UserScreenStackNav() {
  const stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="home-nav"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#FECC1D',
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name="home-nav"
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
