import React from 'react';
import PropTypes from 'prop-types';

const AwsPricingList = ({ pricingData }) => {
  return (
    <div className="aws-pricing-list">
      <table>
        <thead>
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
        <tbody>
          {pricingData.map((item) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
