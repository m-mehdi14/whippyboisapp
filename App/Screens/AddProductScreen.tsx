/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {addDoc, collection, getFirestore} from 'firebase/firestore';
import {app} from '../../hooks/firebaseConfig';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {useCurrentUser} from '../../hooks/currentUser';
import {TextInput} from 'react-native';
import {Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

export default function AddProductScreen() {
  const [image, setImage] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const db = getFirestore(app);
  const storage = getStorage();
  const currentUser: any = useCurrentUser();

  /**
   * Used to Pick image from gallery
   */
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [4, 4],
    //   quality: 1,
    // });

    // console.log(result);

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }
    let options: any = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    };
    // You can also use as a promise without 'callback':
    const result = await launchImageLibrary(options);
    console.log(result);
    setImage(result?.assets[0]?.uri as any);
  };

  // Handle Submit Function
  const onHandleSubmit = async () => {
    setisLoading(true);
    // conver Uri to Blob file
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, 'productImages/' + Date.now() + '.jpg');

    uploadBytes(storageRef, blob)
      .then(snapshot => {
        console.log('Uploaded a blob or file');
      })
      .then(res => {
        getDownloadURL(storageRef).then(async downloadUrl => {
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
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          backgroundColor: '#ffffff',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.heading}>Upload Product</Text>

          {/* Add Photo Button */}
          <TouchableOpacity
            style={styles.PhotoMain}
            onPress={() => pickImage()}>
            <Text>
              <Text style={styles.photoText}>Upload Photo</Text>
            </Text>
          </TouchableOpacity>

          {/* Title and Price */}
          <View
            style={{
              marginTop: 30,
              width: '100%',
              gap: 30,
            }}>
            <View>
              <TextInput
                placeholder="Product Title"
                style={{
                  width: '100%',
                  borderWidth: 1,
                  height: 45,
                  padding: 10,
                  borderRadius: 10,
                }}
                value={title}
                onChangeText={text => setTitle(text)}
                placeholderTextColor={'#000'}
              />
            </View>

            <View>
              <TextInput
                placeholder="Product Price"
                style={{
                  width: '100%',
                  borderWidth: 1,
                  height: 45,
                  padding: 10,
                  borderRadius: 10,
                }}
                keyboardAppearance="default"
                keyboardType="number-pad"
                value={price}
                onChangeText={p => setPrice(p)}
                placeholderTextColor={'#000'}
              />
            </View>
          </View>
          {/* Title and Price */}
          {image && (
            <>
              <Image
                source={{uri: image}}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 15,
                  marginTop: 10,
                }}
              />
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onHandleSubmit}
            disabled={isLoading}>
            <Text
              style={{
                color: '#fff',
              }}>
              Add Item
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // marginTop: 30,
    backgroundColor: '#ffffff',
    paddingTop: 30,
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
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 30,
    backgroundColor: '#FF0000AA',
    height: 45,
    width: 116,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
});
