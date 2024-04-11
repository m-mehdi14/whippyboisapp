/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useCurrentUser} from './hooks/currentUser';
import RoleSplitNav from './App/Navigations/RoleSplitNav';
import SplashScreenStackNav from './App/Navigations/SplashScreenStackNav';

export default function App() {
  const {user}: any = useCurrentUser();
  return user ? <RoleSplitNav /> : <SplashScreenStackNav />;
}
