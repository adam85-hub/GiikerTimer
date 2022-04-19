import React, {useEffect, useState} from 'react';

import {
  View,
  PermissionsAndroid,
  Alert,
  AppState
} from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LocationEnabler from 'react-native-location-enabler';
const { useLocationSettings } = LocationEnabler;

import SystemNavigationBar from 'react-native-system-navigation-bar';
SystemNavigationBar.navigationHide();
SystemNavigationBar.stickyImmersive();
SystemNavigationBar.fullScreen(true);

import HomeScreen from './src/HomeScreen';
import TitleScreen from './src/TitleScreen';


const App = () => {
  //#region Permissions
  const [locationEnabled, requestLocationEnabled] = useLocationSettings({
    needBle: true
  });

  useEffect(() => {
    (async () => {
      const bluetoothPerm1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      const bluetoothPerm2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
      
      if (bluetoothPerm1 == false || bluetoothPerm2 == false) {
        const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION]);
        console.log(granted);
      }
      
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
  //#endregion

  const [titleDisplayed, setTitleDisplayed] = useState(true);

  useEffect(() => {
    const sub = AppState.addEventListener("change", () => {
      SystemNavigationBar.fullScreen(true);
    })

    return () => {
      sub.remove();
    }
  }, [])

  return (
    <View>
      {titleDisplayed ? <TitleScreen onPress={() => setTitleDisplayed(false)} /> : <HomeScreen />}
    </View>
  );
};


export default App;
