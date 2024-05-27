/* eslint-disable prettier/prettier */

'use server';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import {app} from './firebaseConfig';
import {Alert} from 'react-native';

export const getProducts = async () => {
  try {
    const db = getFirestore(app);
    const productsCollection = collection(db, 'productImage');
    const productsSnapshot = await getDocs(productsCollection);

    // const products: any = [];
    // productsSnapshot.forEach(docs => {
    //   products.push(docs.data());
    // });
    const products: any = []; // Removed 'any' for better TypeScript support, add back if needed
    productsSnapshot.forEach(docs => {
      // Include the document ID in the product data
      const data = docs.data();
      products.push({
        id: docs.id, // Add the document ID as a field
        ...data, // Spread all other data fields
      });
    });

    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    // throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  const db = getFirestore(app); // Get Firestore instance
  try {
    await deleteDoc(doc(db, 'productImage', productId)); // Specify the collection and document ID
    console.log('Product deleted successfully');
    Alert.alert('Product deleted successfully'); // Optionally handle user feedback
  } catch (error) {
    console.error('Error deleting product:', error);
    Alert.alert('Failed to delete the product.'); // Optionally handle user feedback
  }
};
