import { createSlice } from "@reduxjs/toolkit";

const awsSlice = createSlice({
  name: 'aws',
  initialState: {
    region: 'US East (N. Virginia)',
    serverType: 't2.micro',
    operatingSystem: 'Linux',
    pricingData: [],
    loading: false,
    error: '',
  },
  reducers: {
    setRegion: (state, action) => {
      state.region = action.payload;
    },
    setServerType: (state, action) => {
      state.serverType = action.payload;
    },
    setOperatingSystem: (state, action) => {
      state.operatingSystem = action.payload;
    },
    setPricingData: (state, action) => {
      state.pricingData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setRegion, setServerType, setOperatingSystem, setPricingData, setLoading, setError } = awsSlice.actions;
export default awsSlice.reducer;
