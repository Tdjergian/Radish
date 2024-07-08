import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {awsPricingController} from('./awsPricingController')

function PricingUI () {
    console.log(awsPricingController)
    return (
        <div className="Pricing-UI">
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
        </div>
      );
}

module.exports = PricingUI