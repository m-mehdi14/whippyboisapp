/**
 * @format
 */
import PushNotification from 'react-native-push-notification';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

const createChannels = () => {
  PushNotification.createChannel({
    channelId: 'test-channel', // ensure the channel ID matches what you use in notification
    channelName: 'Test Notification Channel',
  });
};

createChannels(); // Call this method at app startup

AppRegistry.registerComponent(appName, () => App);
