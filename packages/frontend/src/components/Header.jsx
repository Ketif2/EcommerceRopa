import React from 'react'
import { CiSearch } from "react-icons/ci";
import { PiUser } from "react-icons/pi";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between bg-primary">
      <button 
        className="text-white"
        onClick={() => navigate('/')}
      >
        <IoIosArrowBack className='size-8' />
      </button>
      
      <div className="flex-1 mx-4">
        <div className="relative w-3/5 mx-auto">
          <input
            type="text"
            className="relative w-full px-4 py-2 bg-secondary text-white rounded-full focus:outline-none text-sm"
            placeholder="Buscar..."
          />
          <CiSearch className="absolute right-4 top-1.5 text-white size-6" />
        </div>
      </div>
      <button className="text-white ml-auto">
        <PiUser className='size-8' />
      </button>
    </div>
  );
};

export default Header