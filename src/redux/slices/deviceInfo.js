import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  deviceInfo: '',
  deviceData: '',
  isLoading: false,
};

export const deviceInfoSlice = createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setDeviceInfo: (state, action) => {
      state.deviceInfo = action.payload;
    },
    setDeviceData: (state, action) => {
      state.deviceData = action.payload;
    },
  },
});

export const {setIsLoading, setDeviceInfo, setDeviceData} =
  deviceInfoSlice.actions;
export default deviceInfoSlice.reducer;
