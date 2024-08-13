import React, { useState, FC, ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import { setCurrentIps } from "../Redux/slices/realClusterData";

const DeployModal: FC = ():ReactElement => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [clusterName, setClusterName] = useState('');
  const [amiPublicKey, setAmiPublicKey] = useState('');
  const [amiSecretKey, setAmiSecretKey] = useState('');
  const [vpcID, setVpcID] = useState('');
  const [subnetId, setSubnetId] = useState('');
  const [keyPairName, setKeyPairName] = useState('');

  const redisState = useAppSelector((state) => state.redis);
  const awsState = useAppSelector((state) => state.aws);
  const sliderState = useAppSelector((state) => state.slider);

  const closeModal = () => {setShow(false)};
  const openModal = () => {setShow(true)};

  const createEC2Cluster = async () => {

    console.log('req.body: ', {
      clusterName,
      amiPublicKey,
      amiSecretKey,
      vpcID,
      subnetId,
      keyPairName,
      ...redisState,
      ...awsState,
      ...sliderState,
    })
    const response = await fetch('/api/testSecurityGroupAndEC2Launch', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clusterName,
        amiPublicKey,
        amiSecretKey,
        vpcID,
        subnetId,
        keyPairName,
        ...redisState,
        ...awsState,
        ...sliderState,
      }),
    });
    const ips = await response.json();
    dispatch(setCurrentIps(ips));

  };



  return (
  <div>
      <div>
        <Button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={openModal} variant="primary">Ready to Build!</Button>
      </div>
      <Modal id='modal-container' className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' show={show} onHide={closeModal}> 
        <div className='flex items-center justify-center min-h-screen p-4'>
          <div className='bg-white rounded-lg shadow-lg max-w-sm mx-auto w-full p-6'>
            <header className='text-black'>
              <Modal.Title className='text-black'>You're ready to deploy!</Modal.Title>
            </header>
            <div>
              <p className='text-black'>We'll just need a few details</p>
            </div>
            <div>
              <label className='text-black'>Name your cluster</label>
              <input type='text' value={clusterName} onChange={e => {console.log(e.target.value); setClusterName(e.target.value)}} className='text-black border border-gray-300 rounded w-full p-2' />
              <label className="text-black">AMI Public Key</label>
              <input type='text' value={amiPublicKey} onChange={e => {console.log(e.target.value); setAmiPublicKey(e.target.value)}} className='text-black border border-gray-300 rounded w-full p-2' />
              <label className="text-black">AMI Secret Key</label>
              <input type='text' value={amiSecretKey} onChange={e => {console.log(e.target.value); setAmiSecretKey(e.target.value)}} className='text-black border border-gray-300 rounded w-full p-2' />
              <label className="text-black">VPC ID</label>
              <input type='text' value={vpcID} onChange={e => {console.log(e.target.value); setVpcID(e.target.value)}} className='text-black border border-gray-300 rounded w-full p-2' />
              <label className="text-black">Subnet ID</label>
              <input type='text' value={subnetId} onChange={e => {console.log(e.target.value); setSubnetId(e.target.value)}} className='text-black border border-gray-300 rounded w-full p-2' />
              <input type="text" value={keyPairName} onChange={e => {console.log(e.target.value); setKeyPairName(e.target.value)}} className='text-black border border-gray-300 rounded w-full p-2' />
            </div>
            <footer>
              <Button  className='text-black mt-4 bg-grey-500 py-2 px-4 rounded' onClick={closeModal}>Close</Button>
              <Button  className='text-black mt-4 bg-red-800 py-2 px-4 rounded' onClick={createEC2Cluster}>CREATE THE CLUSTER</Button>
            </footer>
          </div>
        </div>
      </Modal>

  </div>
  );
};

export default DeployModal;