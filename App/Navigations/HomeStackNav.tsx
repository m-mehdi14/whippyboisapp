/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import AddProductScreen from '../Screens/AddProductScreen';

export default function HomeStackNav() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          //   headerShown: false,
          title: 'WhippyBois',
          headerStyle: {
            backgroundColor: '#FECC1D',
          },
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="notification"
        component={NotificationScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FECC1D',
          },
        }}
      />
      <Stack.Screen
        name="addproduct"
        component={AddProductScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FECC1D',
          },
        }}
      />
    </Stack.Navigator>
  );
}
