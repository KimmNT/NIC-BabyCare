import {
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import {home_styles} from '../../themes/styles/home_styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
import {APP_COLORS} from '../../themes/colors';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const res = Dimensions.get('window').height;

export default function SettingView() {
  const navigation = useNavigation();
  const [clock, setClock] = useState(new Date());
  const hours = clock.getHours().toString().padStart(2, '0');
  const period = hours > 6 && hours < 18 ? 'AM' : 'PM';

  const [minHeartRate, setMinHeartRate] = useState(0);
  const [maxHeartRate, setMaxHeartRate] = useState(0);
  const [minSpO2, setMinSpO2] = useState(0);
  const [maxSpO2, setMaxSpO2] = useState(0);
  const [minBodyTemp, setMinBodyTemp] = useState(0);
  const [maxBodyTemp, setMaxBodyTemp] = useState(0);

  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    getObject('bbckeystoreHR').then(data => {
      setMinHeartRate(data.min);
      setMaxHeartRate(data.max);
    });
    getObject('bbckeystoreHR').then(data => {
      console.log(data);
    });
    getObject('bbckeystoreSOP2').then(data => {
      setMinSpO2(data.min);
      setMaxSpO2(data.max);
    });
    getObject('bbckeystoreBT').then(data => {
      setMinBodyTemp(data.min);
      setMaxBodyTemp(data.max);
    });
  }, []);

  // Storing an object
  const storeObject = async (key, object) => {
    try {
      const jsonValue = JSON.stringify(object);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('Failed to store object', e);
    }
  };

  // Retrieving an object
  const getObject = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('Failed to retrieve object', e);
    }
  };

  const handleSubmit = async () => {
    const storeHR = {min: minHeartRate, max: maxHeartRate};
    const storeSPO2 = {min: minSpO2, max: maxSpO2};
    const storeBT = {min: minBodyTemp, max: maxBodyTemp};
    await storeObject('bbckeystoreHR', storeHR);
    await storeObject('bbckeystoreSOP2', storeSPO2);
    await storeObject('bbckeystoreBT', storeBT);
    setIsSave(true);
  };

  return (
    <SafeAreaView
      style={[
        home_styles.container,
        period == 'AM'
          ? {backgroundColor: APP_COLORS.pink}
          : {backgroundColor: APP_COLORS.darkblue},
        styles.setting__container,
      ]}>
      <TouchableOpacity
        style={styles.setting__back}
        onPress={() => navigation.goBack()}>
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
            name="arrow-back-ios"
            style={{
              color: period == 'AM' ? APP_COLORS.pink : APP_COLORS.darkblue,
              fontSize: res * 0.03,
              paddingLeft: 10,
            }}
          />
        </View>
      </TouchableOpacity>
      <KeyboardAvoidingView behavior="padding" style={styles.setting__content}>
        <ScrollView>
          <View style={styles.setting__item}>
            <Icon
              name="monitor-heart"
              style={[styles.setting__item_title, styles.heart]}
            />
            <View style={styles.setting__item_input}>
              <View style={styles.setting__item_value}>
                <Text style={styles.item__title}>Min (bpm)</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.item__input}
                  value={minHeartRate}
                  onChangeText={newText => setMinHeartRate(newText)}
                />
              </View>
              <View style={styles.setting__item_value}>
                <Text style={styles.item__title}>Max (bpm)</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.item__input}
                  value={maxHeartRate}
                  onChangeText={newText => setMaxHeartRate(newText)}
                />
              </View>
            </View>
          </View>
          <View style={styles.setting__item}>
            <Icon
              name="bloodtype"
              style={[styles.setting__item_title, styles.spo2]}
            />
            <View style={styles.setting__item_input}>
              <View style={styles.setting__item_value}>
                <Text style={styles.item__title}>Min (%)</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.item__input}
                  value={minSpO2}
                  onChangeText={newText => setMinSpO2(newText)}
                />
              </View>
              <View style={styles.setting__item_value}>
                <Text style={styles.item__title}>Max (%)</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.item__input}
                  value={maxSpO2}
                  onChangeText={newText => setMaxSpO2(newText)}
                />
              </View>
            </View>
          </View>
          <View style={styles.setting__item}>
            <Icon
              name="device-thermostat"
              style={[styles.setting__item_title, styles.bodytemp]}
            />
            <View style={styles.setting__item_input}>
              <View style={styles.setting__item_value}>
                <Text style={styles.item__title}>Min (℃)</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.item__input}
                  value={minBodyTemp}
                  onChangeText={newText => setMinBodyTemp(newText)}
                />
              </View>
              <View style={styles.setting__item_value}>
                <Text style={styles.item__title}>Max (℃)</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.item__input}
                  value={maxBodyTemp}
                  onChangeText={newText => setMaxBodyTemp(newText)}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.setting__bt_container}>
        <TouchableOpacity
          style={[
            {
              backgroundColor:
                period == 'AM' ? APP_COLORS.darkblue : APP_COLORS.pink,
              alignItems: 'center',
              paddingVertical: res * 0.02,
              paddingHorizontal: res * 0.03,
              borderRadius: res * 0.005,
            },
          ]}
          onPress={handleSubmit}>
          <Text
            style={[
              {
                textTransform: 'uppercase',
                fontSize: res * 0.02,
                color: period == 'AM' ? APP_COLORS.pink : APP_COLORS.darkblue,
                fontWeight: '600',
              },
            ]}>
            {isSave ? 'save successfully' : 'save now'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  setting__container: {
    padding: res * 0.02,
  },
  setting__back: {
    marginBottom: res * 0.05,
  },
  setting__content: {
    width: '100%',
  },
  setting__item: {
    backgroundColor: '#FFF',
    marginBottom: res * 0.05,
    borderRadius: res * 0.01,
    padding: res * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setting__item_title: {
    fontSize: res * 0.1,
    color: '#000',
  },
  heart: {
    color: '#41B06E',
  },
  spo2: {
    color: '#5DEBD7',
  },
  bodytemp: {
    color: '#FA7070',
  },
  setting__item_input: {
    flexDirection: 'column',
    gap: res * 0.01,
  },
  setting__item_value: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: res * 0.02,
    justifyContent: 'flex-end',
  },
  item__title: {
    color: '#000',
    fontWeight: '600',
  },
  item__input: {
    paddingHorizontal: res * 0.02,
    textAlign: 'center',
    borderBottomColor: '#000',
    borderStyle: 'solid',
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    color: '#000',
    fontSize: res * 0.02,
    fontWeight: '600',
  },
  item__unit: {
    color: '#000',
  },
  setting__bt_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  setting__btn: {
    textTransform: 'uppercase',
    fontSize: res * 0.03,
    color: '#FFF',
  },
});
