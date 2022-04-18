import React, {useEffect} from 'react';

import {
  View,
  PermissionsAndroid,
  Alert
} from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LocationEnabler from 'react-native-location-enabler';
const { useLocationSettings } = LocationEnabler;

import SystemNavigationBar from 'react-native-system-navigation-bar';
SystemNavigationBar.navigationHide();
SystemNavigationBar.immersive();
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


  return (
    <View>
      <HomeScreen></HomeScreen>
      {/* <TitleScreen></TitleScreen> */}
    </View>
  );
};


export default App;
