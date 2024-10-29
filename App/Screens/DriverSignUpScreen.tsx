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
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {registerUser} from '../../hooks/register';
import Icon from 'react-native-vector-icons/Ionicons';
import {signOut} from 'firebase/auth';
import {auth} from '../../hooks/firebaseConfig';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Detect tablet screen

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

  const matchedPassword = password === confirmPassword;

  const handleSubmitButton = async () => {
    setisloading(true);
    const response = await registerUser(name, email, confirmPassword, 'driver');
    setisloading(false);

    if (response.success) {
      ToastAndroid.show(response.success, ToastAndroid.SHORT);
      await signOut(auth);
      //@ts-ignore
      navigation.navigate('driverlogin');
    } else {
      Alert.alert('Sign up', response.error);
    }

    setEmail('');
    setname('');
    setpassword('');
    setconfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isTablet && styles.containerTablet]}>
      <SafeAreaView
        style={[
          styles.container,
          {paddingTop: insets.top, backgroundColor: '#E4E4E4'},
          isTablet && styles.containerTablet,
        ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.content, isTablet && styles.contentTablet]}>
            <Text
              style={[styles.titleText, isTablet && styles.titleTextTablet]}>
              WHIPPY BOIS
            </Text>
            <Text
              style={[
                styles.questionText,
                isTablet && styles.questionTextTablet,
              ]}>
              Create Driver Account
            </Text>

            <View style={styles.formContent}>
              <TextInput
                style={[styles.textInput, isTablet && styles.textInputTablet]}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                placeholderTextColor={'#000'}
              />
              <TextInput
                style={[styles.textInput, isTablet && styles.textInputTablet]}
                placeholder="Name"
                onChangeText={setname}
                value={name}
                placeholderTextColor={'#000'}
              />
              <TextInput
                style={[styles.textInput, isTablet && styles.textInputTablet]}
                placeholder="Create Password"
                secureTextEntry={!showPassword}
                onChangeText={setpassword}
                value={password}
                placeholderTextColor={'#000'}
              />
              <TextInput
                style={[styles.textInput, isTablet && styles.textInputTablet]}
                placeholder="Re-Enter Password"
                secureTextEntry={!showConfirmPassword}
                onChangeText={setconfirmPassword}
                value={confirmPassword}
                placeholderTextColor={'#000'}
              />

              {/* Show Password Button */}
              <TouchableOpacity
                style={[
                  styles.eyeIcon,
                  {top: '45%'},
                  isTablet && styles.eyeIconTablet,
                ]}
                onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              {/* Show Confirm Password Button */}
              <TouchableOpacity
                style={[
                  styles.eyeIcon,
                  {top: '62%'},
                  isTablet && styles.eyeIconTablet,
                ]}
                onPress={() => setshowConfirmPassword(!showConfirmPassword)}>
                <Icon
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginLink, isTablet && styles.loginLinkTablet]}
                //@ts-ignore
                onPress={() => navigation.navigate('driverlogin')}>
                <Text
                  style={[
                    styles.loginText,
                    isTablet && styles.loginTextTablet,
                  ]}>
                  Login
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.submitButtonContainer,
                  isTablet && styles.submitButtonContainerTablet,
                ]}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isTablet && styles.submitButtonTablet,
                  ]}
                  disabled={isloading || !matchedPassword}
                  onPress={handleSubmitButton}>
                  <Text
                    style={[
                      styles.submitButtonText,
                      isTablet && styles.submitButtonTextTablet,
                    ]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  containerTablet: {
    paddingHorizontal: 50,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTablet: {
    paddingHorizontal: 40,
  },
  titleText: {
    fontSize: 72,
    color: '#FF0000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  titleTextTablet: {
    fontSize: 96,
  },
  questionText: {
    fontSize: 20,
    color: '#000',
    marginVertical: 10,
    textTransform: 'capitalize',
  },
  questionTextTablet: {
    fontSize: 26,
  },
  formContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderRadius: 10,
    height: 45,
    width: 300,
    backgroundColor: 'white',
    marginTop: 15,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  textInputTablet: {
    width: 400,
    height: 55,
    fontSize: 18,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    marginRight: 10,
  },
  eyeIconTablet: {
    right: 20,
  },
  loginLink: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginRight: 10,
  },
  loginLinkTablet: {
    marginRight: 20,
  },
  loginText: {
    color: '#0066FF',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  loginTextTablet: {
    fontSize: 20,
  },
  submitButtonContainer: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonContainerTablet: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#0066FF',
    padding: 12,
    borderRadius: 10,
    width: 140,
  },
  submitButtonTablet: {
    padding: 15,
    width: 180,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonTextTablet: {
    fontSize: 18,
  },
});
