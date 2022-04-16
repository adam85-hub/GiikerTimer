import React, {useEffect} from 'react';

import {
  View,
  PermissionsAndroid,
  Alert
} from 'react-native';

import BluetoothStateManager from 'react-native-bluetooth-state-manager';

import Root from './src/Root';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const App = () => {

  useEffect(() => {
    checkBlePermissions();
    BluetoothStateManager.getState().then(async (state) => { //Ask to turn on bluetooth
      if (state === "PoweredOff") {
        await BluetoothStateManager.requestToEnable();
      }

      return Promise.resolve();
    });
  }, [])

  async function checkBlePermissions() {
    const grantedLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    if (!grantedLocation) await requestLocationPermission();
  }

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
      if (!granted) Alert.alert("Uwaga!", "Bez tego pozwolenia nie można połączyć z kostką");
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <View>
      <Root></Root>
    </View>
  );
};


export default App;
