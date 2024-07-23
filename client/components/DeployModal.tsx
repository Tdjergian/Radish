import React, { useState, FC, ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppDispatch } from "../Redux/store";

const DeployModal: FC = ():ReactElement => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);

  const closeModal = () => {setShow(false)};
  const openModal = () => {setShow(true)};

  return (
  <div>
      <div>
        <Button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={openModal} variant="primary">Ready to Build!</Button>
      </div>
      <Modal id='modal-container' className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' show={show} onClick={closeModal} onHide={closeModal}> 
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
              <input type='text' className='border border-gray-300 rounded w-full p-2' />
            </div>
            <footer>
              <Button  className='text-black mt-4 bg-grey-500 py-2 px-4 rounded' onClick={closeModal}>Close</Button>
              <Button  className='text-black mt-4 bg-red-800 py-2 px-4 rounded'>CREATE THE CLUSTER</Button>
            </footer>
          </div>
        </div>
      </Modal>

  </div>
  );
};

export default DeployModal;