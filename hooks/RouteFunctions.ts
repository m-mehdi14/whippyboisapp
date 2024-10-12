/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  writeBatch,
} from 'firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {app} from './firebaseConfig';
import {useCurrentUser} from './currentUser';

export const saveCoordinatesToFirebase = async (
  pickUpCords: any,
  DestinationCords: any,
  userId: any,
) => {
  const db = getFirestore(app);

  const coordsCollection = collection(db, 'DriverRouteCoordinates'); // Name your collection

  const token = await messaging().getToken();

  // Define a query to find existing routes for the driver
  // You need some identifier for the driver, like a userId
  const driverId = token; // Replace with actual driver ID
  const existingRoutesQuery = query(
    coordsCollection,
    where('driverId', '==', driverId),
  );

  try {
    // Find and delete existing routes
    const querySnapshot = await getDocs(existingRoutesQuery);
    const deletionPromises: any = [];
    querySnapshot.forEach(docs => {
      // Add each deletion task to the array
      deletionPromises.push(deleteDoc(docs.ref));
    });

    // Wait for all deletions to complete
    await Promise.all(deletionPromises);
    console.log('Existing routes deleted');

    // Add the new route
    const docRef = await addDoc(coordsCollection, {
      driverId: token, // Remember to include this in your document
      pickUpCords,
      DestinationCords,
      createdAt: new Date(),
      userId: userId,
    });
    console.log('New document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error managing document: ', e);
  }
};

export const ChooseLocationSaveCords = async (
  pickUpCords: any,
  DestinationCords: any,
  userId: any,
) => {
  const db = getFirestore(app);
  const coordsCollection = collection(db, 'DriverRouteCoordinates'); // Name your collection
  const token = await messaging().getToken();
  try {
    const docRef = await addDoc(coordsCollection, {
      driverId: token,
      pickUpCords,
      DestinationCords,
      createdAt: new Date(), // Add a timestamp if needed
      userId: userId,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// export const getDriverRouteData = async (driverId?: string) => {
//   const db = getFirestore(app);
//   const coordsCollection = collection(db, 'DriverRouteCoordinates'); // Use your collection name
//   // const driverRoutesQuery = query(
//   //   coordsCollection,
//   //   where('driverId', '==', driverId),
//   // );

//   try {
//     const querySnapshot = await getDocs(coordsCollection);
//     let routes: any = [];
//     querySnapshot.forEach(doc => {
//       // Construct an array of route data objects
//       routes.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     console.log('Fetched route data: ', routes);
//     return routes; // Returns an array of route data objects
//   } catch (error) {
//     console.error('Error fetching route data: ', error);
//     throw new Error('Unable to fetch route data');
//   }
// };

export const getDriverRouteData = async (driverId?: string) => {
  const db = getFirestore(app);
  const coordsCollection = collection(db, 'DriverRouteCoordinates'); // Use your collection name

  try {
    // Use the 'where' clause to filter the documents based on the driverId
    let driverRoutesQuery;
    if (driverId) {
      driverRoutesQuery = query(
        coordsCollection,
        where('userId', '==', driverId),
      );
    } else {
      driverRoutesQuery = coordsCollection;
    }

    const querySnapshot = await getDocs(driverRoutesQuery);
    let routes: any = [];
    querySnapshot.forEach(doc => {
      // Construct an array of route data objects
      routes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log('Fetched route data: ', routes);
    return routes; // Returns an array of route data objects
  } catch (error) {
    console.error('Error fetching route data: ', error);
    throw new Error('Unable to fetch route data');
  }
};

// this function will use for notification screen .
export const getNotification = async () => {
  const db = getFirestore(app);
  const coordsCollection = collection(db, 'DriverRouteCoordinates'); // Use your collection name

  try {
    const querySnapshot = await getDocs(coordsCollection);
    let routes: any = [];
    querySnapshot.forEach(doc => {
      // Construct an array of route data objects
      routes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log('Fetched route data: ', routes);
    return routes; // Returns an array of route data objects
  } catch (error) {
    console.error('Error fetching route data: ', error);
    throw new Error('Unable to fetch route data');
  }
};

// export const deleteRoutesByDriverId = async (driverId: any) => {
//   const db = getFirestore();
//   const coordsCollection = collection(db, 'DriverRouteCoordinates');
//   const driverRoutesQuery = query(
//     coordsCollection,
//     where('driverId', '==', driverId),
//   );

//   try {
//     const querySnapshot = await getDocs(driverRoutesQuery);
//     const batch = writeBatch(db); // Correctly initiate a batch write

//     querySnapshot.forEach(docSnapshot => {
//       batch.delete(docSnapshot.ref); // Schedule each document for deletion
//     });

//     await batch.commit(); // Execute all deletions in the batch
//     console.log('All routes for driverId ' + driverId + ' have been deleted!');
//   } catch (error) {
//     console.error('Error removing documents: ', error);
//   }
// };

export const deleteRoutesByDriverId = async (driverId: any) => {
  const db = getFirestore();
  const coordsCollection = collection(db, 'DriverRouteCoordinates');
  const routeAcceptCollection = collection(db, 'RouteAcceptRequest');

  const driverRoutesQuery = query(
    coordsCollection,
    where('driverId', '==', driverId),
  );

  try {
    const batch = writeBatch(db); // Correctly initiate a batch write

    // Delete DriverRouteCoordinates
    const coordsSnapshot = await getDocs(driverRoutesQuery);
    coordsSnapshot.forEach(docSnapshot => {
      batch.delete(docSnapshot.ref); // Schedule each document for deletion
    });

    // Delete all documents in RouteAcceptRequest
    const routeAcceptSnapshot = await getDocs(routeAcceptCollection);
    routeAcceptSnapshot.forEach(docSnapshot => {
      batch.delete(docSnapshot.ref); // Schedule each document for deletion
    });

    await batch.commit(); // Execute all deletions in the batch
    console.log(
      'All routes and requests for driverId ' +
        driverId +
        ' have been deleted!',
    );
  } catch (error) {
    console.error('Error removing documents: ', error);
  }
};
