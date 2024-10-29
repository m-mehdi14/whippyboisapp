/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {registerUser} from '../../hooks/register';
import {signOut} from 'firebase/auth';
import {auth} from '../../hooks/firebaseConfig';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Detect tablet screen

const CustomerSignUpScreen = () => {
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
    let response = await registerUser(name, email, confirmPassword, 'customer');
    setisloading(false);

    if (response.success) {
      ToastAndroid.show(response?.success, ToastAndroid.SHORT);
      await signOut(auth);
      //@ts-ignore
      navigation.navigate('customerlogin');
    } else {
      Alert.alert('Sign up', response.error);
    }

    setEmail('');
    setname('');
    setpassword('');
    setconfirmPassword('');
  };

  return (
    <KeyboardAvoidingView style={[styles.container, {flex: 1}]}>
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text
              style={[styles.titleText, isTablet && styles.titleTextTablet]}>
              WHIPPY BOIS
            </Text>

            <Text
              style={[
                styles.questionText,
                isTablet && styles.questionTextTablet,
              ]}>
              Create Customer Account
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
                onPress={() => navigation.navigate('customerlogin')}>
                <Text
                  style={[
                    styles.loginText,
                    isTablet && styles.loginTextTablet,
                  ]}>
                  Login
                </Text>
              </TouchableOpacity>

              <View style={styles.submitButtonContainer}>
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

export default CustomerSignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 72,
    color: '#FF0000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  titleTextTablet: {
    fontSize: 96, // Larger font size for tablets
  },
  questionText: {
    fontSize: 20,
    color: '#000',
    marginVertical: 10,
    textTransform: 'capitalize',
  },
  questionTextTablet: {
    fontSize: 26, // Larger font size for tablets
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
    width: 400, // Larger width for tablets
    height: 55,
    fontSize: 18,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  eyeIconTablet: {
    right: 20, // Adjust icon position for tablets
  },
  loginLink: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginRight: 10,
  },
  loginLinkTablet: {
    marginRight: 20, // Adjust margin for tablets
  },
  loginText: {
    color: '#0066FF',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  loginTextTablet: {
    fontSize: 20, // Larger font size for tablets
  },
  submitButtonContainer: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#0066FF',
    padding: 12,
    borderRadius: 10,
    width: 140,
  },
  submitButtonTablet: {
    padding: 15, // Larger padding for tablets
    width: 180,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonTextTablet: {
    fontSize: 18, // Larger font size for tablets
  },
});
