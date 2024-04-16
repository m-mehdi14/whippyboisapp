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
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {DriverLoginUser} from '../../hooks/login';
import {sendEmailNotification} from '../../hooks/mail';

const DriverloginScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setisloading] = useState(false);

  const handleSubmitButton = async () => {
    setisloading(true);
    let response = await DriverLoginUser(email, password);
    setisloading(false);
    // if (response.verify) {
    //   //@ts-ignore
    //   navigation.navigate('driverPendingScreen');
    // }
    if (response.verify) {
      // Send email notification
      sendEmailNotification(email)
        .then(() => {
          //@ts-ignore
          navigation.navigate('driverPendingScreen');
        })
        .catch(error => {
          console.error('Failed to send email after verification:', error);
        });
    }
    // if (response.success) {
    //   //   Alert.alert("Login Successful");
    //   //@ts-ignore
    //   navigation.navigate('home');
    // }
    if (!response.success) {
      Alert.alert('Sign up', response.error);
    }
  };
  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <KeyboardAvoidingView>
        {/* Main DIV */}
        <View style={styles.content}>
          {/* Title Text */}
          <Text style={styles.titleText}>WHIPPY BOIS</Text>
          {/* Question Text */}
          <Text style={styles.questionText}>Login to your driver account</Text>

          {/* form */}
          <View style={styles.formContent}>
            {/* Email */}
            <TextInput
              style={styles.textInput}
              placeholder="Enter your Email"
              onChangeText={e => setEmail(e)}
              value={email}
              placeholderTextColor={'#000'}
            />
            {/* Create Password */}
            <TextInput
              style={styles.textInput}
              placeholder="Enter your Password"
              secureTextEntry={!showPassword}
              onChangeText={e => setpassword(e)}
              value={password}
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
                top: '40%',
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

            {/* Login Button */}
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end', // Align the button to the right
                marginTop: 12,
                marginLeft: 'auto', // Move to the rightmost position
                marginRight: 10, // Add some spacing
              }}
              //@ts-ignore
              onPress={() => navigation.navigate('driversignup')}>
              <Text
                style={{
                  color: '#0066FF',
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                }}>
                Sign-up
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
                disabled={isloading}
                onPress={handleSubmitButton} // Call the handleSubmitButton function when the button is pressed
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* form */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DriverloginScreen;

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
    // color: '#30D0D0', // Assuming this is the color for the text
    color: '#FF0000',
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
    color: '#000', // Assuming black for the text input
  },
  questionText: {
    fontSize: 20,
    color: '#000000', // Assuming black for the question text
    marginVertical: 10, // Space above and below the question
    textTransform: 'capitalize',
  },
});
