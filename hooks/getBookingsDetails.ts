/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// import {collection, getDocs, getFirestore} from 'firebase/firestore';
// import {app} from './firebaseConfig';

// export const getBookingsDetails = async () => {
//   try {
//     const db = getFirestore(app);
//     const bookingCollection = collection(db, 'booking');
//     const productsSnapshot = await getDocs(bookingCollection);

//     const products: any = [];
//     productsSnapshot.forEach(doc => {
//       products.push(doc.data());
//     });

//     return products;
//   } catch (error) {
//     console.error('Error in getting booking Details !', error);
//   }
// };

/* eslint-disable prettier/prettier */
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import {app} from './firebaseConfig';

// export const getBookingsDetails = async () => {
//   try {
//     const db = getFirestore(app);
//     const bookingCollection = collection(db, 'booking');

//     // Create a query to order the documents by 'createdAt' in descending order
//     const bookingQuery = query(bookingCollection, orderBy('createdAt', 'desc'));
//     const productsSnapshot = await getDocs(bookingQuery);

//     const products: any = [];
//     productsSnapshot.forEach(docs => {
//       products.push(docs.data());
//     });

//     return products;
//   } catch (error) {
//     console.error('Error in getting booking details!', error);
//   }
// };

// export const getBookingsDetails = async () => {
//   try {
//     const db = getFirestore(app);
//     const bookingCollection = collection(db, 'booking');

//     // Create a query to order the documents by 'createdAt' in descending order
//     const bookingQuery = query(bookingCollection, orderBy('createdAt', 'desc'));
//     const productsSnapshot = await getDocs(bookingQuery);

//     const products: any = [];
//     productsSnapshot.forEach(doc => {
//       products.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     return products;
//   } catch (error) {
//     console.error('Error in getting booking details!', error);
//   }
// };

export const getBookingsDetails = async () => {
  try {
    const db = getFirestore(app);
    const bookingCollection = collection(db, 'booking');

    // Get the current date and time
    const now = Timestamp.now();

    // Create a query to get bookings with dates in the future, ordered by 'createdAt' in descending order
    const bookingQuery = query(
      bookingCollection,
      where('booking.date', '>=', now),
      orderBy('booking.date', 'desc'),
    );

    const productsSnapshot = await getDocs(bookingQuery);

    const products: any = [];
    productsSnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return products;
  } catch (error) {
    console.error('Error in getting booking details!', error);
  }
};

export const updateBookingStatus = async (bookingId: any, status: any) => {
  const db = getFirestore(app);
  const bookingRef = doc(db, 'booking', bookingId);
  await updateDoc(bookingRef, {
    'booking.status': status,
  });
};
