/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCurrentUser} from '../../hooks/currentUser';
import {signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../../hooks/firebaseConfig';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native';
import {StyleSheet} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user: any = useCurrentUser();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user'); // Clear user data from AsyncStorage
      // Optionally, navigate to the login screen or update the state to reflect the user has logged out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const SendNotifications = () => {
    // PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'Test Notification',
      message: 'This is a test notification by Pakverse Team',
    });

    PushNotification.localNotificationSchedule({
      channelId: 'test-channel',
      title: 'Alarm',
      message: 'This is a test notification by Pakverse Team by 5 second ago!',
      date: new Date(Date.now() + 5 * 1000),
      allowWhileIdle: true,
    });

    console.log('Notification Function ----> ');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.content}>
        <Text style={styles.headingText}>Whippy Bois</Text>
        <Text style={styles.subHeading}>Customer Profile</Text>
        {/* Name */}
        <View style={styles.profileItem}>
          <Text style={styles.label}>Name :</Text>
          <Text style={styles.value}>{user.user?.name}</Text>
        </View>

        {/* logout Button */}
        <TouchableOpacity
          // onPress={() => signOut(auth)}
          onPress={handleSignOut}
          style={styles.logoutButton}>
          <Text
            style={{
              color: '#000',
              fontSize: 17,
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* logout Button */}
      <TouchableOpacity
        // onPress={() => signOut(auth)}
        onPress={() => SendNotifications()}
        style={styles.logoutButton}>
        <Text
          style={{
            color: '#000',
            fontSize: 17,
          }}>
          Send Notifications
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#E4E4E4',
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 35,
    alignItems: 'center',
  },
  headingText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    color: '#000',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 10,
    color: '#000',
  },
  value: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  logoutButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    // marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#000',
    marginTop: 300,
  },
});
