/* eslint-disable prettier/prettier */
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {app} from './firebaseConfig';

export const getBookingsDetails = async () => {
  try {
    const db = getFirestore(app);
    const bookingCollection = collection(db, 'booking');
    const productsSnapshot = await getDocs(bookingCollection);

    const products: any = [];
    productsSnapshot.forEach(doc => {
      products.push(doc.data());
    });

    return products;
  } catch (error) {
    console.error('Error in getting booking Details !', error);
  }
};
