/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {addDoc, collection, getFirestore} from 'firebase/firestore';
import {app} from '../../hooks/firebaseConfig';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {useCurrentUser} from '../../hooks/currentUser';
import {launchImageLibrary} from 'react-native-image-picker';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Tablet screen detection

export default function AddProductScreen() {
  const [image, setImage] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const db = getFirestore(app);
  const storage = getStorage();
  const currentUser: any = useCurrentUser();

  // Used to Pick image from gallery
  const pickImage = async () => {
    let options: any = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    };
    const result = await launchImageLibrary(options);
    setImage(result?.assets[0]?.uri as any);
  };

  // Handle Submit Function
  const onHandleSubmit = async () => {
    setisLoading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, 'productImages/' + Date.now() + '.jpg');

    uploadBytes(storageRef, blob)
      .then(() => {
        return getDownloadURL(storageRef);
      })
      .then(async downloadUrl => {
        let productData = {
          imageValue: downloadUrl,
          titleValue: title,
          priceValue: price,
          userId: currentUser?.user?.userId,
          userName: currentUser?.user?.name,
          role: currentUser?.user?.role,
          userEmail: currentUser?.user?.email,
        };

        const docRef = await addDoc(
          collection(db, 'productImage'),
          productData,
        );

        if (docRef.id) {
          setisLoading(false);
          Alert.alert('Product Added Successfully');
        }
      });
  };

  return (
    <View style={[styles.container, isTablet && styles.tabletContainer]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.centerContent}>
          <Text style={styles.heading}>Upload Product</Text>

          {/* Add Photo Button */}
          <TouchableOpacity style={styles.PhotoMain} onPress={pickImage}>
            <Text style={styles.photoText}>Upload Photo</Text>
          </TouchableOpacity>

          {/* Title and Price */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Product Title"
              style={styles.textInput}
              value={title}
              onChangeText={text => setTitle(text)}
              placeholderTextColor={'#000'}
            />
          </View>

          {image && <Image source={{uri: image}} style={styles.imagePreview} />}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onHandleSubmit}
            disabled={isLoading}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 30,
    alignItems: 'center',
  },
  tabletContainer: {
    paddingHorizontal: 50, // Increased padding for tablet screens
  },
  scrollContainer: {
    backgroundColor: '#ffffff',
  },
  centerContent: {
    alignItems: 'center',
  },
  heading: {
    width: 183,
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
  },
  PhotoMain: {
    width: 301,
    height: 121,
    backgroundColor: '#FF0000AA',
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  inputContainer: {
    marginTop: 30,
    width: '100%',
    gap: 30,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    height: 45,
    padding: 10,
    borderRadius: 10,
    color: '#000',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 30,
    backgroundColor: '#FF0000AA',
    height: 45,
    width: 116,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});
