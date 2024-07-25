import React from 'react';

const PricingCard = ({ data }) => {
  return (
    <div className="pricing-card border border-gray-300 p-4 mb-4 rounded-md shadow-sm bg-white text-black">
      <p><strong>Description:</strong> {data.description}</p>
      <p><strong>Payment Terms:</strong> {data.paymentTerms}</p>
      <p><strong>Purchase Option:</strong> {data.purchaseOption}</p>
      <p><strong>Price Per Unit:</strong> {data.pricePerUnit}</p>
      <p><strong>Unit:</strong> {data.unit}</p>
      <p><strong>Lease Contract Length:</strong> {data.leaseContractLength}</p>
      <p><strong>Upfront Fee:</strong> {data.upfrontFee}</p>
      <p><strong>Monthly Total Price:</strong> {data.monthlyTotalPrice}</p>
    </div>
  );
};

export default PricingCard;
