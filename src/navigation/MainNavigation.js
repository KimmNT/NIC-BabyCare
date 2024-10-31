import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import HomeView from '../views/home/home_view';
import DeviceInfoView from '../views/device_info/device_info_view';
import Group from '../views/group/Group';
import Success from '../components/Success';
import TakeQRCode from '../views/group/TakeQRCode';
import ChooseBaby from '../views/group/ChooseBaby';
import GetBaby from '../views/submit/GetBaby';
import SettingView from '../views/setting/setting_view';

const Stack = createNativeStackNavigator();

function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="HomeView">
        <Stack.Screen name="HomeView" component={HomeView} />
        <Stack.Screen name="DeviceInfoView" component={DeviceInfoView} />
        <Stack.Screen name="GroupView" component={Group} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="TakeQRCode" component={TakeQRCode} />
        <Stack.Screen name="TakeStudent" component={ChooseBaby} />
        <Stack.Screen name="Student" component={GetBaby} />
        <Stack.Screen name="Group" component={Group} />
        <Stack.Screen name="SettingView" component={SettingView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;
