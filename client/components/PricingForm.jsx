import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const PricingForm = ({ onPricingData }) => {
  const [region, setRegion] = useState('');
  const [instanceType, setInstanceType] = useState('');
  const [os, setOs] = useState('');
  const shardsValue = useSelector(state => state.slider.shardsValue);
  const replicasValue = useSelector(state => state.slider.replicasValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { region, instanceType, os, shardsValue, replicasValue });

    try {
      const response = await fetch('/test/getPricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region, instanceType, os, shardsValue, replicasValue }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data:', data);
      onPricingData(data);  // Pass data to parent component
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container bg-black p-4 text-white">
      <h2 className="text-center">AWS Pricing for Your Custom Redis Config</h2>
      <div className="text-box">AWS Options</div>
      <div className="visualization">Visualization</div>
      <div className="text-box">Pricing Data</div>
      <div className="dropdown-container mt-4">
        <div className="dropdown-menu">
          <label htmlFor="options1" className="text-white">Select a region:</label>
          <select
            id="options1"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
          >
            <option value="US East (N. Virginia)" className="text-black">US-EAST (N.Virginia)</option>
            <option value="US East (Ohio)" className="text-black">US-EAST (Ohio)</option>
            <option value="US West (N. California)" className="text-black">US-WEST (N.California)</option>
            <option value="US West (Oregon)" className="text-black">US-WEST (Oregon)</option>
            <option value="Canada (Central)" className="text-black">Canada (Central)</option>
            <option value="Canada West (Calgary)" className="text-black">Canada West (Calgary)</option>
          </select>
        </div>
        <div className="dropdown-menu">
          <label htmlFor="options2" className="text-white">Select an instance type:</label>
          <select
            id="options2"
            value={instanceType}
            onChange={(e) => setInstanceType(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
          >
            <option value="t2.micro" className="text-black">t2.micro</option>
            <option value="t4g.nano" className="text-black">t4g.nano</option>
            <option value="t3a.nano" className="text-black">t3a.nano</option>
            <option value="t3.nano" className="text-black">t3.nano</option>
            <option value="t2.nano" className="text-black">t2.nano</option>
            <option value="t4g.micro" className="text-black">t4g.micro</option>
            <option value="t3g.micro" className="text-black">t3g.micro</option>
            <option value="t4.micro" className="text-black">t4.micro</option>
            <option value="t3.micro" className="text-black">t3.micro</option>
            <option value="t4g.small" className="text-black">t4g.small</option>
            <option value="t3a.small" className="text-black">t3a.small</option>
          </select>
        </div>
        <div className="dropdown-menu redis-form-input">
          <label htmlFor="options3" className="text-white">Select an operating system:</label>
          <select
            id="options3"
            value={os}
            onChange={(e) => setOs(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
          >
            <option value="Linux" className="text-black">Linux</option>
            <option value="Windows Server" className="text-black">Windows Server</option>
            <option value="Red Hat Enterprise Linux" className="text-black">Red Hat Enterprise Linux</option>
            <option value="SUSE Linux Enterprise Server" className="text-black">SUSE Linux Enterprise Server</option>
            <option value="Ubuntu Pro" className="text-black">Ubuntu Pro</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

PricingForm.propTypes = {
  onPricingData: PropTypes.func.isRequired,
};

export default PricingForm;
