/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {loginUser} from '../../hooks/login';

const {width} = Dimensions.get('window');
const isTablet = width >= 768; // Detect tablet screen

const CustomerLoginScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setisloading] = useState(false);

  const handleSubmitButton = async () => {
    setisloading(true);
    let response = await loginUser(email, password);
    setisloading(false);
    if (response.success) {
      //@ts-ignore
      navigation.navigate('home');
    } else {
      Alert.alert('Sign up', response.error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <KeyboardAvoidingView>
        <View style={styles.content}>
          <Text style={[styles.titleText, isTablet && styles.titleTextTablet]}>
            WHIPPY BOIS
          </Text>

          <Text
            style={[
              styles.questionText,
              isTablet && styles.questionTextTablet,
            ]}>
            Login to your customer account
          </Text>

          <View style={styles.formContent}>
            <TextInput
              style={[styles.textInput, isTablet && styles.textInputTablet]}
              placeholder="Enter your Email"
              onChangeText={setEmail}
              value={email}
              placeholderTextColor={'#000'}
            />
            <TextInput
              style={[styles.textInput, isTablet && styles.textInputTablet]}
              placeholder="Enter your Password"
              secureTextEntry={!showPassword}
              onChangeText={setpassword}
              value={password}
              placeholderTextColor={'#000'}
            />

            <TouchableOpacity
              style={[styles.eyeIcon, isTablet && styles.eyeIconTablet]}
              onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="black"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signUpLink, isTablet && styles.signUpLinkTablet]}
              //@ts-ignore
              onPress={() => navigation.navigate('customersignup')}>
              <Text
                style={[
                  styles.signUpText,
                  isTablet && styles.signUpTextTablet,
                ]}>
                Sign-up
              </Text>
            </TouchableOpacity>

            <View style={styles.submitButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isTablet && styles.submitButtonTablet,
                ]}
                disabled={isloading}
                onPress={handleSubmitButton}>
                <Text
                  style={[
                    styles.submitButtonText,
                    isTablet && styles.submitButtonTextTablet,
                  ]}>
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomerLoginScreen;

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
  formContent: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
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
    top: '40%',
  },
  eyeIconTablet: {
    right: 20, // Adjust icon position for tablets
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
  signUpLink: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginRight: 10,
  },
  signUpLinkTablet: {
    marginRight: 20, // Adjust margin for tablets
  },
  signUpText: {
    color: '#0066FF',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  signUpTextTablet: {
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
