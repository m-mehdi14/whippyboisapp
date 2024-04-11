/* eslint-disable prettier/prettier */

import React from 'react';
import {useCurrentUser} from '../../hooks/currentUser';
import UserScreenStackNav from './UserScreenStackNav';
import DriverTabNav from './DriverTabNav';

export default function RoleSplitNav() {
  const {user}: any = useCurrentUser();
  return (
    <>{user?.role === 'customer' ? <UserScreenStackNav /> : <DriverTabNav />}</>
  );
}
