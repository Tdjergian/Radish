import { configureStore } from '@reduxjs/toolkit';
import redisFormSlice from './slices/redisFormSlice';
import awsSlice from './slices/awsSlice';
import sliderSlice from './slices/sliderSlice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    slider: sliderSlice,
    redis: redisFormSlice,
    aws: awsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch as any;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
