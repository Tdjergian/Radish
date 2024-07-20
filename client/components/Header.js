// import React, { ReactElement } from "react";
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import {logoutUser, resetUser} from '../Redux/slices/userSlice';
// import { FC } from "react";

// const Header : FC = (): ReactElement => {
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold">RADISH</span>
        </div>
        <div className="flex space-x-4">
        <div className='text-center m-2'>
          <Link to='/register'>Register</Link>
        </div>
        <div>
          {user ? (
            <button 
              className="flex items-center justify-center m-2"
              onClick={() => {
              fetch('/api/users/logout')
              dispatch(logoutUser());
              dispatch(resetUser());
              navigate('/');
            }}
            >
              <span className="flex items-center">
                <FaSignOutAlt className="mr-1" style={{ lineHeight: 1 }} />
                <span style={{ verticalAlign: "middle" }}>Logout</span>
              </span>
            </button>
          ) : (
            <Link className="flex items-center justify-center m-2" to='/login'>
              <span className="flex items-center">
                <FaSignInAlt className="mr-1" style={{ lineHeight: 1 }} />
                <span style={{ verticalAlign: "middle" }}>Login</span>
              </span>
            </Link>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
