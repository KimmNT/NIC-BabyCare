import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useBLE from '../../services/useBLE';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {APP_COLORS} from '../../themes/colors';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const res = Dimensions.get('window').height;

export default function DeviceInfoView() {
  const {disconnectFromDevice, data} = useBLE();
  const {deviceData} = useSelector(state => state.deviceInfo);

  const deviceId = deviceData.substring(0, 5);
  const isCharged = parseInt(deviceData.substring(6, 8)) == 1 ? true : false;
  const deviceHearRate =
    deviceData == '' ? 0 : parseInt(deviceData.substring(9, 12));
  const deviceSPO =
    deviceData == '' ? 0 : parseInt(deviceData.substring(13, 16));
  const deviceBattery = deviceData.substring(17, 20);
  const deviceTemp = deviceData == '' ? 0 : deviceData.substring(21, 26);

  const [minHeartRate, setMinHeartRate] = useState(0);
  const [maxHeartRate, setMaxHeartRate] = useState(0);
  const [minSpO2, setMinSpO2] = useState(0);
  const [maxSpO2, setMaxSpO2] = useState(0);
  const [minBodyTemp, setMinBodyTemp] = useState(0);
  const [maxBodyTemp, setMaxBodyTemp] = useState(0);

  const retrieveThresholds = async () => {
    try {
      const hrData = await getObject('bbckeystoreHR');
      if (hrData) {
        setMinHeartRate(hrData.min);
        setMaxHeartRate(hrData.max);
      }
      const spo2Data = await getObject('bbckeystoreSOP2');
      if (spo2Data) {
        setMinSpO2(spo2Data.min);
        setMaxSpO2(spo2Data.max);
      }
      const btData = await getObject('bbckeystoreBT');
      if (btData) {
        setMinBodyTemp(btData.min);
        setMaxBodyTemp(btData.max);
      }
    } catch (error) {
      console.log('Error retrieving thresholds:', error);
    }
  };

  useEffect(() => {
    retrieveThresholds();
  }, []);

  // Retrieves stored object from AsyncStorage by key
  const getObject = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('Failed to retrieve object', e);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background}]}>
      <>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.header__id}>
              <Text style={styles.header__id_text}>{deviceId}</Text>
            </View>
            <View style={styles.header__bat}>
              {parseInt(deviceBattery) >= 100 ? (
                <>
                  {isCharged ? (
                    <Icon
                      name="bolt"
                      style={[styles.header__bat_text, styles.full]}
                    />
                  ) : (
                    <Icon
                      name="battery-full"
                      style={[styles.header__bat_text, styles.full]}
                    />
                  )}
                  <Text style={[styles.header__bat_text, styles.full]}>
                    100%
                  </Text>
                </>
              ) : parseInt(deviceBattery) >= 50 ? (
                <>
                  {isCharged ? (
                    <Icon name="bolt" style={styles.header_charge_text} />
                  ) : (
                    <Icon
                      name="battery-full"
                      style={[
                        styles.header__bat_text,
                        {color: isCharged ? '#FF9800' : '#337357'},
                      ]}
                    />
                  )}

                  <Text
                    style={[
                      styles.header__bat_text,
                      {color: isCharged ? '#FF9800' : '#337357'},
                      ,
                    ]}>
                    {deviceBattery.substring(1, 3)}%
                  </Text>
                </>
              ) : (
                <>
                  {isCharged ? (
                    <Icon name="bolt" style={styles.header_charge_text} />
                  ) : (
                    <Icon
                      name="battery-1-bar"
                      style={[styles.header__bat_text, styles.low]}
                    />
                  )}

                  <Text
                    style={[
                      styles.header__bat_text,
                      {color: isCharged ? '#FF9800' : '#FF9800'},
                    ]}>
                    {deviceBattery.substring(1, 3)}%
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={[styles.stat__container, styles.width]}>
            {deviceHearRate === 0 || deviceHearRate === 'NaN' ? (
              <View style={styles.stat__heart_box}>
                <View style={styles.stat__heart_healine}>
                  <Icon name="monitor-heart" style={styles.stat__heart_icon} />
                  <Text style={styles.stat__heart_text}>Heart Rate</Text>
                </View>
                <View style={styles.stat__heart_info}>
                  <ActivityIndicator color={APP_COLORS.pink} />
                </View>
              </View>
            ) : (
              <>
                {deviceHearRate > maxHeartRate ||
                deviceHearRate < minHeartRate ? (
                  <View style={[styles.stat__heart_box, styles.warning]}>
                    <View style={styles.stat__heart_healine}>
                      <Icon
                        name="monitor-heart"
                        style={[styles.stat__heart_icon, {color: '#fff'}]}
                      />
                      <Text style={styles.stat__heart_text}>Heart Rate</Text>
                    </View>
                    <View style={styles.stat__heart_info}>
                      <Text style={styles.stat__heart_num}>
                        {deviceHearRate === 'NaN' ? '' : deviceHearRate}
                      </Text>
                      <Text style={styles.stat__heart_unit}>bpm</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.stat__heart_box}>
                    <View style={styles.stat__heart_healine}>
                      <Icon
                        name="monitor-heart"
                        style={styles.stat__heart_icon}
                      />
                      <Text style={styles.stat__heart_text}>Heart Rate</Text>
                    </View>
                    <View style={styles.stat__heart_info}>
                      <Text style={styles.stat__heart_num}>
                        {deviceHearRate}
                      </Text>
                      <Text style={styles.stat__heart_unit}>bpm</Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
          <View style={[styles.stat__container, styles.divide]}>
            {deviceSPO === 0 || deviceSPO === 'NaN' ? (
              <View style={styles.stat__divide_box}>
                <View style={styles.stat__divide_headline}>
                  <Icon
                    style={[styles.stat__divide_icon, styles.blood]}
                    name="bloodtype"
                  />
                  <Text style={styles.stat__heart_text}>Sp02</Text>
                </View>
                <View style={styles.stat__divide_info}>
                  <Text style={styles.stat__divide_num}>
                    <ActivityIndicator color={APP_COLORS.pink} />
                  </Text>
                  <Text style={styles.stat__heart_unit}>%</Text>
                </View>
              </View>
            ) : (
              <>
                {deviceSPO > maxSpO2 || deviceSPO < minSpO2 ? (
                  <View style={[styles.stat__divide_box, styles.warning]}>
                    <View style={styles.stat__divide_headline}>
                      <Icon
                        style={[
                          styles.stat__divide_icon,
                          styles.blood,
                          {color: '#fff'},
                        ]}
                        name="bloodtype"
                      />
                      <Text style={styles.stat__heart_text}>Sp02</Text>
                    </View>
                    <View style={styles.stat__divide_info}>
                      <Text style={styles.stat__divide_num}>{deviceSPO}</Text>
                      <Text style={styles.stat__heart_unit}>%</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.stat__divide_box}>
                    <View style={styles.stat__divide_headline}>
                      <Icon
                        style={[styles.stat__divide_icon, styles.blood]}
                        name="bloodtype"
                      />
                      <Text style={styles.stat__heart_text}>Sp02</Text>
                    </View>
                    <View style={styles.stat__divide_info}>
                      <Text style={styles.stat__divide_num}>{deviceSPO}</Text>
                      <Text style={styles.stat__heart_unit}>%</Text>
                    </View>
                  </View>
                )}
              </>
            )}
            {deviceTemp === 0 || deviceTemp == 'NaN' ? (
              <View style={styles.stat__divide_box}>
                <View style={styles.stat__divide_headline}>
                  <Icon
                    style={[styles.stat__divide_icon, styles.temp]}
                    name="device-thermostat"
                  />
                  <Text style={styles.stat__heart_text}>Body</Text>
                </View>
                <View style={styles.stat__divide_info}>
                  <Text style={styles.stat__divide_num}>
                    <ActivityIndicator color={APP_COLORS.pink} />
                  </Text>
                  <Text style={styles.stat__heart_unit}>℃</Text>
                </View>
              </View>
            ) : (
              <>
                {maxBodyTemp === 0 ? (
                  <View style={styles.stat__divide_box}>
                    <View style={styles.stat__divide_headline}>
                      <Icon
                        style={[styles.stat__divide_icon, styles.temp]}
                        name="device-thermostat"
                      />
                      <Text style={styles.stat__heart_text}>Body</Text>
                    </View>
                    <View style={styles.stat__divide_info}>
                      <Text style={styles.stat__divide_num}>{deviceTemp}</Text>
                      <Text style={styles.stat__heart_unit}>℃</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    {deviceTemp > maxBodyTemp || deviceTemp < minBodyTemp ? (
                      <View style={[styles.stat__divide_box, styles.warning]}>
                        <View style={styles.stat__divide_headline}>
                          <Icon
                            style={[
                              styles.stat__divide_icon,
                              styles.temp,
                              {color: '#fff'},
                            ]}
                            name="device-thermostat"
                          />
                          <Text style={styles.stat__heart_text}>Body</Text>
                        </View>
                        <View style={styles.stat__divide_info}>
                          <Text style={styles.stat__divide_num}>
                            {deviceTemp}
                          </Text>
                          <Text style={styles.stat__heart_unit}>℃</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.stat__divide_box}>
                        <View style={styles.stat__divide_headline}>
                          <Icon
                            style={[styles.stat__divide_icon, styles.temp]}
                            name="device-thermostat"
                          />
                          <Text style={styles.stat__heart_text}>Body</Text>
                        </View>
                        <View style={styles.stat__divide_info}>
                          <Text style={styles.stat__divide_num}>
                            {deviceTemp}
                          </Text>
                          <Text style={styles.stat__heart_unit}>℃</Text>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </View>
          <View style={styles.measure}>
            <Text style={styles.measure__text}>
              process will take a few minutes
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Lưu ý', 'Bạn có muốn ngắt kết nối với thiết bị', [
                {
                  text: 'Có',
                  style: 'destructive',
                  onPress: () => disconnectFromDevice(),
                },
                {text: 'Không'},
              ]);
            }}
            style={styles.disconnect__container}>
            <Text style={styles.disconnect__text}>disconnect</Text>
            <View style={styles.disconnect__btn_icon}>
              <Icon style={styles.disconnect__icon} name="chevron-right" />
            </View>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#F1E2E2',
  },
  unable__container: {
    paddingVertical: res * 0.02,
    marginTop: res * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  unable: {
    fontSize: res * 0.025,
    fontWeight: '600',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: res * 0.05,
    paddingHorizontal: res * 0.04,
    marginTop: res * 0.02,
    // borderBottomLeftRadius: res * 0.03,
    // borderBottomRightRadius: res * 0.03,
    borderRadius: res * 0.03,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  header__id: {},
  header__id_text: {
    color: '#374259',
    fontWeight: '900',
    fontSize: res * 0.03,
  },
  header_charge_text: {
    color: '#FF9800',
    fontWeight: '600',
    fontSize: res * 0.04,
  },
  header__bat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header__bat_text: {
    fontWeight: '900',
    fontSize: res * 0.03,
  },
  full: {
    color: '#337357',
  },
  low: {
    color: '#FF9800',
  },
  stat__container: {
    paddingHorizontal: res * 0.07,
    marginTop: res * 0.04,
  },
  width: {
    width: '100%',
  },
  divide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat__heart_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374259',
    padding: res * 0.02,
    borderRadius: res * 0.02,
  },
  warning: {
    backgroundColor: '#EE4266',
  },
  stat__heart_healine: {
    gap: res * 0.01,
  },
  stat__heart_icon: {
    fontSize: res * 0.1,
    color: '#41B06E',
  },
  stat__heart_text: {
    fontSize: res * 0.025,
    fontWeight: '900',
    color: '#FFF',
  },
  stat__heart_info: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: res * 0.01,
  },
  stat__heart_num: {
    fontSize: res * 0.05,
    color: '#FFF',
    fontWeight: '900',
  },
  stat__heart_unit: {
    fontSize: res * 0.02,
    color: '#FFF',
  },
  stat__divide_box: {
    width: '45%',
    backgroundColor: '#374259',
    paddingVertical: res * 0.02,
    paddingHorizontal: res * 0.01,
    borderRadius: res * 0.02,
    gap: res * 0.02,
  },
  stat__divide_headline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: res * 0.08,
  },
  stat__divide_icon: {
    fontSize: res * 0.05,
    width: '40%',
  },
  blood: {
    color: '#5DEBD7',
  },
  temp: {
    color: '#FA7070',
  },
  stat__divide_name: {
    fontSize: res * 0.02,
    fontWeight: '900',
    color: '#FFF',
  },
  stat__divide_info: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: res * 0.01,
  },
  stat__divide_num: {
    fontSize: res * 0.05,
    color: '#FFF',
    fontWeight: '900',
  },
  stat__divide_unit: {
    fontSize: res * 0.02,
    color: '#FFF',
  },
  measure: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: res * 0.05,
  },
  measure__text: {
    fontSize: res * 0.02,
    fontWeight: '900',
    color: '#5C8984',
    fontStyle: 'italic',
  },
  disconnect__container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: res * 0.02,
    position: 'absolute',
    bottom: res * 0.02,
    right: 0,
    left: 0,
    paddingLeft: 40,
  },
  disconnect__text: {
    textTransform: 'uppercase',
    fontSize: res * 0.02,
    fontWeight: '900',
    color: '#D37676',
  },
  disconnect__btn_icon: {
    width: res * 0.07,
    height: res * 0.07,
    borderRadius: (res * 0.07) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D37676',
  },
  disconnect__icon: {
    fontSize: res * 0.04,
    fontWeight: '900',
    color: '#FFF',
  },
});
