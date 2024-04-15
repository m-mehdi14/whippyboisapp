/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {registerUser} from '../../hooks/register';
import {ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

const DriverSignUpScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [isloading, setisloading] = useState(false);

  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: 'driverlogin'}],
  });

  let matchedPassword = password === confirmPassword;
  const handleSubmitButton = async () => {
    setisloading(true);
    let response = await registerUser(name, email, confirmPassword, 'driver');
    setisloading(false);
    if (response.success) {
      // Alert.alert("Sign up", response.success);
      ToastAndroid.show(response?.success, ToastAndroid.SHORT);
      // const storedUser = await AsyncStorage.getItem('user');
      //@ts-ignore
      // navigation.navigate('driverlogin');
      navigation.dispatch(resetAction); // using the resetAction defined above
    }
    if (!response.success) {
      Alert.alert('Sign up', response.error);
    }
    setEmail('');
    setname('');
    setpassword('');
    setconfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={[
        {
          flex: 1,
        },
        styles.container,
      ]}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <SafeAreaView
        style={[
          styles.container,
          {paddingTop: insets.top, backgroundColor: '#E4E4E4'},
        ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Main DIV */}
          <View style={styles.content}>
            {/* Title Text */}
            <Text style={styles.titleText}>WHIPPY BOIS</Text>
            {/* Question Text */}
            <Text style={styles.questionText}>Create Driver Account</Text>

            {/* form */}
            <View style={styles.formContent}>
              {/* Email */}
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                onChangeText={e => setEmail(e)}
                value={email}
                placeholderTextColor={'#000'}
              />
              {/* Name */}
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                onChangeText={e => setname(e)}
                value={name}
                placeholderTextColor={'#000'}
              />
              {/* Create Password */}
              <TextInput
                style={styles.textInput}
                placeholder="Create Password"
                secureTextEntry={!showPassword}
                onChangeText={e => setpassword(e)}
                value={password}
                placeholderTextColor={'#000'}
              />
              {/* Re - Enter Password */}
              <TextInput
                style={styles.textInput}
                placeholder="Re-Enter Password"
                secureTextEntry={!showConfirmPassword}
                onChangeText={e => setconfirmPassword(e)}
                value={confirmPassword}
                placeholderTextColor={'#000'}
              />

              {/* Show Password Button */}
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  marginTop: 0,
                  marginLeft: 'auto',
                  marginRight: 15,
                  position: 'absolute',
                  top: '45%',
                  right: 1,
                  bottom: -3,
                }}
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={{color: '#0066FF'}}>
                  {/* {showPassword ? "Hide Password" : "Show Password"} */}
                  {showPassword ? (
                    <Icon name="eye" size={24} color="black" />
                  ) : (
                    <Icon name="eye-off" size={24} color="black" />
                  )}
                </Text>
              </TouchableOpacity>

              {/* Show Confirm Password Button */}
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  marginTop: 0,
                  marginLeft: 'auto',
                  marginRight: 15,
                  position: 'absolute',
                  top: '62%',
                  right: 1,
                  bottom: -3,
                }}
                onPress={() => setshowConfirmPassword(!showConfirmPassword)}>
                <Text style={{color: '#0066FF'}}>
                  {/* {showPassword ? "Hide Password" : "Show Password"} */}
                  {showConfirmPassword ? (
                    <Icon name="eye" size={24} color="black" />
                  ) : (
                    <Icon name="eye-off" size={24} color="black" />
                  )}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end', // Align the button to the right
                  marginTop: 12,
                  marginLeft: 'auto', // Move to the rightmost position
                  marginRight: 10, // Add some spacing
                  // color: "#0066FF",
                }}
                //@ts-ignore
                onPress={() => navigation.navigate('driverlogin')}>
                <Text
                  style={{
                    color: '#0066FF',
                    fontSize: 16,
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
              {/* Login Button */}

              {/* Submit Button */}
              <View
                style={{
                  marginTop: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#0066FF',
                    padding: 12,
                    borderRadius: 10,
                    width: 140,
                  }}
                  disabled={isloading || !matchedPassword}
                  onPress={handleSubmitButton} // Call the handleSubmitButton function when the button is pressed
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* form */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default DriverSignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    // justifyContent: "center",
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 72,
    color: '#FF0000', // Assuming this is the color for the text
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  formContent: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
  },
  textInput: {
    borderRadius: 10,
    height: 45,
    width: 300,
    // backgroundColor: "#BCBCBC",
    // backgroundColor: '#ECECEC',
    backgroundColor: 'white',
    marginTop: 15,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  questionText: {
    fontSize: 20,
    color: '#000000', // Assuming black for the question text
    marginVertical: 10, // Space above and below the question
    textTransform: 'capitalize',
  },
});
