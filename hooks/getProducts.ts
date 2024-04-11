/* eslint-disable prettier/prettier */

'use server';

import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {app} from './firebaseConfig';

export const getProducts = async () => {
  try {
    const db = getFirestore(app);
    const productsCollection = collection(db, 'productImage');
    const productsSnapshot = await getDocs(productsCollection);

    const products: any = [];
    productsSnapshot.forEach(doc => {
      products.push(doc.data());
    });

    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};
