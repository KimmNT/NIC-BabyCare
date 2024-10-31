import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  ScrollView,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import DeviceModal from '../../components/modals/DeviceConnectionModal';
import Loading from '../../components/Loading';
import useBLE from '../../services/useBLE';
import Svg, {G, Circle} from 'react-native-svg';
import {BleManager} from 'react-native-ble-plx';
import {home_styles} from '../../themes/styles/home_styles';

import Logo from '../../../assets/images/baby_day.png';
import Logo_night from '../../../assets/images/baby_night.png';

// import Jump1 from '../../assets/images/jump.png';
// import Medal from '../../assets/images/medal.png';

// 247695

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';
import GetClassesModel from '../../components/modals/GetClassesModel';
import {APP_COLORS} from '../../themes/colors';
import DeviceInfoView from '../device_info/device_info_view';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const res = Dimensions.get('window').height;
const bleManager = new BleManager();

const HomeView = ({
  navigation,
  radius = 60,
  strokeWidth = 20,
  color = '#E79C25',
  max = 500,
}) => {
  const {
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
  } = useBLE();
  const route = useRoute();
  const {deviceInfo} = useSelector(state => state.deviceInfo);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGetClassVisibal, setGetClassVisible] = useState(false);
  const [classIdChose, setClassIdChose] = useState('');
  const [classNameChose, setClassNameChose] = useState('');
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [devicesHistory, setDevicesHistory] = useState([]);

  const deviceId = data.substring(0, 5);
  const isCharged = parseInt(data.substring(6, 8));
  const deviceHearRate = parseInt(data.substring(9, 12));
  const deviceSPO = parseInt(data.substring(13, 16));
  const deviceBattery = data.substring(17, 20);
  const deviceTemp = data.substring(21, 26);

  //split the data
  const dataSplited = data.split('|');
  id = [dataSplited[0]].map(item => parseInt(item));
  interval = [dataSplited[1]].map(item => parseInt(item));
  time = Math.round((id * (interval / 1000)) / 60);
  steps = [dataSplited[2]];
  log = [dataSplited[3]];
  lat = [dataSplited[4]];
  acceleration = [dataSplited[5]];
  jumps = [dataSplited[6]];
  jumpspeed = [dataSplited[7]];
  run = ([dataSplited[8]] * 3.6).toFixed(1);
  run_avg = ([dataSplited[9]] * 3.6).toFixed(1);
  run_max = ([dataSplited[10]] * 3.6).toFixed(1);
  run_acc = [dataSplited[11]];
  run_acc_avg = [dataSplited[12]];
  run_acc_max = [dataSplited[13]];
  deviceName = [dataSplited[14]].toString().substring(13);
  batteryRaw = [dataSplited[15]].toString();
  battery = parseInt(batteryRaw);
  calories = Math.round(steps * 0.03);
  // calories = 501;
  caloriesTarget = 500;
  distance = Math.floor(steps * 0.2);

  //CLOCK
  const [clock, setClock] = useState(new Date());

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setClock(new Date());
  //     if (connectedDevice) {
  //       sendDataToRXCharacteristic('read');
  //     }
  //   }, 5000);
  //   // Clean up the interval on component unmount
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [clock]);

  const hours = clock.getHours().toString().padStart(2, '0');
  const minutes = clock.getMinutes().toString().padStart(2, '0');
  const period = hours > 6 && hours < 18 ? 'AM' : 'PM';
  const formattedHours = hours % 12 || 12;
  const timeString = `${formattedHours}:${minutes}`;

  //CHECK BLUETOOTH STATE
  useEffect(() => {
    const handleBleStateChange = newState => {
      console.log('BLE state changed:', newState);
      if (newState === 'PoweredOn') {
        // Start scanning when Bluetooth is in the PoweredOn state
        console.log('BLUETOOTH IS ON');
      } else {
        // Handle other states or show an error message
        Alert.alert(
          '',
          'BLUETOOTH is off.\nPlease turn on BLUETOOTH to continue',
        );
      }
    };
    // const subscription = bleManager.onStateChange(handleBleStateChange, true);
    const subscription = bleManager.onStateChange(handleBleStateChange, true);
    // Cleanup function
    return () => {
      subscription.remove();
    };
  }, [bleManager]);

  useEffect(() => {
    if (isHistoryVisible == true) {
      getDevicesHistory();
    }
  }, [isHistoryVisible]);

  const getDevicesHistory = async () => {
    const devices = await AsyncStorage.getItem('devices');
    if (devices) {
      setDevicesHistory(JSON.parse(devices));
    }
  };

  const reconnectDevice = device => {
    const cutQR = device.id.substring(3);
    allDevices.find(item => {
      const nameSplit = item.name.split('-');
      const idName = [nameSplit[1]].toString();
      if (Platform.OS === 'android' && item.id === device.id) {
        connectToDevice(item);
      } else if (Platform.OS === 'ios' && idName === cutQR) {
        connectToDevice(item);
      }
    });
    setIsHistoryVisible(false);
  };

  //Hide Modal
  const hideModal = () => {
    setIsModalVisible(false);
  };

  //Open Modal, pass connection function
  const openModal = async () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        setIsModalVisible(true);
        startScan();
      }
    });
  };

  //Calories - Donut chart
  const halfCircle = radius + strokeWidth;
  const circleCirumference = 2 * Math.PI * radius;
  const circleRef = useRef();

  const maxPerc = (100 * calories) / max;
  const strokeDashoffset =
    circleCirumference - (circleCirumference * maxPerc) / 100;

  const handleNavigateSetting = () => {
    navigation.navigate('SettingView');
  };

  return (
    <View style={home_styles.container}>
      <View style={home_styles.container}>
        {deviceInfo ? (
          <DeviceInfoView></DeviceInfoView>
        ) : (
          <View
            style={[
              home_styles.container,
              period == 'AM'
                ? {backgroundColor: APP_COLORS.pink}
                : {backgroundColor: APP_COLORS.darkblue},
            ]}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 10,
                right: 10,
              }}
              onPress={() => setIsHistoryVisible(true)}>
              <View
                style={[
                  {
                    backgroundColor:
                      period == 'AM' ? APP_COLORS.darkblue : APP_COLORS.pink,
                    width: res * 0.05,
                    height: res * 0.05,
                    borderRadius: (res * 0.09) / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <Icon
                  name="settings"
                  style={{
                    color:
                      period == 'AM' ? APP_COLORS.pink : APP_COLORS.darkblue,
                    fontSize: res * 0.03,
                  }}
                />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 10,
                right: 10,
              }}
              onPress={() => handleNavigateSetting()}>
              <View
                style={[
                  {
                    backgroundColor:
                      period == 'AM' ? APP_COLORS.darkblue : APP_COLORS.pink,
                    width: res * 0.05,
                    height: res * 0.05,
                    borderRadius: (res * 0.09) / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <Icon
                  name="settings"
                  style={{
                    color:
                      period == 'AM' ? APP_COLORS.pink : APP_COLORS.darkblue,
                    fontSize: res * 0.03,
                  }}
                />
              </View>
            </TouchableOpacity> */}
            <View style={home_styles.content}>
              <View style={home_styles.welcome__container}>
                <View
                  style={{
                    position: 'absolute',
                    top: res * 0.1,
                    width: res * 0.35,
                  }}>
                  <View style={home_styles.start}>
                    <TouchableOpacity
                      onPress={async () => AsyncStorage.clear()}>
                      <Text
                        style={
                          period == 'AM'
                            ? [home_styles.logo__name]
                            : [home_styles.logo__name_night]
                        }>
                        Take Care of
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={home_styles.end}>
                    <Text
                      style={
                        period == 'AM'
                          ? [home_styles.logo__name]
                          : [home_styles.logo__name_night]
                      }>
                      your Baby!
                    </Text>
                  </View>
                </View>
                <View style={home_styles.welcome__logo}>
                  {period == 'AM' ? (
                    <Image source={Logo} style={home_styles.logo__image} />
                  ) : (
                    <Image
                      source={Logo_night}
                      style={home_styles.logo__image}
                    />
                  )}
                </View>
                {classNameChose ? (
                  <View style={home_styles.class__name_container}>
                    <Text style={home_styles.class__name}>
                      {classNameChose}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
            <View style={{alignItems: 'center', zIndex: 1}}>
              <View
                style={{
                  position: 'absolute',
                  bottom: res * 0.06,
                }}>
                <View style={home_styles.scan_button}>
                  <View
                    style={[
                      home_styles.main__box,
                      {
                        backgroundColor: APP_COLORS.pink,
                        width: res * 0.15,
                        height: res * 0.15,
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={openModal}
                      style={[
                        home_styles.main__box,
                        {
                          backgroundColor: APP_COLORS.darkblue,
                          width: res * 0.12,
                          height: res * 0.12,
                        },
                      ]}>
                      <View
                        style={[
                          home_styles.main__box,
                          {
                            backgroundColor: APP_COLORS.darkblue,
                            width: res * 0.09,
                            height: res * 0.09,
                            shadowColor: 'black',
                            shadowOffset: {width: 10, height: 5},
                            shadowOpacity: 1,
                            shadowRadius: 100,
                            elevation: 10,
                          },
                        ]}>
                        <Icon
                          name="qr-code-scanner"
                          style={home_styles.main__icon}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[
                home_styles.welcome__btn_group,
                period == 'AM'
                  ? {backgroundColor: APP_COLORS.darkblue}
                  : {backgroundColor: APP_COLORS.pink},
              ]}></View>
          </View>
        )}
      </View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isHistoryVisible}
        onRequestClose={() => setIsHistoryVisible(false)}>
        <TouchableOpacity
          style={{flex: 1}}
          activeOpacity={1}
          onPressOut={() => setIsHistoryVisible(false)}>
          <View
            style={{
              backgroundColor:
                period == 'AM' ? APP_COLORS.darkblue : APP_COLORS.pink,
              position: 'absolute',
              top: 50,
              right: 10,
              width: res / 4.5,
              maxHeight: 150,
              borderRadius: 8,
              padding: 10,
              shadowColor:
                period == 'AM' ? APP_COLORS.darkblue : APP_COLORS.pink,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <Text
              style={{
                color: period == 'PM' ? APP_COLORS.darkblue : APP_COLORS.pink,
              }}>
              {devicesHistory.length > 0 ? 'Connected devices:' : 'No devices'}
            </Text>
            <FlatList
              data={devicesHistory}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => reconnectDevice(item)}
                    style={{
                      padding: 10,
                    }}>
                    <Text
                      style={{
                        color:
                          period == 'PM'
                            ? APP_COLORS.darkblue
                            : APP_COLORS.pink,
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('SettingView')}>
              <Text
                style={{
                  color: period == 'PM' ? APP_COLORS.darkblue : APP_COLORS.pink,
                }}>
                Setting
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        // scanning={scanForDevices}
        scanning={startScan}
        devices={allDevices}
        stopScan={stopDevice}
        clearDevice={clearDevices}
      />
      {/* <GetClassesModel
        closeModal={hideGetClass}
        visible={isGetClassVisibal}
        sendClassId={handleClassId}
        sendClassName={handleClassName}
      /> */}
    </View>
  );
};

export default HomeView;
