/* eslint-disable prettier/prettier */
import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCurrentUser} from '../../hooks/currentUser';
import {signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../../hooks/firebaseConfig';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native';
import {StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Check if the device is a tablet

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

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        <Text
          style={[styles.headingText, isTablet && styles.headingTextTablet]}>
          Whippy Bois
        </Text>
        <Text style={[styles.subHeading, isTablet && styles.subHeadingTablet]}>
          Customer Profile
        </Text>

        {/* Name */}
        <View style={styles.profileItem}>
          <Text style={styles.label}>Name :</Text>
          <Text style={styles.value}>{user.user?.name}</Text>
        </View>

        {/* Code Section */}
        <View
          style={[
            styles.codeContainer,
            isTablet && styles.codeContainerTablet,
          ]}>
          <Text style={[styles.codeText, isTablet && styles.codeTextTablet]}>
            Code by Whippy Bois
          </Text>
          {user.user?.generateCode ? (
            <Text
              style={[styles.codeValue, isTablet && styles.codeValueTablet]}>
              {user.user?.generateCode?.code}
            </Text>
          ) : (
            <Text
              style={[styles.noCodeText, isTablet && styles.noCodeTextTablet]}>
              No code available
            </Text>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={[styles.logoutButton, isTablet && styles.logoutButtonTablet]}>
          <Text
            style={[
              styles.logoutButtonText,
              isTablet && styles.logoutButtonTextTablet,
            ]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 35,
    alignItems: 'center',
  },
  contentTablet: {
    marginTop: 50, // More margin for tablets
  },
  headingText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
  },
  headingTextTablet: {
    fontSize: 40, // Larger font size for tablets
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    color: '#000',
  },
  subHeadingTablet: {
    fontSize: 22, // Larger font size for tablets
    marginTop: 30, // Adjust margin for tablets
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
  codeContainer: {
    marginTop: 20,
    backgroundColor: '#E0E0E0',
    padding: 15,
    width: '100%',
    borderRadius: 10,
  },
  codeContainerTablet: {
    padding: 25, // Larger padding for tablets
  },
  codeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  codeTextTablet: {
    fontSize: 24, // Larger font size for tablets
  },
  codeValue: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 68,
    fontSize: 15,
    fontWeight: '800',
  },
  codeValueTablet: {
    fontSize: 20, // Larger font for tablets
  },
  noCodeText: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 25,
    fontSize: 15,
  },
  noCodeTextTablet: {
    fontSize: 20, // Larger font for tablets
  },
  logoutButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    marginTop: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#000',
  },
  logoutButtonTablet: {
    padding: 15, // Increase padding for tablets
    width: 180, // Wider button for tablets
    marginTop: 200, // Adjust margin for tablets
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 17,
  },
  logoutButtonTextTablet: {
    fontSize: 22, // Larger font for tablets
  },
});
