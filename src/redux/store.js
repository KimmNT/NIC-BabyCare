import {configureStore} from '@reduxjs/toolkit';
import deviceInfoReducer from './slices/deviceInfo';

export const store = configureStore({
  reducer: {
    deviceInfo: deviceInfoReducer,
  },
});
