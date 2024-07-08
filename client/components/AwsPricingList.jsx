// AwsPricingList.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const AwsPricingList = () => {
  // Fetch pricing data from Redux store
  const pricingData = useSelector(state => state.aws.pricingData);

  return (
    <div className="aws-pricing-list">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Payment Terms</th>
            <th>Purchase Option</th>
            <th>Price Per Unit</th>
            <th>Unit</th>
            <th>Lease Contract Length</th>
            <th>Upfront Fee</th>
            <th>Monthly Total Price</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pricingData.length > 0 ? (
            pricingData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.paymentTerms}</td>
                <td>{item.purchaseOption}</td>
                <td>{item.pricePerUnit}</td>
                <td>{item.unit}</td>
                <td>{item.leaseContractLength}</td>
                <td>{item.upfrontFee}</td>
                <td>{item.monthlyTotalPrice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">No pricing data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Optional PropTypes validation if needed
AwsPricingList.propTypes = {
  pricingData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      paymentTerms: PropTypes.string.isRequired,
      purchaseOption: PropTypes.string.isRequired,
      pricePerUnit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      unit: PropTypes.string.isRequired,
      leaseContractLength: PropTypes.string.isRequired,
      upfrontFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      monthlyTotalPrice: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default AwsPricingList;

// import React from 'react'

// const AwsPricingList = () => {
//   return (
//     <div>Insert AWS Pricing Info HERE</div>
//   )
// }

//export default AwsPricingList

