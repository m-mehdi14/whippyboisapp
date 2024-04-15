/* eslint-disable prettier/prettier */
import {addDoc, collection, getDocs, getFirestore} from 'firebase/firestore';

export const RideAccept = async (name: any, token: any, location: any) => {
  const db = getFirestore();
  const coordsCollection = collection(db, 'RouteAcceptRequest'); // Name your collection
  try {
    const docRef = await addDoc(coordsCollection, {
      driverId: token,
      name: name,
      location: location,
      createdAt: new Date(), // Add a timestamp if needed
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const getAllRouteAcceptRequests = async () => {
  const db = getFirestore();
  const coordsCollection = collection(db, 'RouteAcceptRequest'); // Reference to your collection
  try {
    const querySnapshot = await getDocs(coordsCollection);
    let requests: any = []; // Array to store the data
    querySnapshot.forEach(doc => {
      // Push each doc's data into the array
      requests.push({
        id: doc.id, // Document ID
        ...doc.data(), // Spread all fields of the document
      });
    });
    return requests; // Return the array containing all documents
  } catch (e) {
    console.error('Error getting documents: ', e);
    return []; // Return an empty array in case of error
  }
};
