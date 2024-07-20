import React from 'react';
import { useAppDispatch, useAppSelector } from '../Redux/store';
import {
  setSentinelsValue,
  setShardsValue,
  setReplicasValue,
} from '../Redux/slices/sliderSlice';
import SliderComponent from './SliderComponent';

const Slider: React.FC = () => {
  const dispatch = useAppDispatch();
  const sentinelsValue = useAppSelector((state) => state.slider.sentinelsValue);
  const shardsValue = useAppSelector((state) => state.slider.shardsValue);
  const replicasValue = useAppSelector((state) => state.slider.replicasValue);

  return (
    <div className="space-y-4">
      <SliderComponent
        label="Number of sentinels"
        value={sentinelsValue}
        onChange={(value: number) => dispatch(setSentinelsValue(value))}
      />
      <SliderComponent
        label="Number of shards"
        value={shardsValue}
        onChange={(value: number) => dispatch(setShardsValue(value))}
      />
      <SliderComponent
        label="Number of replicas"
        value={replicasValue}
        onChange={(value: number) => dispatch(setReplicasValue(value))}
      />
    </div>
  );
};

export default Slider;
