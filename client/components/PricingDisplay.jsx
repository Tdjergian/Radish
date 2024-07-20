import React from 'react';
import { useSelector } from 'react-redux';

const PricingDisplay = () => {
  const pricingData = useSelector((state) => state.aws.pricingData);
  const loading = useSelector((state) => state.aws.loading);
  const error = useSelector((state) => state.aws.error);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container bg-black text-white p-4">
      <h2 className="text-center">Pricing Data</h2>
      {pricingData ? (
        <div className="pricing-data">
          <pre>{JSON.stringify(pricingData, null, 2)}</pre>
        </div>
      ) : (
        <div>No pricing data available.</div>
      )}
    </div>
  );
};

export default PricingDisplay;
