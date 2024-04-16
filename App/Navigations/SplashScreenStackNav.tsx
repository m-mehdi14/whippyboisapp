/* eslint-disable prettier/prettier */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../Screens/SplashScreen';
import SelectionScreen from '../Screens/SelectionScreen';
import CustomerSignUpScreen from '../Screens/CustomerSignUpScreen';
import DriverSignUpScreen from '../Screens/DriverSignUpScreen';
import CustomerLoginScreen from '../Screens/CustomerLoginScreen';
import DriverloginScreen from '../Screens/DriverloginScreen';
import DriverDetailScreen from '../Screens/DriverDetailScreen';
import DriverPendingScreen from '../Screens/driver-pending-screen';

const Stack = createStackNavigator();
const SplashScreenStackNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="selectionScreen"
          component={SelectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="customersignup"
          component={CustomerSignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="driversignup"
          component={DriverSignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="customerlogin"
          component={CustomerLoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="driverlogin"
          component={DriverloginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="driverdetailScreen"
          component={DriverDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="driverPendingScreen"
          component={DriverPendingScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SplashScreenStackNav;
