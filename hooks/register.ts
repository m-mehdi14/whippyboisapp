/* eslint-disable prettier/prettier */
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {app, auth} from './firebaseConfig';
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  collection,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
// import bcrypt from 'bcryptjs';

// interface RegisterUser {
//   name: string;
//   email: string;
//   password: any;
// }
/**
 * this function is used to register User in Application
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: 'customer' | 'driver',
) => {
  try {
    let db = getFirestore(app);
    console.log('passoword value --- > ', password);

    if (password.length < 6) {
      return {
        error: ' Passoword Length should be 6 characters!',
      };
    }

    // const { name, email, password } = options;
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    let fcmToken = await AsyncStorage.getItem('fcm_Token');
    await setDoc(doc(db, 'users', response?.user?.uid), {
      name: name,
      email: email,
      userId: response?.user?.uid,
      role: role,
      fcmToken: fcmToken,
      accountVerify: 'PENDING',
    });

    const token = await messaging().getToken();
    if (token) {
      await addDoc(collection(db, 'fcmTokens'), {
        userId: response.user.uid,
        token: fcmToken,
      });
    }

    return {
      success: 'User registered successfully!',
      data: response?.user,
    };
  } catch (error: any) {
    if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
      return {
        error: 'Email already in use!',
      };
    }
    return {
      error: error.message,
    };
  }
};
