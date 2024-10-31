import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LogBox} from 'react-native';
import {QRCodeProvider} from './contexts/QRcodeContext';
import {QRlistProvider} from './contexts/QRlistContext';
import MainNavigation from './navigation/MainNavigation';
import {BabyInfoProvider} from './contexts/BabyInfoContext';
import {DeviceInfoProvider} from './contexts/DeviceInfoContext';
import {PermissionsAndroid, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './redux/store';

//remove warning ViewPropTypes will be removed from React Native,
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

async function requestPermissions() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    const allGranted = Object.values(granted).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );
    if (!allGranted) {
      throw new Error('All permissions are required');
    }
  }
}

const App = () => {
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <Provider store={store}>
      <QRCodeProvider>
        <QRlistProvider>
          <BabyInfoProvider>
            <DeviceInfoProvider>
              <SafeAreaProvider>
                <MainNavigation></MainNavigation>
              </SafeAreaProvider>
            </DeviceInfoProvider>
          </BabyInfoProvider>
        </QRlistProvider>
      </QRCodeProvider>
    </Provider>
  );
};

export default App;
