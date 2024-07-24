import React, { useState, ReactElement, FC } from "react";
import { Link } from "react-router-dom";
import { FaDocker } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
import { IoIosCloud } from "react-icons/io";

const Sidebar: FC = (): ReactElement => {
  return (
    <nav className="bg-main-hover text-white w-64 min-h-screen flex flex-col px-4">
      <div className="px-4 py-6">
        <ul className="space-y-4">
          <li>
            <div className="flex items-center">
              <GrDocumentConfig className="text-gray-300" />
              <Link
                to="/configuration"
                className="text-gray-300 hover:text-white ml-2"
              >
                Configuration
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <GiDiamondTrophy className="text-gray-300" />
              <Link
                to="/pricing"
                className="text-gray-300 hover:text-white ml-2"
              >
                Pricing
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <IoIosCloud className="text-gray-300" />
              <Link to="/aws" className="text-gray-300 hover:text-white ml-2">
                AWS Deployment
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <MdOutlineMonitorHeart className="text-gray-300" />
              <Link
                to="/performance"
                className="text-gray-300 hover:text-white ml-2"
              >
                Performance
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Sidebar;
