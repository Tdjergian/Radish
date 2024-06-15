import React, { useState } from 'react';
import PricingForm from '../components/PricingForm';
import AwsPricingList from '../components/AwsPricingList';

const PricingPage = () => {
  const [pricingData, setPricingData] = useState([]);

  const handlePricingData = (data) => {
    setPricingData(data);
  };

  return (
    <div className="w-full p-4 bg-slate-800">
      <PricingForm onPricingData={handlePricingData} />
      <AwsPricingList pricingData={pricingData} />
    </div>
  );
};

export default PricingPage;