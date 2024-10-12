/* eslint-disable prettier/prettier */
/* eslint-disable no-extra-boolean-cast */
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {PermissionsAndroid, Platform} from 'react-native';
import {app} from './firebaseConfig';
// import {useCurrentUser} from './currentUser';

export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getFcmToken();
    } else {
      console.log('Permission Denied!');
    }
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

// const getFcmToken = async () => {
//   let fcmToken = await AsyncStorage.getItem('fcmToken');
//   console.log('the old token ', fcmToken);
//   if (!fcmToken) {
//     try {
//       fcmToken = await messaging().getToken();

//       if (fcmToken) {
//         console.log('The new Generated token ---> ', fcmToken);
//         await AsyncStorage.setItem('fcmToken', fcmToken);
//       }
//     } catch (error: any) {
//       console.log('error raises in fcmToken');
//       Alert.alert('Error', error.message);
//     }
//   }
// };

const getFcmToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();

    let fcmToken = await AsyncStorage.getItem('fcm_Token');
    if (!!fcmToken) {
      console.log('OLD Fcm-Token Found ', fcmToken);
    } else {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcm_Token', token);
      console.log('Token generated ----> ', token);
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('received in foreground', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification  caused  app  to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};

/**
 * function to get all FCM tokens from the 'fcmTokens' collection
 * @returns first parameter pass Pickup Address and in second parameter pass drop Address
 */
export const getAllFcmTokens = async (pickUp: string, drop: string) => {
  const db = getFirestore(app);
  const fcmTokensCollection = collection(db, 'fcmTokens');
  try {
    const querySnapshot = await getDocs(fcmTokensCollection);
    const tokens = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // userId: data.userId,
      // return {token: data.token};
      return data.token;
    });
    console.log('All tokens ---> ', tokens);

    const requestBody = {
      tokens: tokens,
      pickUpAddress: pickUp, // Include pickUp address in the body
      dropAddress: drop, // Include drop address in the body
    };
    // https://whippybois-express.vercel.app/
    const res = await fetch(
      // 'https://9b73-203-215-167-36.ngrok-free.app/send-noti',
      // 'https://whippybois-express.vercel.app/send-noti',
      // 'https://whippybois-express.onrender.com/send-noti',
      'https://whippy-bois-backend.onrender.com/send-noti',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    ).catch(err => console.error('Fetch error:', err));
    console.log(res);

    return tokens;
  } catch (error: any) {
    console.error('Error getting FCM tokens: ', error);
    // throw new Error(error.message);
  }
};

/**
 *
 * @param name
 * @param tokens
 * this function is for sending notification when driver is online
 * @returns
 */
export const DriverOnlineFunction = async (user: any) => {
  try {
    console.log('Inside this function Driver Online function ----->');
    console.log('🚀 ~ DriverOnlineFunction ~ user:', user);

    // const user: any = useCurrentUser();
    const db = getFirestore(app);
    const fcmTokensCollection = collection(db, 'fcmTokens');
    const querySnapshot = await getDocs(fcmTokensCollection);
    const tokens = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // userId: data.userId,
      // return {token: data.token};
      return data.token;
    });
    console.log('All tokens ---> ', tokens);

    const requestBody = {
      tokens: tokens,
      name: user.user.name,
    };
    console.log('Driver Online function ----> ', requestBody);

    const res = await fetch(
      // 'https://9b73-203-215-167-36.ngrok-free.app/send-noti',
      // 'https://whippybois-express.vercel.app/send-noti',
      // 'https://whippybois-express.onrender.com/driver-online',
      'https://whippy-bois-backend.onrender.com/driver-online',
      // 'https://aphid-driving-specially.ngrok-free.app/driver',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    ).catch(err => console.error('Fetch error:', err));
    console.log(res);

    return tokens;
  } catch (error) {}
};

export const ChangeRouteNotify = async (pickUp: string, drop: string) => {
  const db = getFirestore(app);
  const fcmTokensCollection = collection(db, 'fcmTokens');
  try {
    const querySnapshot = await getDocs(fcmTokensCollection);
    const tokens = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // userId: data.userId,
      // return {token: data.token};
      return data.token;
    });
    console.log('All tokens ---> ', tokens);

    const requestBody = {
      tokens: tokens,
      pickUpAddress: pickUp, // Include pickUp address in the body
      dropAddress: drop, // Include drop address in the body
    };
    //https://whippybois-express.vercel.app/
    const res = await fetch(
      // 'https://9b73-203-215-167-36.ngrok-free.app/send-noti',
      // 'https://whippybois-express.vercel.app/send-noti',
      // 'https://whippybois-express.onrender.com/send-noti',
      'https://whippy-bois-backend.onrender.com/send-noti',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    ).catch(err => console.error('Fetch error:', err));
    console.log(res);

    return tokens;
  } catch (error: any) {
    console.error('Error getting FCM tokens: ', error);
    // throw new Error(error.message);
  }
};

export const SendNotifyDriverArrive = async (token: string) => {
  try {
    const requestBody = {
      token: token,
    };

    const res = await fetch(
      // 'https://9b73-203-215-167-36.ngrok-free.app/driver-arrive',
      // 'https://whippybois-express.vercel.app/driver-arrive',
      // 'https://whippybois-express.onrender.com/driver-arrive',
      'https://whippy-bois-backend.onrender.com/driver-arrive',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    ).catch(err => console.error('Fetch error:', err));
    console.log(res);
  } catch (error: any) {
    console.error('Error getting FCM tokens: ', error);
    // throw new Error(error.message);
  }
};
