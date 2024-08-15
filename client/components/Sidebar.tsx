import React, { ReactElement, FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaDocker } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
import { IoIosCloud } from "react-icons/io";

const Sidebar: FC = (): ReactElement => {
  const location = useLocation();

  const navigation = [
    { name: 'Configuration', href: '/configuration', icon: GrDocumentConfig },
    { name: 'Pricing', href: '/pricing', icon: GiDiamondTrophy },
    // { name: 'AWS Deployment', href: '/aws', icon: IoIosCloud },
    { name: 'Performance', href: '/performance', icon: MdOutlineMonitorHeart },
  ];

  function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <nav className="bg-main-hover text-white w-64 min-h-screen flex flex-col">
      <div className="py-6">
        <ul className="space-y-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <div className={classNames(location.pathname === item.href ? 'bg-gray-700 flex items-center px-4' : 'flex items-center px-4')}>
                <item.icon className="text-gray-300" />
                <Link
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-white',
                    'ml-2 p-2 rounded'
                  )}
                >
                  {item.name}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;