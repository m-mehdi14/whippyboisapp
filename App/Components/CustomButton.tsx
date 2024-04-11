/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface CustomButtonProps {
  onPress: () => void;
  style: {};
  text: string;
}

const CustomButton = ({onPress, style, text}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{...styles.buttonStyle, ...style}}>
      <Text
        style={{
          textAlign: 'center',
          color: '#000',
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonStyle: {
    height: 48,
    width: 350,
    backgroundColor: '#FECC1D',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
});
