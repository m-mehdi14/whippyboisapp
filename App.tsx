/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {useCurrentUser} from './hooks/currentUser';
import RoleSplitNav from './App/Navigations/RoleSplitNav';
import SplashScreenStackNav from './App/Navigations/SplashScreenStackNav';
import {
  requestUserPermission,
  notificationListener,
} from './hooks/notificationService';

export default function App() {
  const {user}: any = useCurrentUser();

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);
  return user ? <RoleSplitNav /> : <SplashScreenStackNav />;
}
