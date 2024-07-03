// PricingPage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import PricingForm from '../components/PricingForm';
import AwsPricingList from '../components/AwsPricingList';

const PricingPage = () => {
  const pricingData = useSelector(state => state.aws.pricingData);

  return (
    <div className="w-full p-4 bg-slate-800">
      {pricingData.length > 0 ? (
        <AwsPricingList pricingData={pricingData} />
      ) : (
        <PricingForm />
      )}
    </div>
  );
};

export default PricingPage;
