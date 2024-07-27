import { createSlice } from '@reduxjs/toolkit';

const redisFormSlice = createSlice({
  name:'redis',
  initialState:{
    port: 6379,
    daemonize: false,
    clusterEnabled: true, 
    masterAuth: '', 
    masteruser: '',
    saveSeconds: 1000,
    saveChanges: 1000,
    appendonly: false,
    appendfsync: 'everysec',
    loglevel: 'notice',
    timeout: 1000,
    rdbcompression: true,
    rdbchecksum: true, 
    resplicaServeStaleData: true,
    maxmemory: 5368709120,
    maxmemoryPolicy: 'noeviction',


  },
  reducers:{
    
    setRedisState:(state,action)=>{
      return action.payload;
    },
    setPort:(state,action)=>{
      state.port = action.payload;
    },
    setDaemonize:(state,action)=>{
      state.daemonize = action.payload;
    },
    setclusterEnabled:(state,action)=>{
      state.clusterEnabled = action.payload;
    },
    setMasterauth:(state,action)=>{
      state.masterAuth = action.payload;
    },
    setMasteruser:(state,action)=>{
      state.masteruser = action.payload;
    },
    setSaveSeconds:(state,action)=>{
      state.saveSeconds = action.payload;
    },
    setSaveChanges:(state,action)=>{
      state.saveChanges = action.payload;
    },
    setAppendonly:(state,action)=>{
      state.appendonly = action.payload;
    },
    setAppendfsync:(state,action)=>{
      state.appendfsync = action.payload;
    },
    setLoglevel:(state,action)=>{
      state.loglevel = action.payload;
    },
    setTimeout:(state,action)=>{
      state.timeout = action.payload;
    },
    setRdbcompression:(state,action)=>{
      state.rdbcompression = action.payload;
    },
    setRdbchecksum:(state,action)=>{
      state.rdbchecksum = action.payload;
    },
    setResplicaServeStaleData:(state,action)=>{
      state.resplicaServeStaleData = action.payload;
    },
    setMaxmemory:(state,action)=>{
      state.maxmemory = action.payload;
    },
    setMaxmemoryPolicy:(state,action)=>{
      state.maxmemoryPolicy = action.payload;
    },
  }
});

export const { setPort, setMasterauth, setMasteruser, setDaemonize, setLoglevel, setTimeout, setSaveChanges, setSaveSeconds, setAppendfsync, setAppendonly, setRdbchecksum, setRdbcompression, setResplicaServeStaleData, setMaxmemory, setMaxmemoryPolicy } = redisFormSlice.actions;
export default redisFormSlice.reducer;