/* eslint-disable prettier/prettier */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MapScreen from '../Screens/MapScreen';
import ChooseLocation from '../Screens/ChooseLocation';

export default function MapStackNav() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FECC1D',
        },
      }}>
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="route"
        component={ChooseLocation}
        options={{
          title: 'Choose Location',
        }}
      />
    </Stack.Navigator>
  );
}
