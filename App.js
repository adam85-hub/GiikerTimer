import React, {useEffect, useState} from 'react';

import {
  View,
  PermissionsAndroid,
  Alert
} from 'react-native';

import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LocationEnabler from 'react-native-location-enabler';

const { useLocationSettings } = LocationEnabler;

import Root from './src/Root';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const App = () => {
  const [locationEnabled, requestLocationEnabled] = useLocationSettings({
    needBle: true
  });


  useEffect(() => {
    (async () => {
      await checkBlePermissions();
      if (!locationEnabled) requestLocationEnabled();
    })();
  }, [])

  useEffect(() => {
    if (locationEnabled !== true) return;

    (async () => {
      const bluetoothState = await BluetoothStateManager.getState();
      if (bluetoothState === "PoweredOff") {
        await BluetoothStateManager.requestToEnable();
      }      
    })();
  }, [locationEnabled])

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
