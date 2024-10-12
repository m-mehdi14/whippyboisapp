/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';

interface AddRouteProps {
  getData: (data: any) => void;
  cords?: any;
}

const AddRoute = ({getData, cords}: AddRouteProps) => {
  const isFocused = useIsFocused();
  // const insets = useSafeAreaInsets();
  const nav = useNavigation();

  // console.log('Cords Boolean', cords);

  useEffect(() => {
    if (isFocused) {
      // Refresh the screen or call any function to update the data
    }
  }, [isFocused]);

  const onPressLocation = () => {
    //@ts-ignore
    nav.navigate('route', {
      getCordinates: fetchValues,
    });
  };

  // Function for Change route
  const onPressChangeRoute = () => {
    //@ts-ignore
    nav.navigate('changeRoute', {
      getCordinates: fetchValues,
    });
  };

  const fetchValues = (data: any) => {
    // console.log('Data ---> ', data);
    // Send coordinates to Map Screen.
    getData(data);
  };
  return (
    <>
      {cords ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#FF0000',
            height: 45,
            width: 116,
            // left: 150,
            // top: 90,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            marginTop: 40,
          }}
          onPress={onPressChangeRoute}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
            }}>
            Change Route
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#FF0000',
            height: 45,
            width: 116,
            // left: 150,
            // top: 90,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            marginTop: 40,
          }}
          onPress={onPressLocation}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
            }}>
            Set Marker
          </Text>
        </TouchableOpacity>
      )}
      {/* <TouchableOpacity
        style={{
          backgroundColor: '#FF0000',
          height: 45,
          width: 116,
          // left: 150,
          // top: 90,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
          marginTop: 40,
        }}
        onPress={onPressLocation}>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
          }}>
          Set Marker
        </Text>
      </TouchableOpacity> */}
    </>
  );
};

export default AddRoute;

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     top: 60,
//     zIndex: 20,
//     width: "100%",
//     backgroundColor: "white",
//     padding: 14,
//     borderRadius: 10,
//     elevation: 5,
//   },
//   content: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//   },
// });
