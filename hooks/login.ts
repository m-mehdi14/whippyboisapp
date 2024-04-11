/* eslint-disable prettier/prettier */
import {signInWithEmailAndPassword} from 'firebase/auth';
import {app, auth} from './firebaseConfig';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (email: string, password: string) => {
  try {
    let db = getFirestore(app);

    let userData: any;

    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      userData = querySnapshot.docs[0].data();
      if (userData.role !== 'customer') {
        // throw new Error("User is not a customer");
        return {
          error: 'User is not a customer',
        };
      }
    } else {
      // throw new Error("User not found in Firestore");
      return {
        error: 'User not found in Firestore',
      };
    }

    const response = await signInWithEmailAndPassword(auth, email, password);

    if (!response.user) {
      return {
        error: 'User not found!',
      };
    }

    return {
      success: 'User logged in successfully!',
      user: userData,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const DriverLoginUser = async (email: string, password: string) => {
  try {
    let db = getFirestore(app);

    let userData: any;
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      userData = querySnapshot.docs[0].data();
      if (userData.role !== 'driver') {
        // throw new Error("User is not a customer");
        return {
          error: 'User is not a driver',
        };
      }
    } else {
      // throw new Error("User not found in Firestore");
      return {
        error: 'User not found in Firestore',
      };
    }

    const response = await signInWithEmailAndPassword(auth, email, password);

    if (!response.user) {
      return {
        error: 'User not found!',
      };
    }

    // Store user data in AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(userData));

    return {
      success: 'User logged in successfully!',
      user: userData,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};