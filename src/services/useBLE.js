/* eslint-disable no-bitwise */
import {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {atob, btoa} from 'react-native-quick-base64';
import {useDispatch, useSelector} from 'react-redux';
import {setDeviceData, setDeviceInfo} from '../redux/slices/deviceInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
const IOT__UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__TX__CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__RX__CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState('');
  const dispatch = useDispatch();
  const {deviceInfo} = useSelector(state => state.deviceInfo);
  // const {deviceInfoArray} = useDeviceInfo();

  const initializeBleManager = () => {
    // Kiểm tra nếu BleManager đã bị hủy thì khởi tạo lại
    if (bleManager === null || bleManager === undefined) {
      bleManager = new BleManager();
    }
  };

  const requestPermissions = async cb => {
    if (Platform.OS === 'android') {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Smart Coach Needs Location Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
          buttonNeutral: 'Maybe later',
        },
      );
      cb(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      cb(true);
    }
  };
  const isDuplicateDevice = (devices, nextDevice) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const startScan = () => {
    console.log('SCANNING');
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Yo, error: ', error);
      }
      if (device && device.name?.includes('BBC')) {
        setAllDevices(prevState => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const clearDevices = () => {
    setAllDevices([]);
  };

  const stopDevice = () => {
    console.log('STOP SCANNING');
    bleManager.stopDeviceScan();
  };

  // const connectToDevice = async device => {
  //   try {
  //     console.log('CONNECTING TO DEVICE:', device.id);
  //     await bleManager.connectToDevice(device.id);
  //     // Stop device scan (assuming startScan and stopScan are functions in your component)
  //     stopScan();
  //     // Discover services and characteristics
  //     await device.discoverAllServicesAndCharacteristics();
  //     // Start streaming data (assuming startStreamingData is a function in your component)
  //     startStreamingData(device);
  //     setConnectedDevice(device);
  //     dispatch(setDeviceInfo(device.id));
  //     console.log('CONNECT SUCCESSFULLY');
  //   } catch (error) {
  //     console.error('Failed to connect to BLE device:', error);
  //     // Log additional information about the device
  //     console.log('Device ID:', device.id);
  //     // Handle the error, e.g., show an alert or set an error state
  //   }
  // };

  const connectToDevice = async device => {
    try {
      console.log('CONNECTING TO DEVICE:', device.name);
      const devicesListJSON = await AsyncStorage.getItem('devices');
      const devicesList = devicesListJSON ? JSON.parse(devicesListJSON) : [];
      const deviceExists = devicesList.some(
        existingDevice => existingDevice.name === device.name,
      );
      await bleManager
        .connectToDevice(device.id)
        .then(() => stopScan())
        .then(async () => {
          setConnectedDevice(device);
          dispatch(setDeviceInfo(device.id));
          await device.discoverAllServicesAndCharacteristics();
          const mtuSize = 256; // Set desired MTU size
          await bleManager.requestMTUForDevice(device.id, mtuSize); // Use bleManager to request MTU

          console.log('Requested MTU Size:', mtuSize);
          startStreamingData(device);
          if (!deviceExists) {
            const updatedDevicesList = [...devicesList, device];
            await AsyncStorage.setItem(
              'devices',
              JSON.stringify(updatedDevicesList),
            );
          }
        });
    } catch (error) {
      console.error('Failed to connect to BLE device:', error);
      // Log additional information about the device
      console.log('Device ID:', device.id);
      // Handle the error, e.g., show an alert or set an error state
    }
  };

  //STOP SCAN
  const stopScan = () => {
    bleManager.stopDeviceScan();
    // setScanning(false);
    console.log('Stopped BLE scan.');
  };

  //CHECK BLUETOOTH STATE
  useEffect(() => {
    // Start scanning when the component mounts
    startScan();

    // Stop scanning when the component unmounts
    // return () => {
    //   console.log('!!!!!!!!!')
    //   stopScan();
    //   // Clear up resources when the component unmounts
    //   bleManager.destroy();
    // };
  }, [bleManager]);

  //CHECK BLUETOOTH STATE
  useEffect(() => {
    const handleBleStateChange = newState => {
      console.log('BLE state changed:', newState);

      if (newState === 'PoweredOn') {
        // Start scanning when Bluetooth is in the PoweredOn state
        startScan();
      } else {
        // Handle other states or show an error message
        console.warn('Bluetooth is not in a powered-on state.');
      }
    };

    const subscription = bleManager.onStateChange(handleBleStateChange, true);

    // Cleanup function
    return () => {
      subscription.remove();
    };
  }, [bleManager]);

  const disconnectFromDevice = () => {
    try {
      console.log('DISCONNECTED');
      bleManager.cancelDeviceConnection(deviceInfo).then(() => {
        dispatch(setDeviceInfo(''));
        dispatch(setDeviceData(''));
        setConnectedDevice('');
        setData('');
      });
    } catch (error) {
      setConnectedDevice('');
    }
  };

  const onDataUpdate = (error, characteristic) => {
    console.log('UPDATING');
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.error('No Data was recieved');
      return;
    }
    const rawData = atob(characteristic.value);
    console.log('Raw data: ' + rawData);
    dispatch(setDeviceData(rawData));
    setData(rawData);
  };

  const startStreamingData = async device => {
    console.log('STREAMING');
    if (device) {
      device.monitorCharacteristicForService(
        IOT__UUID,
        IOT__TX__CHARACTERISTIC,
        onDataUpdate,
      );
    } else {
      console.log('No Device Connected');
    }
  };

  const sendDataToRXCharacteristic = async data => {
    console.log('SENDING');
    if (connectedDevice) {
      try {
        const serviceUUID = IOT__UUID;
        const characteristicUUID = IOT__RX__CHARACTERISTIC;
        const valueBase64 = btoa(data); // Encode the data as Base64

        await connectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          characteristicUUID,
          valueBase64,
          null, // TransactionId (optional)
        );

        console.log('Data sent to RX characteristic:', data);
      } catch (error) {
        console.log('Failed to send data to RX characteristic:', error);
      }
    } else {
      console.log('No device connected. Cannot send data.');
    }
  };
  const totalDevices = allDevices.length;
  return {
    // scanForDevices,
    // scanForPeripherals,
    startScan,
    stopDevice,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
    sendDataToRXCharacteristic,
    clearDevices,
    totalDevices,
  };
}

export default useBLE;
