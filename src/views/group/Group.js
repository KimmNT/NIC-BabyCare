import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//USE CONTEXT
import {useQRCodeContext} from '../../contexts/QRcodeContext.js';
import {useQRListContext} from '../../contexts/QRlistContext.js';
import {useBabyInfo} from '../../contexts/BabyInfoContext.js';

//BLE FUNCTIONAL
import BluetoothFunctional from '../../services/BluetoothFunctional.js';

//MODAL GET CLASS ID
import GetClassesModel from '../../components/modals/GetClassesModel.js';

//STYLE
import group_styles from '../../themes/styles/group_style.js';

//IMAGE
// import BackGround from '../../../assets/images/background.png';
import NonAva from '../../../assets/images/user_default.png';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';

//SWIPE ANIMATION
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {G} from 'react-native-svg';

const res = Dimensions.get('window').height;

export default function Group({navigation}) {
  //BLOCK THE SWIPE BACK
  navigation.setOptions({
    gestureEnabled: false,
  });
  const {
    startScan,
    stopDevice,
    allDevices,
    requestPermissions,
    connectToDevice,
    connectToDeviceAndroid,
    connectedDevice,
    readDevice,
    disconnectFromDevice,
    disconnectFromDeviceAndroid,
  } = BluetoothFunctional();
  const {scannedQRCodes} = useQRCodeContext();
  const {qrList} = useQRListContext();
  const [isGetClassVisibal, setGetClassVisible] = useState(false);
  const [classIdChose, setClassIdChose] = useState('');
  const {babyInfoArray} = useBabyInfo();
  const [startGetting, setStartGetting] = useState(false);
  const [startCleaning, setStartCleaning] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [classNameChose, setClassNameChose] = useState(
    'Choose your class/club',
  );

  const IOT__UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';

  useEffect(() => {
    Platform.OS == 'android' && setIsAndroid(true);
  }, []);

  //LOADING BLE DEVICES
  useEffect(() => {
    // Request location permission before starting BLE scan
    requestPermissions(granted => {
      if (granted) {
        // Start BLE scan when permission is granted
        startScan(IOT__UUID);
      } else {
        Alert.alert(
          'Warning',
          'You must grant Location Permission to using this function',
        );
      }
    });

    setTimeout(() => {
      stopDevice();
      setIsScanning(false);
    }, 10000);

    // Cleanup function to stop BLE scan when the component unmounts
    return () => {
      stopDevice();
    };
  }, []);

  if (connectedDevice && !isAndroid) {
    if (startGetting) {
      setTimeout(() => {
        readDevice('read');
      }, 1000);
    }
    if (startCleaning) {
      setTimeout(() => {
        readDevice('delete');
      }, 1000);
      setStartCleaning(false);
    }
  }

  //HIDE CLASS MODAL
  const hideGetClass = () => {
    setGetClassVisible(false);
  };
  //OPEN GetClassModel
  const openGetClassModel = () => {
    setGetClassVisible(true);
  };
  //HOLD CLASS ID SENT BACK FROM CLASS MODAL
  const handleClassId = classId => {
    setClassIdChose(classId);
  };
  //HOLD CLASS NAME SENT BACK FROM CLASS MODAL
  const handleClassName = className => {
    setClassNameChose(className);
  };

  //HANDLE OPEN CAMERA
  const handleOpenCamera = () => {
    if (classNameChose != 'Choose your class/club') {
      navigation.navigate('TakeQRCode', {classIdChose});
    } else {
      openGetClassModel();
    }
  };

  //FUNCTION GET DEVICE'S VALUE
  const handleGetValue = async qrcode => {
    try {
      console.log('START HANDLE');
      setStartGetting(true);
      disconnectFromDevice();
      allDevices.find(item => {
        const itemNameCut = item.name.substring(4);
        if (qrcode == itemNameCut) {
          connectToDevice(item);
        }
      });
      // await readDevice('read');
      disconnectFromDevice();
      //   setStartGetting(false);
      console.log('END HANDLE');
    } catch (error) {
      console.error('Error in handleGetValue:', error);
    }
  };

  const handleDeviceActions = async (type, data) => {
    setIsProcessing(true);
    for (let i = 0; i < qrList.length; i++) {
      var QR = qrList[i].qrcode;
      const hasDevice = allDevices.findIndex(
        item => item.name.substring(4) == QR,
      );
      if (hasDevice !== -1) {
        const device = allDevices[hasDevice];
        switch (type) {
          case 'read':
            await connectToDeviceAndroid(device, type);
            break;
          case 'delete':
            await connectToDeviceAndroid(data, type);
            break;
          case 'disconnect':
            disconnectFromDeviceAndroid(device);
            break;
          default:
            break;
        }
      }
      // for (let j = 0; j < allDevices.length; j++) {
      //   var device = allDevices[j].name.substring(4);
      //   if (device === QR) {
      //     switch (type) {
      //       case 'read':
      //         await connectToDeviceAndroid(allDevices[j], type);
      //         break;
      //       case 'delete':
      //         await connectToDeviceAndroid(data, type);
      //         break;
      //       case 'disconnect':
      //         disconnectFromDeviceAndroid(allDevices[j]);
      //         break;
      //     }
      //   }
      // }
    }
    setIsProcessing(false);
  };

  //HANDLE LOOP GET DEVICE'S VALUE
  const handleGet = async () => {
    const promises = qrList.map(async item => {
      try {
        await handleGetValue(item.qrcode);
        // Wait for 2 seconds before calling readDevice
        await new Promise(resolve => setTimeout(resolve, 2000));
        await readDevice('read');
      } catch (error) {
        console.error(`Error processing QR code ${item.qrcode}:`, error);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // This code will execute when all promises are resolved
    // setDone(true);
    setStartGetting(true);
  };

  const onPressRefresh = () => {
    if (isAndroid) {
      handleDeviceActions('read');
    } else {
      handleGet();
    }
  };

  //HANDLE DISCONNECT
  const handleDisconnect = () => {
    handleDeviceActions('disconnect');
    setStartGetting(false);
  };

  //HANDLE SAVE
  const handleSave = () => {
    Alert.alert('Warning', "Do you want to save students's information ?", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel saving group'),
      },
      {
        text: 'OK',
        onPress: () => navigation.navigate('Submitting', {classIdChose}),
      },
    ]);
  };

  //DELETE SWIPED STUDENT
  const rightSwipeActions = qrcode => {
    return (
      <TouchableOpacity
        onPress={() => handleClearDevice(qrcode)}
        style={group_styles.group__btn_clear}>
        {isProcessing ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Icon name="cleaning-services" style={group_styles.btn__clear_icon} />
        )}
      </TouchableOpacity>
    );
  };

  const handleClearDevice = qrcode => {
    if (startGetting) {
      Alert.alert('Warning', 'This action cannot be done while fetching data');
    } else {
      if (isAndroid) {
        allDevices.find(item => {
          const hasItem = item.name.substring(4) == qrcode;
          if (hasItem) {
            handleDeviceActions('delete', item);
          }
          // disconnectFromDeviceAndroid(item);
        });
      } else {
        disconnectFromDevice();
        allDevices.find(item => {
          const itemNameCut = item.name.substring(4);
          if (qrcode == itemNameCut) {
            connectToDevice(item);
          }
        });
        disconnectFromDevice();
      }
    }
  };

  return (
    <View style={group_styles.group__container}>
      {/* <Image source={BackGround} style={group_styles.group__img_background} /> */}
      {/* HEADER */}
      <View style={group_styles.group__content}>
        <Text style={group_styles.group__title}>group devices</Text>
        <View style={group_styles.group__header}>
          <View style={group_styles.header__total}>
            <Text style={group_styles.total__count}>Total devices:</Text>
            <Text style={group_styles.total__number}>
              {scannedQRCodes.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={openGetClassModel}
            style={group_styles.header__classes}>
            <Text style={group_styles.classes__name}>{classNameChose}</Text>
          </TouchableOpacity>
        </View>
        {/* LIST */}
        <ScrollView
          style={group_styles.group__boxes}
          showsVerticalScrollIndicator={false}>
          <View style={group_styles.group__item_list}>
            <View style={group_styles.group__item_imagelist}>
              {babyInfoArray.map((student, index) => (
                <View style={group_styles.group__item_imagelist_item}>
                  {student.stuAva ? (
                    <View
                      style={[
                        group_styles.group__item_image_layer,
                        group_styles.shadow,
                      ]}>
                      <Image
                        key={index}
                        source={{uri: student.stuAva}}
                        style={group_styles.group__item_image}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        group_styles.group__item_image_layer,
                        group_styles.shadow,
                      ]}>
                      <Image
                        key={index}
                        source={NonAva}
                        style={group_styles.group__item_image}
                      />
                    </View>
                  )}
                  <View style={group_styles.group__item_name}>
                    <Text style={group_styles.student__name}>
                      {student.stuName}
                    </Text>
                  </View>
                  <View style={group_styles.group__item_qrcode}>
                    <Text style={group_styles.qrocde_value}>
                      {student.qrcode.substring(9, 15)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={group_styles.group__item_information}>
              {scannedQRCodes.map((device, index) => (
                <GestureHandlerRootView
                  style={[group_styles.group__item, group_styles.shadow]}>
                  <Swipeable
                    style={group_styles.group__item_content}
                    renderRightActions={() => rightSwipeActions(device.qrcode)}
                    key={index}>
                    {/* STATS */}
                    <View style={group_styles.group__item_stat}>
                      {/* WHEN THE RESULT NOT IN NUMBER TYPE */}
                      {device.steps == 'NaN' ? (
                        <View style={group_styles.group__item_notasnumber}>
                          <Icon
                            name="sensors-off"
                            style={group_styles.out__of_range}
                          />
                          <Text style={group_styles.out__of_range_text}>
                            Try again later
                          </Text>
                        </View>
                      ) : (
                        <></>
                      )}
                      {/* TIME */}
                      {device.time == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={group_styles.stat__info}>
                          <View style={group_styles.stat__header}>
                            <Icon
                              name="schedule"
                              style={[group_styles.stat__icon, group_styles.time]}
                            />
                            <Text style={group_styles.stat__unit}>mins</Text>
                          </View>
                          <Text style={group_styles.stat__number}>
                            {parseInt(device.time).toFixed(0)}
                          </Text>
                        </View>
                      )}
                      {/* STEPS */}
                      {device.steps == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={group_styles.stat__info}>
                          <View style={group_styles.stat__header}>
                            <Icon
                              name="directions-walk"
                              style={[group_styles.stat__icon, group_styles.step]}
                            />
                            <Text style={group_styles.stat__unit}>steps</Text>
                          </View>
                          <Text style={group_styles.stat__number}>
                            {parseInt(device.steps).toFixed(0)}
                          </Text>
                        </View>
                      )}
                      {/* CALORIES */}
                      {device.calories == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={group_styles.stat__info}>
                          <View style={group_styles.stat__header}>
                            <Icon
                              name="local-fire-department"
                              style={[
                                group_styles.stat__icon,
                                group_styles.calories,
                              ]}
                            />
                            <Text style={group_styles.stat__unit}>cal</Text>
                          </View>
                          <Text style={group_styles.stat__number}>
                            {parseInt(device.calories).toFixed(0)}
                          </Text>
                        </View>
                      )}
                      {/* DISTANCE */}
                      {device.distance == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={group_styles.stat__info}>
                          <View style={group_styles.stat__header}>
                            <Icon
                              name="run-circle"
                              style={[
                                group_styles.stat__icon,
                                group_styles.distance,
                              ]}
                            />
                            <Text style={group_styles.stat__unit}>m</Text>
                          </View>
                          <Text style={group_styles.stat__number}>
                            {parseInt(device.distance).toFixed(0)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Swipeable>
                </GestureHandlerRootView>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      {/* CONTROLLER */}
      {/* CREATE BUTTON */}
      <TouchableOpacity
        onPress={handleOpenCamera}
        style={group_styles.group__btn_create}>
        <Icon name="add" style={group_styles.btn__create_icon} />
      </TouchableOpacity>
      {/* GET LATEST, DISCONNECT, UPLOAD */}
      {startGetting ? (
        <TouchableOpacity
          onPress={handleDisconnect}
          style={group_styles.group__btn_disconnect}>
          <Icon name="cancel" style={group_styles.btn__disconnect_icon} />
        </TouchableOpacity>
      ) : (
        <>
          {scannedQRCodes.length > 0 ? (
            <View style={group_styles.group__btn_control}>
              <TouchableOpacity
                onPress={onPressRefresh}
                style={group_styles.group__btn_get}>
                {isProcessing ? (
                  <ActivityIndicator color={'white'} />
                ) : (
                  <Icon name="refresh" style={group_styles.btn__get_icon} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={group_styles.group__btn_upload}>
                <Icon name="upload" style={group_styles.btn__upload_icon} />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </>
      )}
      {/* MODEL */}
      <GetClassesModel
        closeModal={hideGetClass}
        visible={isGetClassVisibal}
        sendClassId={handleClassId}
        sendClassName={handleClassName}
      />
      {isScanning && (
        <View style={group_styles.loading}>
          <ActivityIndicator size={'large'} color={'white'}></ActivityIndicator>
          <Text
            style={{
              fontSize: 19,
              color: 'white',
            }}>
            Please wait...
          </Text>
        </View>
      )}
    </View>
  );
}
