/* eslint-disable prettier/prettier */
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import {app} from './firebaseConfig';

interface registerBookingProps {
  quatity: string;
  date: Date;
  number: string;
  address: string;
  location: string;
  user: any;
}

export const registerBooking = async (options: registerBookingProps) => {
  try {
    const {quatity, date, number, address, location, user} = options;
    let db = getFirestore(app);

    if (!options || !user) {
      return {
        error: 'Please fill all the fields',
      };
    }

    // Create a unique document ID for the booking
    const bookingId = doc(collection(db, 'booking')).id;

    await setDoc(doc(db, 'booking', bookingId), {
      name: user.user?.name,
      email: user.user?.email,
      role: user.user?.role,
      userId: user.user.userId,
      booking: {
        quatity,
        date,
        number,
        address,
        location,
      },
      createdAt: Timestamp.now(),
    });

    return {
      success: 'Booked successfully!',
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

// // Function to get bookings by userId
// export const getBookingsByUserId = async (userId: string) => {
//   try {
//     let db = getFirestore(app);
//     const q = query(collection(db, 'booking'), where('userId', '==', userId));
//     const querySnapshot = await getDocs(q);

//     let bookings: any[] = [];
//     querySnapshot.forEach(docs => {
//       bookings.push({
//         id: docs.id,
//         ...docs.data(),
//       });
//     });

//     return {
//       success: 'Bookings retrieved successfully!',
//       data: bookings,
//     };
//   } catch (error: any) {
//     return {
//       error: error.message,
//     };
//   }
// };

// Function to get bookings by userId
export const getBookingsByUserId = async (userId: string) => {
  try {
    let db = getFirestore(app);
    const q = query(
      collection(db, 'booking'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'), // Order by createdAt in descending order
    );
    const querySnapshot = await getDocs(q);

    let bookings: any[] = [];
    querySnapshot.forEach(doc => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      success: 'Bookings retrieved successfully!',
      data: bookings,
    };
  } catch (error: any) {
    if (
      error.code === 'failed-precondition' ||
      error.code === 'permission-denied'
    ) {
      console.error(
        'An index is required for this query. Visit the following URL to create the index:',
      );
      console.error(error.message); // This should include the URL to create the index
    }
    return {
      error: error.message,
    };
  }
};
