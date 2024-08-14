import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setRegion, setServerType, setOperatingSystem, setPricingData, setLoading, setError } from '../Redux/slices/awsSlice';
import DeployModal from './DeployModal';

const regions = [
  'US East (N. Virginia)',
  'US East (Ohio)',
  'US West (N. California)',
  'US West (Oregon)',
  'Canada (Central)',
  'Canada West (Calgary)',
];

const serverTypes = [
  't2.micro',
  't4g.nano',
  't3a.nano',
  't3.nano',
  't2.nano',
  't4g.micro',
  't3g.micro',
  't4.micro',
  't3.micro',
  't4g.small',
  't3a.small',
];

const operatingSystems = [
  'Linux',
  'Windows Server',
  'Red Hat Enterprise Linux',
  'SUSE Linux Enterprise Server',
  'Ubuntu Pro',
];

const PricingForm = ({onDisplayScreen}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serverType = useSelector((state) => state.aws.serverType);
  const region = useSelector((state) => state.aws.region);
  const operatingSystem = useSelector((state) => state.aws.operatingSystem);
  const error = useSelector((state) => state.aws.error); 
  const shardsValue = useSelector(state => state.slider.shardsValue);
  const replicasValue = useSelector(state => state.slider.replicasValue);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!region || !serverType || !operatingSystem) {
      dispatch(setError('Please fill in all fields.'));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(''));

    try {
      const response = await fetch('/api/getPricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region, serverType, operatingSystem, shardsValue, replicasValue: replicasValue + 1}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      dispatch(setPricingData(data));
      navigate('/pricing-display'); // Navigate to the PricingDisplay component
    } catch (error) {
      dispatch(setError('There was an error fetching the pricing data.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegionChange = (e) => {
    dispatch(setRegion(e.target.value));
  };

  const handleServerTypeChange = (e) => {
    dispatch(setServerType(e.target.value));
  };

  const handleOperatingSystemChange = (e) => {
    dispatch(setOperatingSystem(e.target.value));
  };

  return (
    <div className="flex w-full container bg-black text-white space-x-20">
      <div className=''>
        <h2 className="text-center text-3xl section-header font-bold">Redis Configuration</h2>
        <div className='text-2xl pt-10'>
          <label className="text-white">Shards:{shardsValue}</label>
        </div>
        <div className='text-2xl pt-5'>
          <label className="text-white">Replicas:{replicasValue}</label>
        </div>
        <div className='text-3xl pt-10'>
          <label className="border border-2 p-4 border-red text-white">Total Nodes:{shardsValue * (replicasValue+1)}</label>
        </div>
      </div>
      <div>
      <h2 className="text-center text-3xl section-header font-bold">AWS Deployment Pricing</h2>
      <div className="dropdown-container mt-4">
        <div className="dropdown-menu">
          <label htmlFor="options1" className="text-white">Select a region:</label>
          <select
            id="options1"
            value={region}
            onChange={handleRegionChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 text-black"
          >
            <option value="">Select a region</option>
            {regions.map((regionOption, index) => (
              <option key={index} value={regionOption}>{regionOption}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-menu">
          <label htmlFor="options2" className="text-white">Select a server type:</label>
          <select
            id="options2"
            value={serverType}
            onChange={handleServerTypeChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 text-black"
          >
            <option value="">Select a server type</option>
            {serverTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-menu redis-form-input">
          <label htmlFor="options3" className="text-white">Select an operating system:</label>
          <select
            id="options3"
            value={operatingSystem}
            onChange={handleOperatingSystemChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 text-black"
          >
            <option value="">Select an operating system</option>
            {operatingSystems.map((osOption, index) => (
              <option key={index} value={osOption}>{osOption}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      </div>
    </div>
  );
};

export default PricingForm;