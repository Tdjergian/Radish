import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ec2Instance, Ec2ClusterDataState } from "../../../types/types";


const realClusterDataSlice = createSlice({
  name:'realClusterData',
  initialState:{
    currentNode: '',
    ec2ClusterData: {},
    redisClusterData: {}
  },
  reducers:{
    setEc2ClusterData:(state, action: PayloadAction<Ec2Instance[]>)=>{
      const newEc2ClusterData: Ec2ClusterDataState = {};
      action.payload.forEach((instance: any)=>{newEc2ClusterData[instance.InstanceId] = instance;})
      state.ec2ClusterData = newEc2ClusterData;
    }, 
    setRedisClusterData:(state, action: PayloadAction<any>)=>{
      const newRedisClusterData: any = {};
      action.payload.forEach((node: any)=>{newRedisClusterData[node.NodeId] = node;})
      state.redisClusterData = action.payload;
    }, 
    setCurrentNode:(state, action: PayloadAction<string>)=>{
      state.currentNode = action.payload;
    }
  }
});

export const { setEc2ClusterData, setRedisClusterData, setCurrentNode } = realClusterDataSlice.actions;
export default realClusterDataSlice.reducer;