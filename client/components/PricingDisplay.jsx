import React from 'react';
import { useSelector } from 'react-redux';

const PricingDisplay = () => {
  const pricingData = useSelector((state) => state.aws.pricingData);
  const loading = useSelector((state) => state.aws.loading);
  const error = useSelector((state) => state.aws.error);

  const sortedPricingData = [...pricingData].sort((a, b) => a.monthlyTotalPrice - b.monthlyTotalPrice);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

    const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#2c3e50', 
    padding: '1rem',
    borderRadius: '0.5rem',
  };

  const cardStyle = {
    border: '1px solid #ddd',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ecf0f1'
  };

  const textCenterStyle = {
    textAlign: 'center'
  };

  const marginBottomStyle = {
    marginBottom: '1rem'
  };

  const cardTextStyle = {
    color: '#000000'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ ...textCenterStyle, ...marginBottomStyle }}>Pricing Data</h2>
      <div style={{ ...textCenterStyle, ...marginBottomStyle }}>
      </div>
      {sortedPricingData.length > 0 ? (
        <div className="pricing-data">
          {sortedPricingData.map((item, index) => (
            <div key={index} style={cardStyle}>
              <p style={cardTextStyle}>{item.description}</p>
              <p style={cardTextStyle}>Payment Terms: {item.paymentTerms}</p>
              <p style={cardTextStyle}>Purchase Option: {item.purchaseOption}</p>
              <p style={cardTextStyle}>Price Per Unit: ${item.pricePerUnit}</p>
              <p style={cardTextStyle}>Unit: {item.unit}</p>
              <p style={cardTextStyle}>Lease Contract Length: {item.leaseContractLength}</p>
              <p style={cardTextStyle}>Upfront Fee: ${item.upfrontFee}</p>
              <p style={cardTextStyle}>Monthly Total Price: ${item.monthlyTotalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No pricing data available.</div>
      )}
    </div>
  );
};

export default PricingDisplay;