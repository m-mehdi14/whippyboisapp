/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {app, auth} from './firebaseConfig';

// export function useCurrentUser() {
//   const [user, setUser] = useState<User>();

//   const db = getFirestore(app);
//   // fetch user from email , from firebase collection users,

//   useEffect(() => {
//     const fetchUserFromAsyncStorage = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem("user");
//         if (storedUser !== null) {
//           // User data has been retrieved and can be used
//           console.log("User From async Storage ---> ", storedUser);
//           setUser(JSON.parse(storedUser));
//         }
//       } catch (error) {
//         console.error("Error retrieving user from AsyncStorage:", error);
//       }
//     };

//     fetchUserFromAsyncStorage();
//     const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
//       auth,
//       (authUser) => {
//         if (authUser) {
//           const q = query(
//             collection(db, "users"),
//             where("email", "==", authUser.email)
//           );
//           const unsubscribeFromFirestore = onSnapshot(q, (querySnapshot) => {
//             if (!querySnapshot.empty) {
//               const userData: any = querySnapshot.docs[0].data();
//               setUser(userData);
//             } else {
//               console.error("User data not found in Firestore");
//               setUser(undefined);
//             }
//           });

//           return () => unsubscribeFromFirestore();
//         } else {
//           setUser(undefined);
//         }
//       }
//     );

//     return () => unsubscribeFromAuthStatusChanged();
//   }, []);

//   // useEffect(() => {
//   //   // Set persistence to LOCAL
//   //   setPersistence(auth, browserLocalPersistence)
//   //     .then(() => {
//   //       // Handle the auth state change
//   //       const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
//   //         auth,
//   //         (authUser) => {
//   //           if (authUser) {
//   //             const q = query(
//   //               collection(db, "users"),
//   //               where("email", "==", authUser.email)
//   //             );
//   //             const unsubscribeFromFirestore = onSnapshot(
//   //               q,
//   //               (querySnapshot) => {
//   //                 if (!querySnapshot.empty) {
//   //                   const userData: any = querySnapshot.docs[0].data();
//   //                   setUser(userData);
//   //                 } else {
//   //                   console.error("User data not found in Firestore");
//   //                   setUser(null);
//   //                 }
//   //               }
//   //             );

//   //             return () => unsubscribeFromFirestore();
//   //           } else {
//   //             setUser(null);
//   //           }
//   //         }
//   //       );

//   //       return () => unsubscribeFromAuthStatusChanged();
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error setting persistence:", error);
//   //     });
//   // }, []);

//   return {
//     user,
//   };
// }

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  const db = getFirestore(app);

  useEffect(() => {
    // Function to fetch user data from Firestore
    const fetchUserFromFirestore = async (email: string) => {
      const q = query(collection(db, 'users'), where('email', '==', email));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData: any = querySnapshot.docs[0].data();
          setUser(userData);
          await AsyncStorage.setItem('user', JSON.stringify(userData)); // Optionally cache in AsyncStorage
        } else {
          console.error('User data not found in Firestore');
          setUser(null);
        }
      } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
        setUser(null);
      }
    };

    // Fetch user from AsyncStorage
    const fetchUserFromAsyncStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser !== null) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error retrieving user from AsyncStorage:', error);
      }
    };

    // On mount, check AsyncStorage first
    fetchUserFromAsyncStorage();

    // Subscribe to auth state changes
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      authUser => {
        if (authUser) {
          fetchUserFromFirestore(authUser?.email!);
        } else {
          setUser(null);
        }
      },
    );

    // Clean up the subscription
    return () => unsubscribeFromAuthStatusChanged();
  }, [db]);

  return {user};
}
